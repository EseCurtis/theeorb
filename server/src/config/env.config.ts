const Env = {
  PORT: Number(process.env.PORT) || 4000,
  DATABASE_URL: process.env.DATABASE_URL!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
  GEMINI_MODEL: process.env.GEMINI_MODEL ?? 'gemini-3.6-flash',
  GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID ?? '',
  GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET ?? '',
  GMAIL_REDIRECT_URI: process.env.GMAIL_REDIRECT_URI ?? '',
  GMAIL_TOKEN_ENCRYPTION_KEY: process.env.GMAIL_TOKEN_ENCRYPTION_KEY ?? '',
  JWT_SECRET: process.env.JWT_SECRET!,
  PASSWORD_RESET_TTL_MINUTES: Number(process.env.PASSWORD_RESET_TTL_MINUTES) || 30,
  WEB_APP_ORIGINS: process.env.WEB_APP_ORIGINS ?? 'http://localhost:3005,http://localhost:3006',
};

export const inProd = process.env.NODE_ENV === 'production';
export const inDev = process.env.NODE_ENV === 'development';

export default Env;
