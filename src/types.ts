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
