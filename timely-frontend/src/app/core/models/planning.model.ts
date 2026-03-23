// Enums
export type PeriodeEmploi = 'SEMESTRE_1' | 'SEMESTRE_2' | 'ANNUEL';
export type StatutEmploi = 'DRAFT' | 'VALIDATED' | 'PUBLISHED' | 'ARCHIVED';
export type TypeRecurrence = 'UNIQUE' | 'HEBDOMADAIRE' | 'BIHEBDOMADAIRE';
export type StatutCreneau = 'DISPONIBLE' | 'RESERVE' | 'CONFIRME' | 'ANNULE';
export type TypeConflit = 'ENSEIGNANT' | 'SALLE' | 'GROUPE' | 'HORAIRE';
export type Severite = 'MINEURE' | 'MOYENNE' | 'CRITIQUE';
export type StatutResolution = 'NON_RESOLU' | 'EN_COURS' | 'RESOLU' | 'IGNORE';

// DTOs Request
export interface GeneratePlanningRequest {
  ecoleId: string;
  dateDebut: string; // Format ISO: YYYY-MM-DD
  dateFin: string;
  periode: PeriodeEmploi;
  creneauxParJour?: number;
  heureDebutJournee?: string; // Format HH:mm
  heureFinJournee?: string;
  dureeCreneauMinutes?: number;
  pauseEntreCreneauxMinutes?: number;
}

export interface EmploiDuTempsRequest {
  ecoleId: string;
  dateDebut: string;
  dateFin: string;
  periode: PeriodeEmploi;
  notes?: string;
}

export interface CreneauRequest {
  jourSemaine: DayOfWeek;
  heureDebut: string;
  heureFin: string;
  dateCreneau: string;
  typeRecurrence: TypeRecurrence;
  enseignantId?: string;
  salleId?: string;
  groupeId?: string;
  coursId?: string;
}

export interface SearchPlanningRequest {
  dateDebut?: string;
  dateFin?: string;
  ecoleId?: string;
  statut?: StatutEmploi;
  periode?: PeriodeEmploi;
  page?: number;
  size?: number;
}

// DTOs Response
export interface GeneratePlanningResponse {
  emploiDuTempsId: string;
  totalCoursAPlanifier: number;
  coursPlanifies: number;
  coursNonPlanifies: CoursNonPlanifie[];
  tauxReussite: number;
  conflitsDetectes: number;
  dureeGenerationMs: number;
}

export interface CoursNonPlanifie {
  coursId: string;
  intitule: string;
  raison: string;
}

export interface EmploiDuTempsResponse {
  id: string;
  ecoleId: string;
  dateDebut: string;
  dateFin: string;
  periode: PeriodeEmploi;
  statut: StatutEmploi;
  dateCreation: string;
  datePublication?: string;
  utilisateurValidation?: string;
  notes?: string;
  creneaux: CreneauResponse[];
  conflits: ConflitResponse[];
}

export interface CreneauResponse {
  id: string;
  emploiDuTempsId: string;
  jourSemaine: DayOfWeek;
  heureDebut: string;
  heureFin: string;
  dateCreneau: string;
  typeRecurrence: TypeRecurrence;
  statutCreneau: StatutCreneau;
  reservationId?: string;
  enseignantId?: string;
  salleId?: string;
  groupeId?: string;
  coursId?: string;
}

export interface ConflitResponse {
  id: string;
  emploiDuTempsId: string;
  typeConflit: TypeConflit;
  description: string;
  severite: Severite;
  suggestionResolution?: string;
  resolution?: string;
  statutResolution: StatutResolution;
  dateDetection: string;
  dateResolution?: string;
  reservation1Id?: string;
  reservation2Id?: string;
}

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

// Helpers
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export const DayOfWeekLabels: Record<DayOfWeek, string> = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi',
  SATURDAY: 'Samedi',
  SUNDAY: 'Dimanche'
};

export const StatutEmploiLabels: Record<StatutEmploi, string> = {
  DRAFT: 'Brouillon',
  VALIDATED: 'Validé',
  PUBLISHED: 'Publié',
  ARCHIVED: 'Archivé'
};

export const TypeConflitLabels: Record<TypeConflit, string> = {
  ENSEIGNANT: 'Conflit enseignant',
  SALLE: 'Conflit salle',
  GROUPE: 'Conflit groupe',
  HORAIRE: 'Conflit horaire'
};

export const SeveriteLabels: Record<Severite, string> = {
  MINEURE: 'Mineure',
  MOYENNE: 'Moyenne',
  CRITIQUE: 'Critique'
};
