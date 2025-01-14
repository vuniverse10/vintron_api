export type ErrorCodeType = keyof typeof ErrorCode;

export const ErrorCode: Record<string, string> = {
  // ---------- Common ---------
  INTERNAL_SERVER_ERROR: 'Internal Server Error',

  // ---------- Msg91 ---------
  // Send OTP
  MSG91_NO_NUMBER_TO_PROCESS: 'Please enter atleast one number to send sms.',
  MSG91_AUTH_KEY_NOT_PROVIDED: 'Auth Key missing',
  MSG91_INVALID_AUTH_KEY: "Invalid authkey",

  // Verify OTP
  MSG91_OTP_EXPIRED: "OTP expired",
  MSG91_OTP_INVALID: "OTP not match",

  // Resend OTP
  MSG91_NUMBER_NOT_NUMBERIC: "Mobile number empty or not numeric",
  MSG91_NO_OTP_TO_RESEND: "No OTP request found to retryotp",
  MSG91_OTP_RETRY_LIMIT_EXCEEDED: "OTP retry count maxed out",
}

export const ErrorMessageToCode: Record<string, string> = {};
Object.entries(ErrorCode).forEach(([key, value]) => {
  ErrorMessageToCode[value] = key;
});