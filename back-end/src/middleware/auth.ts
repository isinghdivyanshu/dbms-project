import { Manager } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../client/client';

export interface ARequest extends Request {
    manager: Manager;
}
async function verifyToken(req: ARequest, res: Response, next: NextFunction) {
    console.log("verifyToken");
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    
    if (typeof decoded === 'string' || !decoded.userId) {
        // If the 'decoded' value is a string, it means an error occurred during verification
        console.log(decoded);
        return res.status(401).json({ message: 'Authentication token is invalid' });
    }
  
    req.manager = (await prisma.manager.findUnique({
        where: { id: decoded.userId  },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          createdAt : true,
          updatedAt : true
        }
      })) ?? { id: 0, username: '', email: '', password: '', createdAt : new Date(), updatedAt : new Date() };  
      
      if(req.manager.id === 0) {
        return res.status(401).json({ message: 'Authentication token is invalid!' });
    }
  
    console.log('req.manager1:', req.manager);
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Error Authenticating' });
  }
}

export default verifyToken;