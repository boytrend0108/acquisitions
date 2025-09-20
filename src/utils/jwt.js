import logger from '#config/logger.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-plese-change-in-production';
const EXPIRES_IN = '1d';

export const jwtToken = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
    } catch (error) {
      logger.error('Failed to sign JWT token:', error);
      return null;
    }
  },

  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Failed to verify JWT token:', error);
      throw new Error('Invalid or expired token');
    }
  },
};
