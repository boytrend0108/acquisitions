import logger from '#config/logger.js';
import { createUser, authenticateUser } from '#services/auth.service.js';
import { formatValidationErrors } from '#utils/format.js';
import { jwtToken } from '#utils/jwt.js';
import { signUpSchema, signInSchema } from '#validations/auth.validation.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    const user = await createUser({ name, email, password, role });
    const token = jwtToken.sign({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    cookies.set(res, 'token', token);

    logger.info(`User signed up: ${email}`);
    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (e) {
    logger.error('Signup error', e);

    if (e.message === 'User already exists') {
      return res.status(409).json({ error: 'User already exists' });
    }

    next(e);
  }
};

export const signout = async (req, res) => {
  cookies.clear(res, 'token');

  logger.info('User signed out');
  res.status(200).json({
    message: 'User signed out successfully',
  });
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });
    const token = jwtToken.sign({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    cookies.set(res, 'token', token);

    logger.info(`User signed in: ${email}`);
    res.status(200).json({
      message: 'User signed in successfully',
      user,
    });
  } catch (e) {
    logger.error('Signin error', e);

    if (e.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    next(e);
  }
};
