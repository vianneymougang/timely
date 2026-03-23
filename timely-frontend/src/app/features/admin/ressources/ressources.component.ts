import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterielService } from '../../../core/services/materiel.service';
import { EquipementService } from '../../../core/services/equipement.service';
import {
  Materiel,
  Equipement,
  CreateMaterielDTO,
  CreateEquipementDTO,
  MaterielAffecte,
  ETATS_RESOURCE
} from '../../../core/models/resource.model';

@Component({
  selector: 'app-ressources',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.scss']
})
export class RessourcesComponent implements OnInit {
  private materielService = inject(MaterielService);
  private equipementService = inject(EquipementService);
  private fb = inject(FormBuilder);

  // Signaux pour les données
  materiels = signal<Materiel[]>([]);
  equipements = signal<Equipement[]>([]);

  // Section active (materiel ou equipement)
  activeSection = signal<'materiel' | 'equipement'>('materiel');

  // Modals
  showMaterielModal = signal(false);
  showEquipementModal = signal(false);

  // Mode édition
  editingMateriel = signal<Materiel | null>(null);
  editingEquipement = signal<Equipement | null>(null);

  // Formulaires
  materielForm!: FormGroup;
  equipementForm!: FormGroup;

  // États disponibles
  etats = ETATS_RESOURCE;

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.materielForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required, Validators.minLength(2)]],
      etat: ['Bon', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
      description: ['']
    });

    this.equipementForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required, Validators.minLength(2)]],
      etat: ['Bon', Validators.required],
      description: [''],
      materielsAffectes: this.fb.array([])
    });
  }

  loadData(): void {
    this.materielService.getMateriels().subscribe(data => this.materiels.set(data));
    this.equipementService.getEquipements().subscribe(data => this.equipements.set(data));
  }

  // Gestion des sections
  setActiveSection(section: 'materiel' | 'equipement'): void {
    this.activeSection.set(section);
  }

  // Gestion des matériels
  openMaterielModal(materiel?: Materiel): void {
    if (materiel) {
      this.editingMateriel.set(materiel);
      this.materielForm.patchValue({
        nom: materiel.nom,
        type: materiel.type,
        etat: materiel.etat,
        quantite: materiel.quantite,
        description: materiel.description || ''
      });
    } else {
      this.editingMateriel.set(null);
      this.materielForm.reset({ etat: 'Bon', quantite: 1 });
    }
    this.showMaterielModal.set(true);
  }

  closeMaterielModal(): void {
    this.showMaterielModal.set(false);
    this.editingMateriel.set(null);
    this.materielForm.reset();
  }

  saveMateriel(): void {
    if (this.materielForm.invalid) return;

    const materielData = this.materielForm.value;

    if (this.editingMateriel()) {
      this.materielService.updateMateriel({
        id: this.editingMateriel()!.id!,
        ...materielData
      }).subscribe(() => {
        this.closeMaterielModal();
        this.loadData();
      });
    } else {
      this.materielService.createMateriel(materielData as CreateMaterielDTO).subscribe(() => {
        this.closeMaterielModal();
        this.loadData();
      });
    }
  }

  deleteMateriel(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) {
      this.materielService.deleteMateriel(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // Gestion des équipements
  get materielsAffectesArray(): FormArray {
    return this.equipementForm.get('materielsAffectes') as FormArray;
  }

  addMaterielAffecte(): void {
    const materielGroup = this.fb.group({
      materielId: ['', Validators.required],
      quantiteAffectee: [1, [Validators.required, Validators.min(1)]]
    });
    this.materielsAffectesArray.push(materielGroup);
  }

  removeMaterielAffecte(index: number): void {
    this.materielsAffectesArray.removeAt(index);
  }

  openEquipementModal(equipement?: Equipement): void {
    if (equipement) {
      this.editingEquipement.set(equipement);
      this.equipementForm.patchValue({
        nom: equipement.nom,
        type: equipement.type,
        etat: equipement.etat,
        description: equipement.description || ''
      });

      // Charger les matériels affectés
      this.materielsAffectesArray.clear();
      if (equipement.materielsAffectes && equipement.materielsAffectes.length > 0) {
        equipement.materielsAffectes.forEach(ma => {
          const materielGroup = this.fb.group({
            materielId: [ma.materielId, Validators.required],
            quantiteAffectee: [ma.quantiteAffectee, [Validators.required, Validators.min(1)]]
          });
          this.materielsAffectesArray.push(materielGroup);
        });
      }
    } else {
      this.editingEquipement.set(null);
      this.equipementForm.reset({ etat: 'Bon' });
      this.materielsAffectesArray.clear();
    }
    this.showEquipementModal.set(true);
  }

  closeEquipementModal(): void {
    this.showEquipementModal.set(false);
    this.editingEquipement.set(null);
    this.equipementForm.reset();
    this.materielsAffectesArray.clear();
  }

  saveEquipement(): void {
    if (this.equipementForm.invalid) return;

    const equipementData = {
      ...this.equipementForm.value,
      materielsAffectes: this.materielsAffectesArray.value.filter((ma: any) => ma.materielId)
    };

    if (this.editingEquipement()) {
      this.equipementService.updateEquipement({
        id: this.editingEquipement()!.id!,
        ...equipementData
      }).subscribe(() => {
        this.closeEquipementModal();
        this.loadData();
      });
    } else {
      this.equipementService.createEquipement(equipementData as CreateEquipementDTO).subscribe(() => {
        this.closeEquipementModal();
        this.loadData();
      });
    }
  }

  deleteEquipement(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      this.equipementService.deleteEquipement(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // Helpers
  getEtatBadgeClass(etat: string): string {
    switch (etat) {
      case 'Excellent': return 'bg-green-100 text-green-700';
      case 'Bon': return 'bg-blue-100 text-blue-700';
      case 'Moyen': return 'bg-yellow-100 text-yellow-700';
      case 'Mauvais': return 'bg-orange-100 text-orange-700';
      case 'Hors service': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  getMaterielName(materielId: string): string {
    const materiel = this.materiels().find(m => m.id === materielId);
    return materiel ? materiel.nom : 'Matériel inconnu';
  }

  getMaterielsAffectes(equipement: Equipement): MaterielAffecte[] {
    return equipement.materielsAffectes || [];
  }

  getQuantiteDisponible(materielId: string): number {
    const materiel = this.materiels().find(m => m.id === materielId);
    if (!materiel) return 0;

    // Calculer la quantité affectée à tous les équipements
    let quantiteAffectee = 0;
    this.equipements().forEach(eq => {
      if (eq.materielsAffectes) {
        const affectation = eq.materielsAffectes.find(ma => ma.materielId === materielId);
        if (affectation) {
          quantiteAffectee += affectation.quantiteAffectee;
        }
      }
    });

    return materiel.quantite - quantiteAffectee;
  }
}
