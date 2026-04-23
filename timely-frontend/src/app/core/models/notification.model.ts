export type TypeNotification =
  | 'CHANGEMENT_EMPLOI_TEMPS'
  | 'RAPPEL_COURS'
  | 'CONFLIT_HORAIRE'
  | 'NOUVEL_EMPLOI_TEMPS'
  | 'ANNULATION_COURS'
  | 'EVENEMENT_A_VENIR';

export type CanalNotification = 'EMAIL' | 'SMS' | 'PUSH';
export type StatutNotification = 'PENDING' | 'SENT' | 'FAILED' | 'BOUNCED';

export interface AppNotification {
  id: string;
  destinataireId: string;
  typeNotification: TypeNotification;
  sujet: string;
  contenu: string;
  canal: CanalNotification;
  statut: StatutNotification;
  dateCreation: string;
  dateEnvoi: string | null;
  dateLecture: string | null;
  tentativesRestantes: number;
}

export interface NotificationPage {
  content: AppNotification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
