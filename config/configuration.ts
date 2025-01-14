export default () => ({
  sentryDsn: process.env.SENTRY_DSN,
  database: {
    mongodbUri: process.env.MONGODB_URI,
    databaseName: process.env.MONGODB_DATABASE_NAME,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    encryptionKey: process.env.JWT_ENCRYPTION_KEY,
  },
  msg91: {
    sendOtpUrl: process.env.MSG91_SEND_OTP_URL,
    verifyOtpUrl: process.env.MSG91_VERIFY_OTP_URL,
    resendOtpUrl: process.env.MSG91_RESEND_OTP_URL,
    authKey: process.env.MSG91_AUTH_KEY,
    templateId: process.env.MSG91_TEMPLATE_ID,
    otpExpiryInMinutes: process.env.MSG91_OTP_EXPIRY_IN_MINUTES
  }
});