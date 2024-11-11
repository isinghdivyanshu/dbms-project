import { Request, Response } from 'express';
import { Manager, PrismaClient, } from '@prisma/client';

const prisma = new PrismaClient();

export interface ARequest extends Request {
    manager: Manager
    params: {
        username: string
        eventId: string
    }
}


export async function getProfile(req: ARequest, res: Response) {
    try {
        console.log('req.manager:', req.manager)
        const username = req.manager.username

        console.log('username:', username)

        if (username !== req.manager.username) {
            return res.status(403).json({ message: 'You do not have permission to view this user' });
        }

        const user = await prisma.manager.findUnique({
            where: { id: req.manager.id },
            select: {
                id: true,
                username: true,
                email: true,
                password: false,
            }
        });

        const events = await prisma.event.findMany({
            where: {
                Managers: {
                    some: {
                        id: req.manager.id
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            user,
            events
        });
    } catch (error) {
        console.error('Error getting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } 
};

export async function deleteManager(req: ARequest, res: Response) {
    try {
        const username = req.params.username;

        if (username !== req.manager.username) {
            return res.status(403).json({ message: 'You do not have permission to delete this user' });
        }

        const existingUser = await prisma.manager.findUnique({ where: { username: username } });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const deletedUser = await prisma.manager.delete({ where: { username: username } });

        return res.status(200).json(deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } 
};

export async function updateManager(req: ARequest, res: Response) {
  try {
    const username = req.params.username;

    if (username !== req.manager.username) {
      return res.status(403).json({ message: 'You do not have permission to update this user' });
    }

    const existingUser = await prisma.manager.findUnique({ where: { username: username } });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await prisma.manager.update({
      where: { username: username},
      data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllManagersofEvent(req: ARequest, res: Response) {
    try {
        const eventId = req.query.eventId as string;
        
        if(!eventId){
            return res.status(400).json({ message: 'Event Id is required' });
        }

        const event = await prisma.event.findUnique({
            where: {
                id: parseInt(eventId)
            },
            include: {
                Managers: true
            }
        });

        if(!event){
            return res.status(404).json({ message: 'Event not found' });
        }

        const isManagerAssociated = event.Managers.some(manager => manager.id === req.manager.id);

        if(!isManagerAssociated){
            return res.status(403).json({ message: 'You are not associated with this event' });
        }

        const managers = event.Managers;
        if(managers.length === 0){
            return res.status(404).json({ message: 'No managers found for this event' });
        }
        return res.status(200).json(managers);
    } catch (error) {
        console.error('Error getting all users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
    }

