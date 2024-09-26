import { FieldValue, Timestamp } from "firebase/firestore";

export interface UserProfile {
    id: string;
    displayName: string;
    dietaryRestrictions: DietaryOptions[];
    email: string;
    favorites: Favorite[];
    completedIntro: boolean;
    createdAt: FieldValue;
}

export interface Favorite {
    restaurantId: string;
    addedAt: FieldValue;
}
export interface Restaurant {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
    addedAt: FieldValue;
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
    initialSuggestion?: Restaurant["id"];
    senderAccepted: boolean;
    recipientAccepted: boolean;
    senderDietaryRestrictions: DietaryOptions[];
    recipientDietaryRestrictions: DietaryOptions[];
    lastModifiedBy: string;
}

export enum InviteStatus {
    Pending = 'Pending',
    Accepted = 'Accepted',
    Declined = 'Declined',
}

export enum EventType {
    Lunch = 'Lunch',
    Dinner = 'Dinner',
    Breakfast = 'Breakfast',
    Drinks = 'Drinks',
    HangOut = 'Hang Out',
}

export enum DietaryOptions {
    PeanutAllergy = 'Peanut Allergy',
    TreeNutAllergy = 'Tree Nut Allergy',
    DairyIntolerance = 'Dairy Intolerance',
    GlutenIntolerance = 'Gluten Intolerance',
    CeliacDisease = 'Celiac Disease',
    ShellfishAllergy = 'Shellfish Allergy',
    SoyAllergy = 'Soy Allergy',
    EggAllergy = 'Egg Allergy',
    FishAllergy = 'Fish Allergy',
    WheatAllergy = 'Wheat Allergy',
    CornAllergy = 'Corn Allergy',
    SesameAllergy = 'Sesame Allergy',
    LupinAllergy = 'Lupin Allergy',
    MustardAllergy = 'Mustard Allergy',
    SulfiteSensitivity = 'Sulfite Sensitivity',
    FructoseIntolerance = 'Fructose Intolerance',
    LactoseIntolerance = 'Lactose Intolerance',
    Vegetarian = 'Vegetarian',
    Vegan = 'Vegan',
    Pescatarian = 'Pescatarian',
    Keto = 'Keto',
    Paleo = 'Paleo',
    Halal = 'Halal',
    Kosher = 'Kosher',
}

export enum ToastType {
    Success = 'Success',
    Error = 'Error',
    Info = 'Info',
}

export interface ToastMessage {
    message: string;
    type: ToastType;
    duration: number;
}

export interface InviteNotification {
    id: string;
    inviteId: string;
    inviteDate: Timestamp;
    inviteType: EventType;
    inviteStatus: InviteStatus;
    userId: string;
    type: InviteNotificationType;
    message: string;
    timestamp: FirebaseFirestore.FieldValue
    read: boolean;
}

export enum InviteNotificationType {
    'RSVP_CHANGED' = 'RSVP_CHANGED',
    'RESTAURANT_SUGGESTION_UPDATE' = 'RESTAURANT_SUGGESTION_UPDATE',
    'SUGGESTED_RESTAURANT_ACCEPTED_BY_SENDER' = 'SUGGESTED_RESTAURANT_ACCEPTED_BY_SENDER',
    'SUGGESTED_RESTAURANT_ACCEPTED_BY_RECIPIENT' = 'SUGGESTED_RESTAURANT_ACCEPTED_BY_RECIPIENT',
}