# Server Rules

**Continuity:** Read `.agent/shared-mind.txt` at start. Update it + run `.agent/scripts/agen-run.sh .agent/post-agent-run.acmd` before exit. See `.agent/Agent.Continuity.RULES.md`.

These rules define how to build and extend a backend that matches the structure, conventions, and operational style of this server. Treat this as a strict development contract. New backend work must follow these rules unless a deliberate architecture change is approved and documented.

## 1. Backend Shape Is Fixed

The backend lives in `server/server`.

Do not flatten, rename, or reorganize the backend without a migration plan.

Required structure:

```txt
server/server/
  prisma/
    schema.prisma
    migrations/
    seed.ts
  scripts/
  swagger/
    swagger.json
  src/
    config/
    constants/
    controllers/
    enums/
    graphql/
    helpers/
    jobs/
    middleware/
    prompts/
    routes/
    schemas/
    services/
      plugins/
    templates/
    trigger/
    types/
    utils/
    index.ts
    swagger-setup.ts
```

Every new feature must be split by responsibility:

- `routes/`: Express route registration only.
- `controllers/`: request parsing, auth user access, orchestration, response sending.
- `services/`: business logic and persistence operations.
- `schemas/`: Zod validation schemas.
- `types/`: shared TypeScript request, response, and domain types.
- `constants/`: named constants and enum-like values not stored in Prisma.
- `helpers/`: reusable pure or mostly pure transformation helpers.
- `utils/`: cross-cutting utilities such as response wrappers, exceptions, JWT, Prisma client, email, date helpers.
- `config/`: third-party client initialization and environment access.
- `services/plugins/`: third-party provider wrappers only.
- `swagger/swagger.json`: manually maintained API documentation.

Do not put persistence-heavy business logic directly in routes.

Do not put Express `Request` or `Response` objects in services.

Do not put third-party SDK setup directly in controllers.

## 2. Runtime And TypeScript Rules

This backend is a Node.js TypeScript ES module backend.

Hard requirements:

- Node must be `>=18.0.0`.
- `package.json` must keep `"type": "module"`.
- TypeScript source files must use ES module syntax.
- Relative imports between local TypeScript files must use the emitted `.js` extension.
- Do not import local backend files with `.ts` extensions.
- Do not introduce CommonJS `require`.
- Keep `strict: true` in `tsconfig.json`.
- Keep `module: "ESNext"` and `target: "ES2022"`.

Correct:

```ts
import ProductService from '../services/product.service.js';
import { validate } from '../middleware/validate.js';
```

Wrong:

```ts
import ProductService from '../services/product.service';
import ProductService from '../services/product.service.ts';
const ProductService = require('../services/product.service');
```

## 3. File Naming Rules

Use lowercase kebab-case for feature files and suffix files by layer.

Required naming:

- Routes: `feature.route.ts`
- Controllers: `feature.controller.ts`
- Services: `feature.service.ts`
- Plugin services: `provider.service.ts`
- Schemas: `feature.schema.ts`
- Constants: `feature.constant.ts`
- Types: `feature.types.ts`
- Helpers: `feature.helpers.ts` or `common.helpers.ts`
- Middleware: `feature.middleware.ts`
- Jobs: `feature.job.ts`

Examples:

```txt
src/routes/business-following.route.ts
src/controllers/business-following.controller.ts
src/services/business-following.service.ts
src/schemas/business-following.schema.ts
src/constants/feature-flags.constant.ts
src/types/payments.types.ts
src/services/plugins/stripe.service.ts
```

Do not use mixed naming such as `ProductRoute.ts`, `productRoutes.ts`, or `product.router.ts`.

Existing inconsistent names may remain for compatibility, but new files must follow the required naming.

## 4. Entry Point Rules

`src/index.ts` is the only app bootstrap file.

It is responsible for:

- Loading `dotenv/config`.
- Creating the Express app.
- Registering global body parsers.
- Registering CORS.
- Registering the root health endpoint.
- Registering request logging middleware.
- Mounting Swagger with `swaggerSetup(app, port)`.
- Mounting all feature routes under a versioned API prefix such as `/api/v1`.
- Starting the HTTP server.
- Wiring WebSocket servers.
- Importing side-effect services such as cron invokers only when necessary.

Every new route module must be imported in `src/index.ts`, added to the `routes` array, and mounted through the existing loop:

```ts
const routes = [
  userRoute,
  businessRoute,
  productRoute,
];

routes.forEach(route => {
  app.use('/api/v1', route);
});
```

