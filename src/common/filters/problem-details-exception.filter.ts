import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { ProblemDetailsException } from '../exceptions/problem-details.exception';
import { ProblemDetails } from '../types';

@Catch()
export class ProblemDetailsExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    let problemDetails: ProblemDetails;
    let status: number;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof ProblemDetailsException) {
      const responseBody = exception.getResponse() as any;
      problemDetails = {
        type: responseBody.type || 'about:blank',
        title: responseBody.title || 'Error',
        status: exception.getStatus(),
        detail: responseBody.detail || 'An error occurred.',
        instance: responseBody.instance || request.url,
        errorCode: responseBody.code,
        errors: responseBody.errors,
      };
      status = exception.getStatus();
    } else if (exception instanceof HttpException) {
      // NestJS HttpException
      status = exception.getStatus();
      const responseBody = exception.getResponse() as any;
      problemDetails = {
        type: 'about:blank',
        title: HttpStatus[status] || 'Error',
        status: status,
        detail:
          typeof responseBody === 'string'
            ? responseBody
            : responseBody.message || 'An error occurred.',
        instance: request.url,
      };
    } else {
      // Unknown exception
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      problemDetails = {
        type: 'about:blank',
        title: 'Internal Server Error',
        status: status,
        detail: 'An unexpected error occurred.',
        instance: request.url,
      };
    }

    // Log error to Sentry
    Sentry.withScope((scope) => {
      if (exception instanceof ProblemDetailsException) {
        scope.setTag('errorCode', problemDetails.errorCode);
        scope.setExtra('title', problemDetails.title);
        scope.setExtra('detail', problemDetails.detail);
        scope.setExtra('status', problemDetails.status);
        scope.setExtra('instance', problemDetails.instance);
        scope.setExtra('type', problemDetails.type);
        if (problemDetails.errors) {
          scope.setExtra('errors', problemDetails.errors);
        }
      } else if (exception instanceof HttpException) {
        scope.setExtra('title', problemDetails.title);
        scope.setExtra('detail', problemDetails.detail);
        scope.setExtra('status', problemDetails.status);
        scope.setExtra('instance', problemDetails.instance);
      } else {
        scope.setExtra('detail', problemDetails.detail);
        scope.setExtra('status', problemDetails.status);
        scope.setExtra('instance', problemDetails.instance);
      }

      Sentry.captureException(exception);
    });

    response.status(status).json(problemDetails);
  }
}
