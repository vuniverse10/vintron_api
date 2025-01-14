import { HttpException, HttpStatus } from '@nestjs/common';

export class ProblemDetailsException extends HttpException {
  constructor(
    status: HttpStatus,
    title: string,
    detail: string,
    code: string,
    type: string = 'about:blank',
    instance?: string,
    errors?: any[],
  ) {
    super(
      {
        type,
        title,
        status,
        detail,
        code,
        instance,
        errors,
      },
      status,
    );
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