Do not mount a normal API route outside the `routes` array unless it needs special body parsing or server-level behavior.

Versioning rules:

- All non-system backend API endpoints must live under `/api/v1` or a later explicit version such as `/api/v2`.
- New feature routes must never be mounted directly under `/api`.
- Root probes such as `/`, `/health`, and documentation routes such as `/api/docs` may stay unversioned because infrastructure and humans depend on stable discovery paths.
- If a breaking API contract is introduced, create the next version prefix and keep the old version available until consumers are migrated.
- Frontend API clients must call versioned endpoints; do not hide an unversioned backend path behind a frontend helper.

Webhook routes that need raw bodies must define raw parsing in their route module, not through global middleware.

## 5. Route Rules

Routes must be thin.

A route file may:

- Create an Express `Router`.
- Instantiate exactly one primary controller for the feature.
- Register endpoint paths.
- Apply auth middleware.
- Apply feature access middleware.
- Apply rate limiters.
- Apply Zod validation middleware.
- Wrap async controller handlers with `CatchErrors`.
- Export the router as default.

Required pattern:

```ts
import { Router } from 'express';
import passport from '../middleware/jwt.token.js';
import FeatureController from '../controllers/feature.controller.js';
import { CatchErrors } from '../middleware/catchErrors.js';
import { validate } from '../middleware/validate.js';
import { FeatureRequestSchema } from '../schemas/feature.schema.js';

const router = Router();
const featureController = new FeatureController();

router.post(
  '/feature',
  passport.authenticate('jwt', { session: false }),
  validate(FeatureRequestSchema),
  CatchErrors(featureController.createFeature.bind(featureController))
);

export default router;
```

Route order matters. Put specific routes before dynamic parameter routes.

Correct:

```ts
router.get('/products/search', CatchErrors(controller.searchProducts.bind(controller)));
router.get('/product/:id', CatchErrors(controller.getProduct.bind(controller)));
```

Wrong:

```ts
router.get('/product/:id', CatchErrors(controller.getProduct.bind(controller)));
router.get('/product/search', CatchErrors(controller.searchProducts.bind(controller)));
```

Authentication rules:

- Use `passport.authenticate('jwt', { session: false })` for protected endpoints.
- Add `isVerified` when the action requires a verified user.
- Use `optionalAuth` only when the endpoint must support both authenticated and anonymous users.
- Use `subscriptionRestriction(FeatureAccessEnum.X)` for plan-limited business features.
- Apply rate limiters before validation when the endpoint is abuse-prone.

All async route handlers must use `CatchErrors(...)` unless the handler is intentionally self-contained and already returns all errors in the controller. Prefer `CatchErrors`.

## 6. Controller Rules

Controllers must be classes with service dependencies initialized in the constructor.

Required shape:

```ts
export default class FeatureController {
  private featureService: FeatureService;

  constructor() {
    this.featureService = new FeatureService();
  }

  createFeature = async (req: Request, res: Response) => {
    const respond = new SendResponse(res);
    const user = req.user as JwtPayload;
    const payload = req.body;

    const result = await this.featureService.createFeature(user.id, payload);

    return respond
      .status(201)
      .success(true)
      .code(201)
      .desc('Feature created successfully')
      .responseData(result)
      .send();
  };
}
```

Controller responsibilities:

- Create `const respond = new SendResponse(res)` in each handler.
- Extract `req.user`, `req.params`, `req.query`, and `req.body`.
- Cast authenticated users to `JwtPayload`.
- Parse pagination values using `parseInt(req.query.page as string) || 1`.
- Call services.
- Send response using `SendResponse`.
- Throw `HttpException` or feature-specific exceptions for expected failures.

Controllers may perform orchestration across multiple services.

Controllers may perform request-specific branching such as role checks.

Controllers must not:

- Define Prisma queries for reusable business operations unless the query is small and controller-specific.
- Initialize third-party SDK clients directly.
- Return raw Express responses with inconsistent shapes.
- Use unwrapped JSON such as `res.json(result)` for normal API responses.
- Swallow errors silently.

## 7. Service Rules

Services contain business logic and database operations.

Required shape:

```ts
export default class FeatureService {
  async getFeature(id: string) {
    return prisma.feature.findUnique({
      where: { uuid: id, deletedUtc: null },
    });
  }
}
```

Service rules:

