import fs from 'node:fs';
import path from 'node:path';

import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import { inDev } from './config/env.config.js';

export function swaggerSetup(app: Express, port: number): void {
  const swaggerPath = path.join(process.cwd(), 'swagger', 'swagger.json');
  const swaggerDocument = JSON.parse(
    fs.readFileSync(swaggerPath, 'utf8'),
  ) as Record<string, unknown>;

  const doc = { ...swaggerDocument };

  if (inDev) {
    doc.host = 'devbackend.bizconnect24.com';
    doc.schemes = ['https'];
    doc.servers = [{ url: 'https://devbackend.bizconnect24.com/api' }];
  } else {
    doc.host = `localhost:${port}`;
    doc.schemes = ['http'];
    doc.servers = [{ url: `http://localhost:${port}/api` }];
  }

  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(doc, {
      customSiteTitle: 'Bizconnect API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        defaultModelsExpandDepth: 0,
        defaultModelExpandDepth: 0,
      },
      customCss: '.swagger-ui .topbar { display: none }',
    }),
  );
}
