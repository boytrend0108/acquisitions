import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const hashPassword = async password => {
  try {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
  } catch (e) {
    logger.error('error hashing password', e);
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    logger.error('Error comparing passwords', e);
    throw new Error('Error comparing passwords');
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await comparePassword(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = existingUser;
    return userWithoutPassword;
  } catch (e) {
    logger.error('Authentication error', e);
    throw e;
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.created_at,
      });

    logger.info(`User created: ${email}`);
    return newUser;
  } catch (e) {
    console.log('Error creating user>>>>>>>>>>>', e);
    logger.error('Error creating user', e);
    throw new Error('Error creating user');
  }
};