- Use `prisma` from `src/utils/prisma.client.ts`.
- Keep Express types out of services.
- Accept plain primitives or typed payloads.
- Return domain data to controllers.
- Use Prisma transactions for multi-write operations.
- Use `deletedUtc: null` in queries for soft-deletable records.
- Use `uuid` as the external identifier where the model supports it.
- Use `createdUtc`, `deletedUtc`, and existing timestamp fields consistently.
- Keep batching explicit for large imports or provider syncs.

Transaction pattern:

```ts
return prisma.$transaction(async tx => {
  const record = await tx.model.create({ data });
  await tx.relatedModel.createMany({ data: related });
  return record;
});
```

Do not perform multi-step writes without a transaction when partial writes can corrupt business state.

Do not expose third-party SDK response shapes directly if the rest of the application needs a normalized shape.

## 8. Prisma Rules

Use the shared Prisma client only:

```ts
import prisma from '../utils/prisma.client.js';
```

Do not instantiate `new PrismaClient()` outside `src/utils/prisma.client.ts`.

Database changes must be made through Prisma migrations.

Required workflow:

```sh
npm run migrate
npx prisma migrate dev
npx prisma generate
```

Production startup uses:

```sh
npx prisma generate && npx prisma migrate deploy && node ./dist/src/index.js
```

Do not edit generated Prisma client files.

Do not use raw SQL unless Prisma cannot express the query or performance demands it. Raw SQL must be isolated, parameterized, and documented with a short comment.

## 9. Zod Schema Rules

Every request with a body, query, or required params must have a Zod schema in `src/schemas`.

Schemas must extend `RequestSchema` when validating an Express request envelope.

Required pattern:

```ts
export const FeatureCreationSchema = RequestSchema.extend({
  body: z
    .object({
      name: z.string().min(1, 'Feature name is required'),
      businessId: z.string().uuid(),
    })
    .strict(),
});
```

Strict rules:

- Use `.strict()` on object payload schemas.
- Use `z.string().uuid('Invalid UUID format')` for UUID params.
- Use `z.nativeEnum(PrismaEnum)` for Prisma enums.
- Use `z.coerce.date()` for inbound dates.
- Use clear custom messages for user-facing validation errors.
- Validate `body`, `query`, `params`, and `user` through the `validate(schema)` middleware where possible.
- Use `ZodSchemaValidator` inside controllers only when the operation needs special cleanup behavior before returning, such as deleting uploaded media.

Validation failure response is produced by `validate` and must preserve the standard envelope:

```json
{
  "success": false,
  "message": {
    "code": null,
    "desc": "error message"
  },
  "data": {
    "issues": []
  }
}
```

Do not hand-roll validation with scattered `if (!payload.field)` checks when Zod can express it.

## 10. Response Format Rules

All normal API responses must use `SendResponse`.

Required response envelope:

```json
{
  "success": true,
  "message": {
    "code": 200,
    "desc": "Operation completed successfully"
  },
  "data": {}
}
```

Required success pattern:

```ts
return respond
  .status(200)
  .success(true)
  .code(200)
  .desc('Feature successfully retrieved')
  .responseData(result)
  .send();
```

Required failure pattern for controller-level authorization or business checks:

```ts
return respond
  .status(403)
  .success(false)
  .code(403)
  .desc('Driver access required')
  .send();
```

Status, success, and code must agree:

- `status(200).success(true).code(200)` for successful reads.
- `status(201).success(true).code(201)` for successful creates.
- `status(400).success(false).code(400)` for bad requests.
- `status(401).success(false).code(401)` for unauthenticated requests.
- `status(403).success(false).code(403)` for unauthorized access.
- `status(404).success(false).code(404)` for missing records.
- `status(409).success(false).code(409)` for conflicts.
- `status(500).success(false).code(500)` for unexpected failures.

Do not create alternate response shapes.

Do not return top-level `code` or `description` in new controller responses; the server response utility uses `message.code` and `message.desc`.

Swagger examples must match the runtime envelope, even if older definitions do not.

## 11. Error Handling Rules

Expected errors should be thrown and handled by `CatchErrors`.

Use:

```ts
throw new HttpException('Business profile not found', 404);
```

Use feature-specific exceptions when cleanup is required:

```ts
throw new ProductOperationException('Invalid media format', 400, mediaPublicIds);
```

`CatchErrors` is responsible for:

- Logging errors through `logger.error`.
- Mapping Prisma known request errors.
- Mapping Prisma validation errors.
- Mapping `HttpException`.
- Mapping `ProductOperationException`.
- Returning the standard `SendResponse` envelope.

Prisma known error mappings:

