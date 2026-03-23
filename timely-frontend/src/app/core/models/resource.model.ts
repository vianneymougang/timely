// Domain Model - Materiel
export interface Materiel {
  id?: string;
  nom: string;
  type: string;
  etat: 'Excellent' | 'Bon' | 'Moyen' | 'Mauvais' | 'Hors service';
  quantite: number;
  description?: string;
}

// Domain Model - Affectation Materiel à Equipement
export interface MaterielAffecte {
  materielId: string;
  quantiteAffectee: number;
  materiel?: Materiel;
}

// Domain Model - Equipement
export interface Equipement {
  id?: string;
  nom: string;
  type: string;
  etat: 'Excellent' | 'Bon' | 'Moyen' | 'Mauvais' | 'Hors service';
  description?: string;
  materielsAffectes?: MaterielAffecte[];
}

// DTOs pour les formulaires Materiel
export interface CreateMaterielDTO {
  nom: string;
  type: string;
  etat: 'Excellent' | 'Bon' | 'Moyen' | 'Mauvais' | 'Hors service';
  quantite: number;
  description?: string;
}

export interface UpdateMaterielDTO extends Partial<CreateMaterielDTO> {
  id: string;
}

// DTOs pour les formulaires Equipement
export interface CreateEquipementDTO {
  nom: string;
  type: string;
  etat: 'Excellent' | 'Bon' | 'Moyen' | 'Mauvais' | 'Hors service';
  description?: string;
  materielsAffectes?: MaterielAffecte[];
}

export interface UpdateEquipementDTO extends Partial<CreateEquipementDTO> {
  id: string;
}

// Types d'états
export const ETATS_RESOURCE = [
  'Excellent',
  'Bon',
  'Moyen',
  'Mauvais',
  'Hors service'
] as const;
