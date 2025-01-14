import { HttpStatus } from "@nestjs/common";
import { ErrorDefinition } from "../errors";
import { ProblemDetailsException } from "./problem-details.exception";

export class InternalServerException extends ProblemDetailsException {
  constructor(errorDefinition: ErrorDefinition) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      errorDefinition.message,
      errorDefinition.code,
      ''
    );
  }
}