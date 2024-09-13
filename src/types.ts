import { Timestamp } from "firebase/firestore";

export interface Restaurant {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
    addedAt: Date;
}

export interface Invite {
    id: string;
    senderId: string;
    recipientId: string;
    eventDate: Timestamp;
    eventType: EventType;
    status: InviteStatus;
    senderFavorites: Restaurant["id"][];
    recipientFavorites: Restaurant["id"][];
    suggestedRestaurants: Restaurant["id"][];
}

export enum InviteStatus {
    Pending = 'Pending',
    Accepted = 'Accepted',
    Declined = 'Declined',
}

export enum EventType {
    Lunch = 'Lunch',
    Dinner = 'Dinner',
    Drinks = 'Drinks',
    Other = 'Other',
}