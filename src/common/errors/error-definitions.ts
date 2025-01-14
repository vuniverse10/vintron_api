import { ErrorCode, ErrorCodeType } from "../enums/error-code";

export type ErrorDefinition = {
  code: string;
  errorCode: string;
  message: string;
}

export const ErrorDefinitions: Record<ErrorCodeType, ErrorDefinition> = {
  // Common 000-xx
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    code: "000-01",
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "We are unable to process your request at the moment. Please try again later."
  },

  // MSG91 100-xx
  [ErrorCode.MSG91_AUTH_KEY_NOT_PROVIDED]: {
    code: "100-01",
    errorCode: ErrorCode.MSG91_AUTH_KEY_NOT_PROVIDED,
    message: "We are unable to process your request at the moment. Please try again later."
  },
  [ErrorCode.MSG91_INVALID_AUTH_KEY]: {
    code: "100-02",
    errorCode: ErrorCode.MSG91_INVALID_AUTH_KEY,
    message: "We are unable to process your request at the moment. Please try again later."
  },
  [ErrorCode.MSG91_NO_NUMBER_TO_PROCESS]: {
    code: "100-03",
    errorCode: ErrorCode.MSG91_NO_NUMBER_TO_PROCESS,
    message: "Please enter atleast one number to send sms."
  },
  [ErrorCode.MSG91_OTP_EXPIRED]: {
    code: "100-04",
    errorCode: ErrorCode.MSG91_OTP_EXPIRED,
    message: "The OTP has expired. Please request a new OTP."
  },
  [ErrorCode.MSG91_OTP_INVALID]: {
    code: "100-05",
    errorCode: ErrorCode.MSG91_OTP_INVALID,
    message: "The OTP you entered is invalid. Please enter a valid OTP."
  },
  [ErrorCode.MSG91_NUMBER_NOT_NUMBERIC]: {
    code: "100-06",
    errorCode: ErrorCode.MSG91_NUMBER_NOT_NUMBERIC,
    message: "Mobile number empty or not numeric"
  },
  [ErrorCode.MSG91_NO_OTP_TO_RESEND]: {
    code: "100-07",
    errorCode: ErrorCode.MSG91_NO_OTP_TO_RESEND,
    message: "No OTP request found to retryotp"
  },
  [ErrorCode.MSG91_OTP_RETRY_LIMIT_EXCEEDED]: {
    code: "100-08",
    errorCode: ErrorCode.MSG91_OTP_RETRY_LIMIT_EXCEEDED,
    message: "OTP retry count maxed out"
  }
};