export interface Ecole {
  id: string;
  nom: string;
  directeur: string;
  description: string;
}

export interface Filiere {
  id: string;
  nom: string;
  description: string;
  ecoleId: string;
  code: string;
  cycleType: string;
}

export interface Classe {
  id: string;
  nom: string;
  yearIndex: number;
  cycleType: string;
  displayLevel: string;
  filiereId: string;
  filiere?: Filiere;
}

export interface CreateEcoleDTO {
  nom: string;
  directeur: string;
  description: string;
}

export interface UpdateEcoleDTO extends Partial<CreateEcoleDTO> {
  id: string;
}

export interface CreateFiliereDTO {
  nom: string;
  description: string;
  ecoleId: string;
  code: string;
  cycleType: string;
}

export interface UpdateFiliereDTO extends Partial<CreateFiliereDTO> {
  id: string;
}

export interface CreateClasseDTO {
  nom: string;
  yearIndex: number;
  filiereId: string;
}

export interface UpdateClasseDTO extends Partial<CreateClasseDTO> {
  id: string;
}
