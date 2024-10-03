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
    priceLevel?: number;
    rating?: number;
    userRatingsTotal?: number;
    types?: string[];
    url?: string;
    internationalPhoneNumber?: string;
    openingHours?: OpeningHours;
    website?: string;
}

export interface OpeningHours {
    weekdayText: string[];
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

export enum DietaryIntolerances {
    DairyIntolerance = 'Dairy Intolerance',
    FructoseIntolerance = 'Fructose Intolerance',
    LactoseIntolerance = 'Lactose Intolerance',
    GlutenIntolerance = 'Gluten Intolerance',
}

export enum DietaryAllergies {
    PeanutAllergy = 'Peanut Allergy',
    TreeNutAllergy = 'Tree Nut Allergy',
    ShellfishAllergy = 'Shellfish Allergy',
    SoyAllergy = 'Soy Allergy',
    EggAllergy = 'Egg Allergy',
    FishAllergy = 'Fish Allergy',
    WheatAllergy = 'Wheat Allergy',
    CornAllergy = 'Corn Allergy',
    SesameAllergy = 'Sesame Allergy',
    LupinAllergy = 'Lupin Allergy',
    MustardAllergy = 'Mustard Allergy',
}

export enum DietaryMedicalConditions {
    CeliacDisease = 'Celiac Disease',
    Diabetes = 'Diabetes',
    HighBloodPressure = 'High Blood Pressure',
    HighCholesterol = 'High Cholesterol',
}

export enum DietaryPreferences {
    Vegetarian = 'Vegetarian',
    Vegan = 'Vegan',
    Pescatarian = 'Pescatarian',
    Keto = 'Keto',
    Paleo = 'Paleo',
    Halal = 'Halal',
    Kosher = 'Kosher',
}

export type DietaryOptions = DietaryIntolerances | DietaryAllergies | DietaryMedicalConditions | DietaryPreferences;

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

// export const GOOGLE_MAP_SEARCH_TYPES = ["cafe", "bakery", "meal_delivery", "meal_takeaway", "restaurant", "food"]

export enum GOOGLE_MAP_SEARCH_TYPES {
    "cafe" = "cafe",
    "bakery" = "bakery",
    "meal_delivery" = "meal_delivery",
    "meal_takeaway" = "meal_takeaway",
    "restaurant" = "restaurant",
    "food" = "food",
}
