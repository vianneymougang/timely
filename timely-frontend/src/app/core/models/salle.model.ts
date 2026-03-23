// Domain Model - Salle
export interface Salle {
  id?: string;
  numeroSalle: string;
  type: TypeSalle;
  capacite: number;
  batiment: string;
  etage: number;
  disponible: boolean;
  ecoleId: string;
  materielAffecte?: MaterielAffecteSalle[];
  equipementAffecte?: EquipementAffecteSalle[];
}

// Types de salles
export type TypeSalle = 'Amphithéâtre' | 'Salle de TP' | 'Salle de TD' | 'Laboratoire';

export const TYPES_SALLE: TypeSalle[] = [
  'Amphithéâtre',
  'Salle de TP',
  'Salle de TD',
  'Laboratoire'
];

// Affectation de matériel à une salle
export interface MaterielAffecteSalle {
  materielId: string;
  quantiteAffectee: number;
  dateAffectation?: Date | string;
}

// Affectation d'équipement à une salle
export interface EquipementAffecteSalle {
  equipementId: string;
  dateAffectation?: Date | string;
}

// DTOs pour les formulaires Salle
export interface CreateSalleDTO {
  numeroSalle: string;
  type: TypeSalle;
  capacite: number;
  batiment: string;
  etage: number;
  disponible: boolean;
  ecoleId: string;
  materielAffecte?: MaterielAffecteSalle[];
  equipementAffecte?: EquipementAffecteSalle[];
}

export interface UpdateSalleDTO extends Partial<CreateSalleDTO> {
  id: string;
}

// Helper pour vérifier si une salle est équipée
export function isSalleEquipee(salle: Salle): boolean {
  const hasMateriels = salle.materielAffecte && salle.materielAffecte.length > 0;
  const hasEquipements = salle.equipementAffecte && salle.equipementAffecte.length > 0;
  return !!(hasMateriels || hasEquipements);
}

// Helper pour compter le nombre total d'items dans une salle
export interface SalleEquipmentCount {
  totalMateriels: number;
  totalEquipements: number;
  isEquipee: boolean;
}

export function getSalleEquipmentCount(salle: Salle): SalleEquipmentCount {
  const totalMateriels = salle.materielAffecte?.reduce((sum, m) => sum + m.quantiteAffectee, 0) || 0;
  const totalEquipements = salle.equipementAffecte?.length || 0;

  return {
    totalMateriels,
    totalEquipements,
    isEquipee: totalMateriels > 0 || totalEquipements > 0
  };
}
