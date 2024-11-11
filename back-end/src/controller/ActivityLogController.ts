import { Request, Response } from "express";
import { prisma } from "../client/client";
import { Manager} from "@prisma/client";
import { connect } from "http2";

export interface ARequest extends Request {
    manager: Manager
}

export async function createActivityLog(req: ARequest, res: Response) {
    const { eventId , participantId, inOutStatus } = req.body;

    try {
        if(!eventId){
            return res.status(400).json({ message: 'Event Id is required' });
        }

        if(!participantId){
            return res.status(400).json({ message: 'Event Participant Id is required' });
        }

        if(!inOutStatus){
            return res.status(400).json({ message: 'In or Out status is required' });
        }   

        const event = await prisma.event.findUnique({
            where: {
                id: parseInt(eventId)
            },
            include: {
                EventParticipants: true
            }
        });

        if(!event){
            return res.status(404).json({ message: 'Event not found' });
        }

        const participant = event.EventParticipants.find((participant) => participant.id === parseInt(participantId));

        if(!participant){
            return res.status(404).json({ message: 'Participant not found in the event.' });
        }

        const newLog = await prisma.activityLog.create({
            data: {
                status: inOutStatus === 'true' ? true : false,
                Event: {
                    connect: {
                        id: parseInt(eventId)
                    }
                },
                Participants: {
                    connect: {
                        id: parseInt(participantId)
                    }
                }
     
               
            },
        });

        return res.status(201).json(newLog);
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getParticipantAndEventActivityLog(req: ARequest, res: Response){

    try{
        const { eventId, participantId } = req.body;

        if(!eventId){
            return res.status(400).json({ message: 'Event Id is required' });
        }

        if(!participantId){
            return res.status(400).json({ message: 'Event Participant Id is required' });
        }
        
        const activityLog = await prisma.activityLog.findMany({
            where: {
                eventParticipantId: parseInt(participantId),
                eventId: parseInt(eventId)
            }
        });

        if(!activityLog){
            return res.status(404).json({ message: 'No activity log found' });
        }

        return res.status(200).json(activityLog);
    }catch(error){

        console.error('Error getting activity log:', error);
        return res.status(500).json({ message: 'Internal server error' });

    }

}

