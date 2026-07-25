import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import Env from './config/env.config.js';
import logger from './helpers/logger.js';
import { requestLogger } from './middleware/request-logger.middleware.js';
import healthRoute from './routes/health.route.js';
import { swaggerSetup } from './swagger-setup.js';

const app = express();
const routes = [healthRoute];

app.set('trust proxy', true);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  cors({
    credentials: true,
    origin: Env.WEB_APP_ORIGINS.split(',').map((origin) => origin.trim()),
  }),
);
app.use(requestLogger);

app.get('/', (_request, response) => {
  response.json({
    name: 'api-server',
    status: 'ok',
  });
});

app.get('/health', (_request, response) => {
  response.json({
    service: 'up',
  });
});

routes.forEach((route) => {
  app.use('/api', route);
});

const port = Env.PORT;

swaggerSetup(app, port);

const server = app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});
