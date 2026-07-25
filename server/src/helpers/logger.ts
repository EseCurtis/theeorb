import dayjs from 'dayjs';
import winston from 'winston';

import { inProd } from '../config/env.config.js';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => dayjs().format('YYYY-MM-DD hh:mm:ss A'),
    }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (!inProd) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: () => dayjs().format('YYYY-MM-DD hh:mm:ss A'),
        }),
        winston.format.printf(
          ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
        ),
      ),
    }),
  );
}

export default logger;
