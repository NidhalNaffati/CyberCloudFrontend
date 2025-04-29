export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export class ResponseComplaint {
    responseId!: number;
    user?: User;
    userId?: number; // Gardé pour compatibilité
    content!: string;
    dateRep!: string;
    complaintId!: number;
    isReadRep!: boolean; // Nouvel attribut ajouté
}