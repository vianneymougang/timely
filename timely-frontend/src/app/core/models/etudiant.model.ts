// Domain Model - Etudiant
export interface Etudiant {
  id?: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: Date | string;
  classeId: string;
  classe?: Classe;
  groupeId?: string;
  groupe?: Groupe;
  photo?: string;
}

// Domain Model - Classe (référence depuis academic.model.ts)
export interface Classe {
  id?: string;
  nom: string;
  niveau: string;
  filiereId: string;
}

// Domain Model - Groupe
export interface Groupe {
  id?: string;
  nom: string;
  description?: string;
  classeId: string;
  classe?: Classe;
  etudiantsIds: string[];
  etudiants?: Etudiant[];
  capaciteMax?: number;
}

// DTOs pour les formulaires Etudiant
export interface CreateEtudiantDTO {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: Date | string;
  classeId: string;
  groupeId?: string;
}

export interface UpdateEtudiantDTO extends Partial<CreateEtudiantDTO> {
  id: string;
}

// DTOs pour les formulaires Groupe
export interface CreateGroupeDTO {
  nom: string;
  description?: string;
  classeId: string;
  etudiantsIds: string[];
  capaciteMax?: number;
}

export interface UpdateGroupeDTO extends Partial<CreateGroupeDTO> {
  id: string;
}

// Options de génération de groupes
export interface GroupeGenerationOptions {
  classeId: string;
  nombreGroupes?: number;
  tailleGroupe?: number;
  prefixeNom: string;
  repartitionAleatoire: boolean;
}