- `P2002`: `409`, duplicate value.
- `P2003`: `400`, foreign key constraint failed.
- `P2025`: `404`, record not found.
- `P2023`: `400`, invalid ID format.

Do not duplicate Prisma error mapping in controllers.

Do not leak raw stack traces in API responses.

Unexpected errors may include:

```json
{
  "timestamp": "ISO date",
  "path": "/api/path"
}
```

## 12. Logger Rules

The logger is defined in `src/helpers/logger.ts` and uses Winston plus Day.js.

Required logger configuration:

```ts
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => dayjs().format('YYYY-MM-DD hh:mm:ss A'),
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

Non-production console logging format:

```txt
YYYY-MM-DD hh:mm:ss A level: message
```

Example:

```txt
2026-06-30 04:25:17 PM info: Server started
```

Strict logger rules:

- Use `logger` for application errors that must be retained.
- Use `logger.error(...)` in global error paths.
- File logs must go to `logs/error.log` and `logs/combined.log`.
- Timestamp format must remain `YYYY-MM-DD hh:mm:ss A`.
- Console logging is allowed only outside production.
- Console logger must use `winston.format.colorize()`.
- Console formatter must return exactly `${timestamp} ${level}: ${message}`.
- Do not replace the logger with `console.log` for persistent application errors.
- Do not log secrets, tokens, card data, webhook signatures, authorization headers, or raw private keys.

Permitted `logger.error` shape:

```ts
logger.error(
  error instanceof Error
    ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    : 'Unknown error'
);
```

Temporary `console.log` is acceptable only for local request tracing, one-off scripts, or short-lived migration diagnostics. Production code paths must use the logger for retained diagnostics.

## 13. Environment Config Rules

All environment variables must be accessed through `src/config/env.config.ts`.

Required pattern:

```ts
const Env = {
  PORT: process.env.PORT || 5005,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
};

export const inProd = process.env.NODE_ENV === 'production';
export const inDev = process.env.NODE_ENV === 'development';
export default Env;
```

Rules:

- Do not read `process.env.X` throughout services and controllers.
- Add new variables to `Env`.
- Use non-null assertions only when the app cannot operate without the variable.
- Normalize escaped private keys in config, not in services.
- Keep provider base URLs in config when reused.
- Keep environment checks as `inProd` and `inDev`.

Do not hardcode secrets.

Do not commit `.env` values.

## 14. Plugin Service Rules

Third-party integrations belong in `src/services/plugins`.

Current plugin service examples:

```txt
src/services/plugins/paystack.service.ts
src/services/plugins/stripe.service.ts
src/services/plugins/shopify.service.ts
src/services/plugins/trolley.service.ts
src/services/plugins/woocommerce.service.ts
```

A plugin service must:

- Be a default exported class.
- Encapsulate one provider only.
- Initialize provider SDK clients or base URLs in the constructor or private fields.
- Read secrets and provider URLs from `Env`.
- Convert provider-specific errors into clear application errors.
- Verify webhook signatures inside the plugin service when applicable.
- Return provider IDs or normalized provider objects to domain services.
- Keep provider metadata explicit.

Required shape:

```ts
export default class ProviderService {
  private baseUrl: string = Env.PROVIDER_BASE_URL;
  private secretKey: string;

  constructor() {
    this.secretKey = Env.PROVIDER_SECRET_KEY;
  }

