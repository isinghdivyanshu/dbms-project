import { Request, Response } from "express";
import { prisma } from "../client/client";
import { Manager} from "@prisma/client";

export interface ARequest extends Request {
    manager: Manager
}

export async function createEvent(req: ARequest, res: Response) {
    const { eventname } = req.body;

    try {
        const existingEvent = await prisma.event.findFirst({
            where: {
                eventname: eventname
            }
        });

        if(existingEvent){
            return res.status(400).json({ message: 'Event already exists' });
        }

        const newEvent = await prisma.event.create({
            data: {
                eventname,
                Managers: {
                    connect: {
                        id: req.manager.id
                    }
                }
            },
        });

        const event = await prisma.event.findUnique({
            where: {
                id: newEvent.id
            },
            include: {
                Managers: true,
                EventParticipants: true
            }
        });

        return res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteEvent(req: ARequest, res: Response) {
    try {
        const { eventId } = req.params;

        const event = await prisma.event.findUnique({
            where: {
                id: parseInt(eventId)
            },
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        const managers = await prisma.manager.findMany({
            where: {
                Events: {
                    some: {
                        id: parseInt(eventId)
                    }
                }
            }
        });

        for(const manager of managers){
            //check if the manager is the owner of the event        
            console.log(manager.id, req.manager.id)
            if(manager.id === req.manager.id){
                const deletedEvent = await prisma.event.delete({
                    where: {
                        id: parseInt(eventId)
                    },
                });
                return res.status(200).json(
                    {
                        message: 'Event deleted successfully',
                        event: deletedEvent
                    }
                );  
            }
        }



        return res.status(403).json({ message: 'You do not have permission to delete this event' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateEvent(req: ARequest, res: Response) {
    try {
        const { eventId } = req.params;

        const event = await prisma.event.findUnique({
            where: {
                id: parseInt(eventId)
            },
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const managers = await prisma.manager.findMany({
            where: {
                Events: {
                    some: {
                        id: parseInt(eventId)
                    }
                }
            }
        });

        for(const manager of managers){
            //check if the manager is the owner of the event
            if(manager.id === req.manager.id){
                const updatedEvent = await prisma.event.update({
                    where: {
                        id: parseInt(eventId)
                    },
                    data: {
                        eventname: req.body.eventname,
                    },
                });
                return res.status(200).json(
                    {
                        message: 'Event updated successfully',
                        event: updatedEvent
                    }
                );  
            }
        }

        return res.status(403).json({ message: 'You do not have permission to update this event' });
       

    } catch (error) {
        console.error('Error updating event:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getEventbyId(req: ARequest, res: Response) {
    try {
        const { eventId } = req.params;

        const event = await prisma.event.findUnique({
            where: {
                id: parseInt(eventId)
            },
            include: {
                Managers: true,
                EventParticipants: true
            }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

   

        const uniqueTeamNames = new Set();
        const participants = event.EventParticipants;
        participants.forEach(participant => {
            uniqueTeamNames.add(participant.teamname);
        });
        const uniqueTeamNamesArray = Array.from(uniqueTeamNames);



        return res.status(200).json({
            eventname: event.eventname,
            manager: event.Managers,
            participants: event.EventParticipants,
            teams: uniqueTeamNamesArray
        });
    } catch (error) {
        console.error('Error getting event:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


export async function getSelfEvents(req: ARequest, res: Response){

    try {
        console.log("self events called");
        console.log(req.manager.id);
        const events = await prisma.event.findMany({
            where: {
                Managers: {
                    some: {
                        id: req.manager.id
                    }
                }
            }
        });

        if(!events || events.length === 0){
            return res.status(200).json({ message: 'No events found' });
        }

        return res.status(200).json({
            events
        });
    } catch (error) {
        console.error('Error getting events:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
}




