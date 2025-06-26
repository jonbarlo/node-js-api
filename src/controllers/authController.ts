import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { getUserByEmail, createUser } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
    public static register: RequestHandler = async (req: Request, res: Response) => {
        try {
            logger('API endpoint /auth/register was called...');
            
            const { name, email, password } = req.body;

            // Validate input
            if (!name || !email || !password) {
                res.status(400).json({ 
                    error: 'Name, email, and password are required' 
                });
                return;
            }

            // Check if user already exists
            const existingUser = getUserByEmail(email);
            if (existingUser) {
                res.status(409).json({ 
                    error: 'User with this email already exists' 
                });
                return;
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create user
            const newUser = createUser(name, email, hashedPassword);

            // Generate JWT token
            const token = jwt.sign(
                { userId: newUser.id, email: newUser.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Return user data without password
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _, ...userWithoutPassword } = newUser;

            res.status(201).json({
                message: 'User registered successfully',
                user: userWithoutPassword,
                token
            });

        } catch (error) {
            logger(`Error in register: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static login: RequestHandler = async (req: Request, res: Response) => {
        try {
            logger('API endpoint /auth/login was called...');
            
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                res.status(400).json({ 
                    error: 'Email and password are required' 
                });
                return;
            }

            // Find user by email
            const user = getUserByEmail(email);
            if (!user) {
                res.status(401).json({ 
                    error: 'Invalid email or password' 
                });
                return;
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                res.status(401).json({ 
                    error: 'Invalid email or password' 
                });
                return;
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Return user data without password
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _, ...userWithoutPassword } = user;

            res.json({
                message: 'Login successful',
                user: userWithoutPassword,
                token
            });

        } catch (error) {
            logger(`Error in login: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
} 