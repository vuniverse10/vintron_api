import { HttpStatus } from '@nestjs/common';
import { ErrorDefinition, ProblemDetailsException } from 'src/common';

export class Msg91InternalServerException extends ProblemDetailsException {
  constructor(errorDefinition: ErrorDefinition) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      `We are unable to process your request at the moment. Please try again later.`,
      errorDefinition.code,
      ''
    );
  }
}

export class Msg91OtpExpiryException extends ProblemDetailsException {
  constructor(errorDefinition: ErrorDefinition) {
    super(
      HttpStatus.REQUEST_TIMEOUT,
      'OTP Expired',
      errorDefinition.message,
      errorDefinition.code,
      ''
    );
  }
}

export class Msg91InvalidOtpException extends ProblemDetailsException {
  constructor(errorDefinition: ErrorDefinition) {
    super(
      HttpStatus.UNAUTHORIZED,
      'Invalid OTP',
      errorDefinition.message,
      errorDefinition.code,
      ''
    );
  }
}