// ==================== Enums ====================

export type ReportType = 'AVAILABILITY' | 'ROOM_UTILIZATION' | 'WORKLOAD' | 'AUDIT';
export type WorkloadStatus = 'SOUS_CHARGE' | 'NORMAL' | 'SURCHARGE';
export type AlertSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VALIDATE'
  | 'PUBLISH'
  | 'GENERATE'
  | 'EXPORT';
export type EntityType =
  | 'EMPLOI_DU_TEMPS'
  | 'CRENEAU'
  | 'RESERVATION'
  | 'COURS'
  | 'ENSEIGNANT'
  | 'SALLE'
  | 'GROUPE';

// ==================== DTOs Request ====================

export interface ReportFilterRequest {
  startDate?: string; // Format ISO: YYYY-MM-DD
  endDate?: string;
  ecoleId?: string;
  filiereId?: string;
  enseignantId?: string;
  salleId?: string;
  page?: number;
  size?: number;
}

export interface AuditFilterRequest {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: AuditAction;
  entity?: EntityType;
  entityId?: string;
  page?: number;
  size?: number;
}

// ==================== DTOs Response ====================

export interface AvailabilityReport {
  totalEnseignants: number;
  enseignantsAvecDisponibilites: number;
  tauxCouverture: number; // Pourcentage (0-100)
  disponibilitesParJour: { [jour: string]: number }; // Map<DayOfWeek, count>
  enseignantsSansDisponibilites: UserSummary[];
  periodeAnalyse: {
    dateDebut: string;
    dateFin: string;
  };
}

export interface UserSummary {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  specialite?: string;
}

export interface RoomUtilizationReport {
  totalSalles: number;
  tauxOccupationMoyen: number; // Pourcentage (0-100)
  sallesParType: { [type: string]: number }; // Map<TypeSalle, count>
  topSallesUtilisees: RoomStats[];
  sallesSousUtilisees: RoomStats[];
  occupationParJour: { [jour: string]: number }; // Map<DayOfWeek, taux>
  occupationParHoraire: { [heure: string]: number }; // Map<heure, taux>
  periodeAnalyse: {
    dateDebut: string;
    dateFin: string;
  };
}

export interface RoomStats {
  salleId: string;
  nomSalle: string;
  batiment: string;
  typeSalle: string;
  capacite: number;
  tauxOccupation: number; // Pourcentage (0-100)
  heuresOccupees: number;
  heuresDisponibles: number;
  nombreReservations: number;
}

export interface WorkloadReport {
  enseignantId: string;
  nom: string;
  prenom: string;
  email: string;
  specialite?: string;
  totalHeures: number;
  heuresCM: number; // Cours Magistraux
  heuresTD: number; // Travaux Dirigés
  heuresTP: number; // Travaux Pratiques
  tauxCharge: number; // Pourcentage (0-100)
  status: WorkloadStatus;
  coursAssignes: CoursAssigne[];
  heuresParSemaine: number;
  chargeMaximale: number; // Heures max autorisées
}

export interface CoursAssigne {
  coursId: string;
  intitule: string;
  code: string;
  typeCours: string; // CM, TD, TP
  heuresTotal: number;
  filiereNom: string;
  nombreGroupes: number;
}

export interface GlobalKPIs {
  totalEnseignants: number;
  totalSalles: number;
  totalCours: number;
  totalReservations: number;
  tauxOccupationGlobal: number; // Pourcentage (0-100)
  tauxDisponibilite: number; // Pourcentage (0-100)
  coursNonPlanifies: number;
  conflitsActifs: number;
  tauxUtilisationEnseignants: number; // Pourcentage (0-100)
  derniereMiseAJour: string; // ISO timestamp
}

export interface DashboardStats {
  kpis: GlobalKPIs;
  recentActivities: AuditEntry[];
  alerts: Alert[];
  chartsData: {
    occupationParJour: ChartData;
    chargeParEnseignant: ChartData;
    utilisationSalles: ChartData;
    tendancesHebdomadaires: ChartData;
  };
}

export interface AuditEntry {
  id: string;
  timestamp: string; // ISO timestamp
  userId: string;
  userName: string;
  action: AuditAction;
  entity: EntityType;
  entityId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  entityType?: EntityType;
  entityId?: string;
  actionRequired?: boolean;
  dismissed: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

// ==================== Pagination ====================

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ==================== Helpers & Labels ====================

export const ReportTypeLabels: Record<ReportType, string> = {
  AVAILABILITY: 'Disponibilités',
  ROOM_UTILIZATION: 'Utilisation des Salles',
  WORKLOAD: 'Charge Horaire',
  AUDIT: 'Journal d\'Audit'
};

export const WorkloadStatusLabels: Record<WorkloadStatus, string> = {
  SOUS_CHARGE: 'Sous-chargé',
  NORMAL: 'Normal',
  SURCHARGE: 'Surchargé'
};

export const AlertSeverityLabels: Record<AlertSeverity, string> = {
  INFO: 'Information',
  WARNING: 'Avertissement',
  ERROR: 'Erreur',
  CRITICAL: 'Critique'
};

export const AuditActionLabels: Record<AuditAction, string> = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
  VALIDATE: 'Validation',
  PUBLISH: 'Publication',
  GENERATE: 'Génération',
  EXPORT: 'Export'
};

export const EntityTypeLabels: Record<EntityType, string> = {
  EMPLOI_DU_TEMPS: 'Emploi du temps',
  CRENEAU: 'Créneau',
  RESERVATION: 'Réservation',
  COURS: 'Cours',
  ENSEIGNANT: 'Enseignant',
  SALLE: 'Salle',
  GROUPE: 'Groupe'
};

// ==================== Couleurs pour les graphiques ====================

export const ChartColors = {
  primary: '#3b82f6',      // blue-500
  success: '#10b981',      // green-500
  warning: '#f59e0b',      // amber-500
  danger: '#ef4444',       // red-500
  info: '#06b6d4',         // cyan-500
  purple: '#8b5cf6',       // violet-500
  pink: '#ec4899',         // pink-500
  gray: '#6b7280',         // gray-500
};

export const WorkloadStatusColors: Record<WorkloadStatus, string> = {
  SOUS_CHARGE: ChartColors.info,
  NORMAL: ChartColors.success,
  SURCHARGE: ChartColors.danger
};

export const AlertSeverityColors: Record<AlertSeverity, string> = {
  INFO: ChartColors.info,
  WARNING: ChartColors.warning,
  ERROR: ChartColors.danger,
  CRITICAL: ChartColors.purple
};