  async createRemoteResource(params: ProviderCreateParams) {
    try {
      const response = await axios.post(`${this.baseUrl}/resource`, params, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Provider resource creation failed:', error.message);
      throw new Error(`Failed to create provider resource: ${error.message}`);
    }
  }
}
```

Webhook plugin rules:

- Stripe webhook routes must use `express.raw({ type: 'application/json' })`.
- Paystack webhook routes must use `express.raw({ type: 'application/json' })`.
- Signature verification must happen before processing the event.
- Do not parse webhook bodies as JSON before signature verification if the provider requires raw body verification.
- Do not log webhook secret values or full raw payloads.

Provider API rules:

- Use official SDKs where already used, such as `stripe`.
- Use `axios` for REST providers such as Paystack.
- Use provider-specific GraphQL only inside the plugin service or `src/graphql`.
- Normalize provider errors into short messages useful to controllers and logs.
- Use typed params instead of loose `any` for new plugin methods.
- Store provider IDs in provider-specific fields such as `customerId`, `subscriptionId`, `shopifyId`, or equivalent model fields.

Do not call provider SDKs directly from controllers.

Do not mix provider-specific logic into general domain services when it can live behind a plugin service.

## 15. Swagger And Docs Rules

Swagger is manually maintained in:

```txt
server/server/swagger/swagger.json
```

Swagger is mounted by:

```txt
server/server/src/swagger-setup.ts
```

Swagger UI route:

```txt
/api/docs
```

Swagger spec version:

```json
{
  "swagger": "2.0"
}
```

Swagger setup rules:

- Read the JSON file from `path.join(process.cwd(), 'swagger', 'swagger.json')`.
- Keep `customSiteTitle` as `Bizconnect API Documentation`.
- Keep authorization persistent with `persistAuthorization: true`.
- Keep request duration visible with `displayRequestDuration: true`.
- Keep filtering enabled with `filter: true`.
- Keep models collapsed with `defaultModelsExpandDepth: 0` and `defaultModelExpandDepth: 0`.
- Hide the top bar with `.swagger-ui .topbar { display: none }`.

Environment server rules:

- `inDev` uses host `devbackend.bizconnect24.com` and scheme `https`.
- Non-development local mode uses `localhost:${port}` and scheme `http`.
- `doc.host`, `doc.schemes`, and `doc.servers` must be derived in `swagger-setup.ts`.

Every new API endpoint must update `swagger/swagger.json` in the same change.

Swagger versioning and contract rules:

- Swagger is mandatory for every backend endpoint.
- Swagger paths for normal API features must be versioned, either with `basePath: "/api/v1"` plus unprefixed paths, or with paths that explicitly start with `/v1`.
- Root probes such as `/` and `/health`, and docs at `/api/docs`, may stay unversioned.
- Request bodies, params, query strings, and response payloads must use Swagger schemas or definitions that match the Zod schemas and TypeScript types.
- Protected endpoints must document their auth requirement through Swagger security metadata.
- Deprecated endpoint versions must be marked clearly and left documented until removed.
- Post-run enforcement runs `.agent/scripts/validate-api-contract.sh` when backend routes, backend entrypoint, or Swagger docs change.

Forbidden:

- Adding a backend route without a matching Swagger path.
- Documenting `/api` as the public base for normal feature endpoints.
- Updating controller/service behavior without updating affected Swagger responses.

Swagger endpoint rules:

- Add or reuse a tag in the top-level `tags` array.
- Add path under `paths`.
- Prefix paths with the same route path registered under the active API version; do not include `/api` inside the path when `basePath` already includes `/api/v1`.
- Include `summary`.
- Include `description` for non-obvious operations.
- Include `tags`.
- Include `security` with `Bearer` for protected endpoints.
- Include `parameters` for path, query, body, and headers.
- Include `responses` for success and known failures.
- Reference reusable definitions with `$ref`.
- Keep examples aligned with the `SendResponse` envelope.

Protected endpoint Swagger security:

```json
"security": [{ "Bearer": [] }]
```

Standard success response definition shape:

```json
{
  "type": "object",
  "properties": {
    "success": { "type": "boolean", "example": true },
    "message": {
      "type": "object",
      "properties": {
        "code": { "type": "integer", "example": 200 },
        "desc": { "type": "string", "example": "Feature successfully retrieved" }
      }
    },
    "data": { "type": "object" }
  }
}
```

Do not document new endpoints with a response shape that uses top-level `code` or `description`.

Docs addition checklist for every endpoint:

- Route exists in `src/routes`.
- Controller method exists.
- Zod schema exists when body/query/params require validation.
- Swagger path exists.
- Swagger tag exists.
- Swagger body schema or definition exists.
- Swagger response schema matches `SendResponse`.
- Auth requirements in Swagger match route middleware.
- Error responses include at least `400`, `401` or `403` when applicable, and `500`.

## 16. Authentication And Authorization Rules

JWT auth is handled through:

```ts
import passport from '../middleware/jwt.token.js';
```

Use this middleware:

```ts
passport.authenticate('jwt', { session: false })
```

Use `req.user as JwtPayload` in controllers after JWT middleware.

Rules:

- Never trust `userId`, `role`, or business ownership from the request body when authenticated user data exists in `req.user`.
- Verify ownership in services or controllers before mutating business-owned records.
- Use `isVerified` for sensitive user actions.
- Use `FeatureAccessEnum` and `subscriptionRestriction` for subscription-gated actions.
- Use role checks for role-specific actions, such as driver-only actions.

Do not create a second JWT strategy or parallel auth system for normal API routes.

Auth response symmetry is mandatory.

This applies to login, signup, password reset, email verification, invite flows, profile/resource lookups, and any endpoint where a response could reveal whether an account or protected resource exists.

Client-facing response rules:

- Login failures must use one generic message and status for all credential failures, such as `Invalid email or password`.
- Signup must not reveal whether an email is already registered. Return the same accepted response either way and send the appropriate email flow server-side.
- Password reset must always respond generically, such as `If that account exists, a reset link has been sent`.
- Verification and invite flows must not reveal whether a token, email, account, invite, or protected resource exists unless the user is already authorized to know.
- Existing-vs-missing and forbidden-vs-not-owned cases must use the same client-facing status code and message for the same access boundary.
- Specific failure reasons such as no user, wrong password, already registered, account locked, token expired, or resource missing belong in server logs only, never in the response body.

Timing rules:

- Nonexistent-user paths must do dummy password hashing or equivalent delay work when real-user paths perform expensive verification.
- Success and failure branches for auth/resource-existence checks must be designed so response timing is not a practical enumeration signal.
- Do not add early returns that make missing-account paths measurably faster than wrong-password or locked-account paths.

Audit checklist for every auth or existence-sensitive endpoint:

- Do all failure branches return the same public message?
- Do all failure branches use the same status code for the same access boundary?
- Do signup and reset responses avoid confirming account existence?
- Does the nonexistent path perform dummy work comparable to the existing path?
- Are detailed reasons logged server-side without leaking to the client?
- Does Swagger document only the generic client-facing responses?

## 17. Middleware Rules

Middleware belongs in `src/middleware`.

Middleware must be composable and route-level unless it is truly global.

Current middleware categories:

- `auth.ts`: identity and verification helpers.
- `jwt.token.ts`: Passport JWT setup.
- `catchErrors.ts`: async error wrapper and error response mapping.
- `validate.ts`: Zod validation middleware.
- `rateLimiter.ts`: abuse prevention.
- `featureAccess.middleware.ts`: subscription feature restriction.
- `featureFlag.middleware.ts`: feature flag checks.

Rules:

- Validation middleware must use `SendResponse`.
- Error middleware must use `logger`.
- Auth middleware must not send inconsistent response envelopes.
- Feature middleware must attach typed data to `req` carefully and document casts in the controller.

## 18. Feature Flags And Subscription Access

Feature flags belong in:

```txt
src/constants/feature-flags.constant.ts
src/services/feature-flag.service.ts
src/middleware/featureFlag.middleware.ts
```

Subscription access belongs in:

```txt
src/middleware/featureAccess.middleware.ts
src/types/auth.ts
```

Rules:

- Define new feature access enum values before using them in routes.
- Use `subscriptionRestriction(FeatureAccessEnum.X)` at route level.
- Read attached feature access from `req` only after middleware has run.
- Keep plan limit logic explicit and fail with `403` when the user must upgrade.

## 19. Constants, Types, And Enums

Use Prisma enums from `@prisma/client` when the value is stored in the database.

Use `src/enums` only for local enums that are not generated by Prisma.

Use `src/constants` for:

- Static business rules.
- Default names.
- Provider constants.
- Feature flag names.
- Notification constants.
- Discount tiers.
- Mapping tables.

Use `src/types` for:

- Payload types.
- Provider event types.
- Request/response domain types.
- Auth user types.
- Shared analytics or messaging types.

Do not duplicate Prisma enum strings in constants.

Do not leave new complex payloads typed as `any`.

## 20. Helper And Utility Rules

Helpers should be reusable and focused.

Use helpers for:

- Formatting records.
- Constructing Prisma where clauses.
- Media validation.
- Date normalization.
- Array segmentation.
- Search query transformations.

Use utils for:

- Response envelope.
- Exceptions.
- Prisma client.
- JWT helpers.
- Email helpers.
- Generic application utilities.

Do not create helpers that depend on Express response objects.

Do not put provider SDK calls in helpers.

## 21. Background Jobs, Scripts, And Triggers

Use:

- `src/jobs` for application jobs.
- `src/services/cron` for cron services and invokers.
- `src/trigger` and `trigger.config.ts` for Trigger.dev schedulers.
- `scripts` for one-off or migration-style operations.

Rules:

- Scripts must be executable through `tsx`.
- Scripts must import the shared Prisma client.
- Scripts must log enough progress for operational safety.
- Scripts that mutate production data must be idempotent or document why they are safe to rerun.
- Add a package script for any script expected to be reused.

Do not import scripts from the main server runtime.

Side-effect imports in `index.ts` are allowed only for runtime services that must start with the app.

## 22. WebSocket Rules

WebSocket servers are attached in `src/index.ts` to the existing HTTP server.

Current pattern:

```ts
const wss = new WebSocketServer({ server, path: '/api/shopping-assistant/live' });

wss.on('connection', (ws, req) => {
  const liveService = new LiveShoppingAssistantService();
  liveService.handleConnection(ws, req);
});
```

Rules:

- Keep WebSocket route paths under `/api`.
- Delegate connection handling to a service.
- Do not put live session business logic in `index.ts`.
- Validate auth/session metadata inside the live service.

## 23. API Path Rules

Versioning conventions:

- Normal feature endpoints must be mounted under `/api/v1` or a later explicit version such as `/api/v2`.
- New feature routes must never be mounted directly under bare `/api`.
- Do not include `/api` in route files; `index.ts` mounts the versioned prefix.
- If a breaking API contract is introduced, create the next version prefix and keep the old version available until consumers are migrated.
- Frontend API clients must call versioned endpoints; do not hide an unversioned backend path behind a frontend helper.

Path conventions:

- Collection read: `GET /features`
- Single read: `GET /feature/:id`
- Create: `POST /feature`
- Update: `PUT /feature/:id`
- Delete: `DELETE /feature/:id`
- Nested business resources: `/business/:businessId/...`
- Search endpoints: `/features/search`
- Analytics endpoints: `/features/:id/analytics`
- Webhooks: `POST /provider-purpose-webhook`

Use lowercase paths.

Use plural nouns for collections and singular nouns where the existing API does.

Only root probes such as `/`, `/health`, and documentation routes such as `/api/docs` may stay unversioned.

## 24. Pagination, Search, And Filtering

Pagination defaults:

```ts
const page = parseInt(req.query.page as string) || 1;
const limit = parseInt(req.query.limit as string) || 10;
```

Service pagination response should include:

```ts
{
  pagination: {
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    hasNextPage,
    hasPreviousPage,
  }
}
```

Search where-clause construction should live in helpers, not controllers.

Do not repeat search filter construction across controllers.

## 25. Media And Upload Rules

Cloudinary media validation and cleanup must use existing helpers.

Rules:

- Validate uploaded media before persistence.
- Enforce product media limits consistently.
- Use `ProductOperationException` when a product operation failure requires media cleanup.
- Store media as normalized objects with generated IDs, type, and URL/public ID.
- Do not leave orphaned uploaded media after failed product creation.

Current product limits:

- Maximum `5` media items.
- Maximum `2` videos.
- Media type must be `image` or `video`.

## 26. Payment And Transaction Rules

Payment provider logic must flow through plugin services and domain services.

Rules:

- Stripe logic belongs in `StripeService`.
- Paystack logic belongs in `Paystack`.
- Payment orchestration belongs in payment/order/subscription services.
- Controllers may handle webhook endpoint entry but must delegate provider verification and business effects.
- Store provider metadata explicitly.
- Never trust webhook payloads without signature verification.
- Never log card details or authorization headers.
- Use raw body middleware for provider webhooks that require it.

## 27. Import Ordering Rules

Use this import order in new files:

1. Node or built-in modules.
2. External packages.
3. Prisma imports.
4. Internal config/constants/types.
5. Internal helpers/utils.
6. Internal services/controllers/middleware/schemas.

Example:

```ts
import path from 'path';
import { Request, Response } from 'express';
import { Currency } from '@prisma/client';
import Env from '../config/env.config.js';
import { JwtPayload } from '../types/auth.js';
import SendResponse from '../utils/response.util.js';
import FeatureService from '../services/feature.service.js';
```

Do not introduce circular imports.

## 28. Comments Rules

Comments should explain why, not what.

Acceptable:

```ts
// Batch size is kept low to avoid provider rate limits.
const batchSize = 50;
```

Not acceptable:

```ts
// Create a variable named batchSize.
const batchSize = 50;
```

Document non-obvious provider quirks, migration safety assumptions, and business rule exceptions.

## 29. Testing And Verification Rules

Before merging backend changes, run at minimum:

```sh
npm run build
```

When Prisma schema changes:

```sh
npx prisma generate
npx prisma migrate dev
```

When Swagger changes, verify:

```txt
GET /api/docs
```

When route behavior changes, verify the endpoint manually or with tests.

When provider integrations change, verify with provider sandbox/test mode.

Do not claim a backend change is complete if:

- The route is not mounted.
- Swagger was not updated.
- The Zod schema is missing.
- The response envelope differs from `SendResponse`.
- `npm run build` fails.

## 30. New Feature Checklist

Every new feature must complete this checklist:

- Add or update Prisma model/migration if persistence is required.
- Add types in `src/types`.
- Add constants in `src/constants` if needed.
- Add Zod schema in `src/schemas`.
- Add service in `src/services`.
- Add controller in `src/controllers`.
- Add route in `src/routes`.
- Mount route in `src/index.ts`.
- Add plugin service in `src/services/plugins` if a third-party provider is involved.
- Add environment variables to `src/config/env.config.ts`.
- Add Swagger tag, definitions, paths, parameters, security, and responses.
- Use `SendResponse` for all API responses.
- Wrap async handlers with `CatchErrors`.
- Use `logger` for retained error logging.
- Run `npm run build`.

## 31. Strict Prohibitions

Do not:

- Add unmounted routes.
- Add undocumented routes.
- Add controllers that return raw `res.json`.
- Add services that depend on Express `Request` or `Response`.
- Instantiate Prisma outside `src/utils/prisma.client.ts`.
- Read secrets outside `Env`.
- Log secrets or full provider payloads.
- Skip Zod validation for mutable endpoints.
- Use inconsistent response envelopes.
- Call provider SDKs directly from controllers.
- Add CommonJS modules.
- Omit `.js` from local imports.
- Put `/api` inside route paths.
- Add a new Swagger spec file.
- Change logger timestamp format.
- Change log file paths.
- Add business logic to `src/index.ts`.
- Add migrations without reviewing generated SQL.

## 32. Minimal Example For A New Feature

Route:

```ts
import { Router } from 'express';
import passport from '../middleware/jwt.token.js';
import FeatureController from '../controllers/feature.controller.js';
import { CatchErrors } from '../middleware/catchErrors.js';
import { validate } from '../middleware/validate.js';
import { FeatureCreationSchema } from '../schemas/feature.schema.js';

const router = Router();
const featureController = new FeatureController();

router.post(
  '/feature',
  passport.authenticate('jwt', { session: false }),
  validate(FeatureCreationSchema),
  CatchErrors(featureController.createFeature.bind(featureController))
);

export default router;
```

Controller:

```ts
import { Request, Response } from 'express';
import SendResponse from '../utils/response.util.js';
import { JwtPayload } from '../types/auth.js';
import FeatureService from '../services/feature.service.js';

export default class FeatureController {
  private featureService: FeatureService;

