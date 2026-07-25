import type { Request, Response } from 'express';

import SendResponse from '../utils/response.util.js';
import HealthService from '../services/health.service.js';

export default class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  getHealth = async (_request: Request, response: Response) => {
    const respond = new SendResponse(response);
    const result = await this.healthService.getHealthStatus();
    const statusCode = result.database === 'up' ? 200 : 503;

    return respond
      .status(statusCode)
      .success(statusCode === 200)
      .code(statusCode)
      .desc('Health status retrieved')
      .responseData(result)
      .send();
  };
}
