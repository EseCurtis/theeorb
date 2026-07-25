import type { Response } from 'express';

type ResponseMessage = {
  code: number | null;
  desc: string;
};

export default class SendResponse {
  private response: Response;
  private httpStatus = 200;
  private isSuccess = true;
  private messageCode: number | null = 200;
  private messageDesc = 'Operation completed successfully';
  private responsePayload: unknown = {};

  constructor(response: Response) {
    this.response = response;
  }

  status(statusCode: number): this {
    this.httpStatus = statusCode;
    return this;
  }

  success(value: boolean): this {
    this.isSuccess = value;
    return this;
  }

  code(value: number | null): this {
    this.messageCode = value;
    return this;
  }

  desc(value: string): this {
    this.messageDesc = value;
    return this;
  }

  responseData(value: unknown): this {
    this.responsePayload = value;
    return this;
  }

  send(): Response {
    const message: ResponseMessage = {
      code: this.messageCode,
      desc: this.messageDesc,
    };

    return this.response.status(this.httpStatus).json({
      success: this.isSuccess,
      message,
      data: this.responsePayload,
    });
  }
}
