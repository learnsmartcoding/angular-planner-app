export interface UserProfile {
    id?: string;
    email: string[];
    firstName: string;
    lastName: string;
    displayName: string;
    businessName: string;
    businessDescription: string;
    country: string;
    phoneNumber: string;
    adObjectId: string;
    timeZoneId?: string;   
}