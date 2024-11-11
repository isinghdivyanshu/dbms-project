import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { prisma } from '../client/client';


const saltRounds = parseInt(process.env.SALT_ROUNDS as string, 10);
const JWT_SECRET = process.env.JWT_SECRET_KEY as string;


export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    // Check if user already exists
    const user = await prisma.manager.findUnique({
      where: { username },
    });

    if (user) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const newUser = await prisma.manager.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json({ manager: userWithoutPassword, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while registering.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.manager.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Wrong password.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    const { password: userPassword, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while logging in.' });
  }
};