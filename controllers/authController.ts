// authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, User } from '../Models/User'; // Adjust the import based on your structure
const { body, validationResult } = require('express-validator'); 

const saltRounds = 10; // Salt rounds for password hashing

// Validation middleware for signup
export const DetailsValidation = [
    body('Email').isEmail().withMessage('Email must be valid'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];

  
// Signup function
export const signup = async (req: Request, res: Response) => {
    console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { Email, password } = req.body;
  // Check if the user already exists
  
  const existingUser = await findUserByEmail(Email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create the user
  await createUser(Email, hashedPassword);
  res.status(201).json({ message: 'User registered successfully' });
};

// Login function
export const login = async (req: Request, res: Response) => {
  const { Email, password } = req.body;

  // Find the user
  const user: User | null = await findUserByEmail(Email);
  console.log("Login User : " , user);
  if (!user) {
    return res.status(400).json({ message: 'Invalid Email or password' });
  }

  // Check the password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: 'Invalid Email or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, Email: user.Email }, process.env.JWT_SECRET as string, {
    expiresIn: '600h', // Token expiry time
  });

  res.json({ token });
};
