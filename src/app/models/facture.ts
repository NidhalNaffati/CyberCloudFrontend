 
export interface Facture {
  id?: number;
  montant?: number;
  date?: Date; // or Date if you want to work with date objects
  statut?: string;
  reference?: string;
  doctor?: any;
  patient?: any;
  doctorId?: number;
  patientId?: number;
}
