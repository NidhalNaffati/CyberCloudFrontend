import { Facture } from './facture';

export interface Remboursement {
  id?: number;
  dateRemboursement?: Date;
  statut?: string;
  raison?: string;
  facture?: Facture;
}
