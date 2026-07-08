import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error occurred' };

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message || 'Error occurred';

    // Make sure errors is always an array
    let errors: any[] = [];
    if (typeof exceptionResponse === 'object') {
      if (Array.isArray(exceptionResponse.message)) {
        errors = exceptionResponse.message;
      } else if (exceptionResponse.errors) {
        errors = Array.isArray(exceptionResponse.errors)
          ? exceptionResponse.errors
          : [exceptionResponse.errors];
      } else {
        errors = [message];
      }
    } else {
      errors = [message];
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('Unhandled Exception:', exception);
    }

    response.status(status).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
      requestId:
        request.headers['x-request-id'] ||
        `req-${Math.random().toString(36).substring(2, 9)}`,
    });
  }
}
