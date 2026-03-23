// Domain Model - Cours
export interface Cours {
  id?: string;
  intitule: string;
  volumeHoraire: number;
  typeCours: 'CM' | 'TD' | 'TP';
  coefficient: number;
  ueId: string;
  ue?: UE;
}

// Domain Model - UE (Unité d'Enseignement)
export interface UE {
  id?: string;
  intituleUE: string;
  credit: number;
  semestre: number;
  description: string;
  filiereId: string;
  filiere?: Filiere;
}

// Domain Model - Filiere
export interface Filiere {
  id?: string;
  nom: string;
  code: string;
}

// DTOs pour les formulaires
export interface CreateCoursDTO {
  intitule: string;
  volumeHoraire: number;
  typeCours: 'CM' | 'TD' | 'TP';
  coefficient: number;
  ueId: string;
}

export interface UpdateCoursDTO extends Partial<CreateCoursDTO> {
  id: string;
}

export interface CreateUEDTO {
  intituleUE: string;
  credit: number;
  semestre: number;
  description: string;
  filiereId: string;
}

export interface UpdateUEDTO extends Partial<CreateUEDTO> {
  id: string;
}