  constructor() {
    this.featureService = new FeatureService();
  }

  createFeature = async (req: Request, res: Response) => {
    const respond = new SendResponse(res);
    const user = req.user as JwtPayload;

    const result = await this.featureService.createFeature(user.id, req.body);

    return respond
      .status(201)
      .success(true)
      .code(201)
      .desc('Feature created successfully')
      .responseData(result)
      .send();
  };
}
```

Service:

```ts
import prisma from '../utils/prisma.client.js';
import type { FeatureCreationPayload } from '../types/feature.types.js';

export default class FeatureService {
  async createFeature(userId: string, payload: FeatureCreationPayload) {
    return prisma.feature.create({
      data: {
        userUuid: userId,
        name: payload.name,
      },
    });
  }
}
```

Schema:

```ts
import { z } from 'zod';
import { RequestSchema } from './request.schema.js';

export const FeatureCreationSchema = RequestSchema.extend({
  body: z
    .object({
      name: z.string().min(1, 'Feature name is required'),
    })
    .strict(),
});
```

Index mount:

```ts
import featureRoute from './routes/feature.route.js';

const routes = [
  featureRoute,
];
```

Swagger:

```json
{
  "/feature": {
    "post": {
      "tags": ["Feature"],
      "summary": "Create feature",
      "security": [{ "Bearer": [] }],
      "parameters": [
        {
          "in": "body",
          "name": "body",
          "required": true,
          "schema": { "$ref": "#/definitions/FeatureCreationRequest" }
        }
      ],
      "responses": {
        "201": {
          "description": "Feature created successfully",
          "schema": { "$ref": "#/definitions/FeatureResponse" }
        },
        "400": { "description": "Invalid request" },
        "401": { "description": "Unauthorized" },
        "500": { "description": "Internal server error" }
      }
    }
  }
}
```

This is the minimum standard. Larger features must add ownership checks, transactions, feature restrictions, provider plugins, jobs, and docs as required by their behavior.
