const Env = {
  PORT: Number(process.env.PORT) || 4000,
  DATABASE_URL: process.env.DATABASE_URL!,
  WEB_APP_ORIGINS: process.env.WEB_APP_ORIGINS ?? 'http://localhost:3005,http://localhost:3006',
};

export const inProd = process.env.NODE_ENV === 'production';
export const inDev = process.env.NODE_ENV === 'development';

export default Env;
