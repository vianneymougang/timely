// Domain Model - Ecole
export interface Ecole {
  id: string;
  nom: string;
  directeur: string;
  description: string;
}

// Domain Model - Filiere
export interface Filiere {
  id: string;
  nom: string;
  description: string;
  ecoleId: string;
  code: string;
}

// Domain Model - Classe
export interface Classe {
  id: string;
  nom: string;
  niveau: string;
  filiereId: string;
  filiere?: Filiere;
}

// DTOs pour les formulaires Ecole
export interface CreateEcoleDTO {
  nom: string;
  directeur: string;
  description: string;
}

export interface UpdateEcoleDTO extends Partial<CreateEcoleDTO> {
  id: string;
}

// DTOs pour les formulaires Filiere
export interface CreateFiliereDTO {
  nom: string;
  description: string;
  ecoleId: string;
  code: string;
}

export interface UpdateFiliereDTO extends Partial<CreateFiliereDTO> {
  id: string;
}

// DTOs pour les formulaires Classe
export interface CreateClasseDTO {
  nom: string;
  niveau: string;
  filiereId: string;
}

export interface UpdateClasseDTO extends Partial<CreateClasseDTO> {
  id: string;
}
