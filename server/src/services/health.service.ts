import prisma from '../utils/prisma.client.js';
import type { HealthStatus } from '../types/health.types.js';

export default class HealthService {
  async getHealthStatus(): Promise<HealthStatus> {
    try {
      await prisma.$queryRaw`SELECT 1`;

      return {
        database: 'up',
        service: 'up',
      };
    } catch {
      return {
        database: 'down',
        service: 'up',
      };
    }
  }
}
