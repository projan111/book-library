import {config as conf} from 'dotenv';
conf();

const _config = {
  port: process.env.PORT,
  databaseURI: process.env.MONGODB_URI,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  cloudinary_cloud: process.env.CLOUDINARY_CLOUD,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_secret: process.env.CLOUDINARY_SECRET,
  frontend_domain: process.env.FRONTEND_DOMAIN,
}

export const config = Object.freeze(_config);