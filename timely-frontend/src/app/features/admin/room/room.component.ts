import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorDoor, phosphorPlus, phosphorPencil, phosphorTrash, phosphorX,
  phosphorMagnifyingGlass, phosphorSquaresFour, phosphorList,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT, SPRING_SNAPPY } from '../../../core/animations/motion.variants';
import { SalleService } from '../../../core/services/salle.service';
import { MaterielService } from '../../../core/services/materiel.service';
import { EquipementService } from '../../../core/services/equipement.service';
import { EcoleService, EcoleDto } from '../../../core/services/ecole.service';
import {
  Salle,
  CreateSalleDTO,
  UpdateSalleDTO,
  TYPES_SALLE,
  TypeSalle,
  isSalleEquipee,
  getSalleEquipmentCount
} from '../../../core/models/salle.model';
import { Materiel, Equipement } from '../../../core/models/resource.model';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorDoor, phosphorPlus, phosphorPencil, phosphorTrash, phosphorX,
      phosphorMagnifyingGlass, phosphorSquaresFour, phosphorList,
    }),
  ],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent implements OnInit {
  readonly FADE_UP = FADE_UP;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  readonly SPRING_SNAPPY = SPRING_SNAPPY;
  viewMode = signal<'grid' | 'list'>('grid');
  private salleService = inject(SalleService);
  private materielService = inject(MaterielService);
  private equipementService = inject(EquipementService);
  private ecoleService = inject(EcoleService);
  private fb = inject(FormBuilder);

  salles = signal<Salle[]>([]);
  materiels = signal<Materiel[]>([]);
  equipements = signal<Equipement[]>([]);
  ecoles = signal<EcoleDto[]>([]);

  // Filtres
  typeFilter = signal<string>('');
  batimentFilter = signal<string>('');
  disponibleFilter = signal<string>('');
  equipeeFilter = signal<string>('');
  searchTerm = signal<string>('');

  // Modals
  showSalleModal = signal(false);
  editingSalle = signal<Salle | null>(null);

  // Formulaire
  salleForm!: FormGroup;

  // Types de salle
  typesSalle = TYPES_SALLE;

  // Données filtrées
  sallesFiltered = computed(() => {
    let result = this.salles();

    // Filtre par type
    if (this.typeFilter()) {
      result = result.filter(s => s.type === this.typeFilter());
    }

    // Filtre par bâtiment
    if (this.batimentFilter()) {
      result = result.filter(s => s.batiment === this.batimentFilter());
    }

    // Filtre par disponibilité
    if (this.disponibleFilter()) {
      const isDisponible = this.disponibleFilter() === 'true';
      result = result.filter(s => s.disponible === isDisponible);
    }

    // Filtre par équipement
    if (this.equipeeFilter()) {
      const isEquipee = this.equipeeFilter() === 'true';
      result = result.filter(s => isSalleEquipee(s) === isEquipee);
    }

    // Recherche
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      result = result.filter(s =>
        s.numeroSalle.toLowerCase().includes(term) ||
        s.type.toLowerCase().includes(term) ||
        s.batiment.toLowerCase().includes(term)
      );
    }

    return result;
  });

  // Liste unique des bâtiments
  batiments = computed(() => {
    const batimentsSet = new Set(this.salles().map(s => s.batiment));
    return Array.from(batimentsSet).sort();
  });

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.salleForm = this.fb.group({
      numeroSalle: ['', [Validators.required, Validators.minLength(2)]],
      type: ['Salle de TD', Validators.required],
      capacite: [30, [Validators.required, Validators.min(1)]],
      batiment: ['', [Validators.required, Validators.minLength(2)]],
      etage: [0, [Validators.required, Validators.min(0)]],
      disponible: [true],
      ecoleId: ['', Validators.required],
      materielAffecte: this.fb.array([]),
      equipementAffecte: this.fb.array([])
    });
  }

  loadData(): void {
    this.salleService.getSalles().subscribe(data => this.salles.set(data));
    this.ecoleService.fetchEcolesFromApi().subscribe(data => this.ecoles.set(data));
    this.materielService.getMateriels().subscribe(data => this.materiels.set(data));
    this.equipementService.getEquipements().subscribe(data => this.equipements.set(data));
  }

  // Gestion des FormArrays
  get materielAffecteArray(): FormArray {
    return this.salleForm.get('materielAffecte') as FormArray;
  }

  get equipementAffecteArray(): FormArray {
    return this.salleForm.get('equipementAffecte') as FormArray;
  }

  addMaterielAffecte(): void {
    const materielGroup = this.fb.group({
      materielId: ['', Validators.required],
      quantiteAffectee: [1, [Validators.required, Validators.min(1)]],
      dateAffectation: [new Date().toISOString().split('T')[0]]
    });
    this.materielAffecteArray.push(materielGroup);
  }

  removeMaterielAffecte(index: number): void {
    this.materielAffecteArray.removeAt(index);
  }

  addEquipementAffecte(): void {
    const equipementGroup = this.fb.group({
      equipementId: ['', Validators.required],
      dateAffectation: [new Date().toISOString().split('T')[0]]
    });
    this.equipementAffecteArray.push(equipementGroup);
  }

  removeEquipementAffecte(index: number): void {
    this.equipementAffecteArray.removeAt(index);
  }

  // Gestion du modal
  openSalleModal(salle?: Salle): void {
    if (salle) {
      this.editingSalle.set(salle);
      this.salleForm.patchValue({
        numeroSalle: salle.numeroSalle,
        type: salle.type,
        capacite: salle.capacite,
        batiment: salle.batiment,
        etage: salle.etage,
        disponible: salle.disponible,
        ecoleId: salle.ecoleId
      });

      // Charger les matériels affectés
      this.materielAffecteArray.clear();
      if (salle.materielAffecte && salle.materielAffecte.length > 0) {
        salle.materielAffecte.forEach(ma => {
          const materielGroup = this.fb.group({
            materielId: [ma.materielId, Validators.required],
            quantiteAffectee: [ma.quantiteAffectee, [Validators.required, Validators.min(1)]],
            dateAffectation: [ma.dateAffectation || new Date().toISOString().split('T')[0]]
          });
          this.materielAffecteArray.push(materielGroup);
        });
      }

      // Charger les équipements affectés
      this.equipementAffecteArray.clear();
      if (salle.equipementAffecte && salle.equipementAffecte.length > 0) {
        salle.equipementAffecte.forEach(ea => {
          const equipementGroup = this.fb.group({
            equipementId: [ea.equipementId, Validators.required],
            dateAffectation: [ea.dateAffectation || new Date().toISOString().split('T')[0]]
          });
          this.equipementAffecteArray.push(equipementGroup);
        });
      }
    } else {
      this.editingSalle.set(null);
      this.salleForm.reset({
        type: 'Salle de TD',
        capacite: 30,
        etage: 0,
        disponible: true
      });
      this.materielAffecteArray.clear();
      this.equipementAffecteArray.clear();
    }
    this.showSalleModal.set(true);
  }

  closeSalleModal(): void {
    this.showSalleModal.set(false);
    this.editingSalle.set(null);
    this.salleForm.reset();
    this.materielAffecteArray.clear();
    this.equipementAffecteArray.clear();
  }

  saveSalle(): void {
    if (this.salleForm.invalid) return;

    const salleData = {
      ...this.salleForm.value,
      materielAffecte: this.materielAffecteArray.value.filter((ma: any) => ma.materielId),
      equipementAffecte: this.equipementAffecteArray.value.filter((ea: any) => ea.equipementId)
    };

    if (this.editingSalle()) {
      this.salleService.updateSalle({
        id: this.editingSalle()!.id!,
        ...salleData
      }).subscribe(() => {
        this.closeSalleModal();
        this.loadData();
      });
    } else {
      this.salleService.createSalle(salleData as CreateSalleDTO).subscribe(() => {
        this.closeSalleModal();
        this.loadData();
      });
    }
  }

  deleteSalle(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      this.salleService.deleteSalle(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  toggleDisponibilite(salle: Salle): void {
    this.salleService.toggleDisponibilite(salle.id!).subscribe(() => {
      this.loadData();
    });
  }

  // Helpers
  getTypeBadgeClass(type: TypeSalle): string {
    switch (type) {
      case 'Amphithéâtre': return 'bg-purple-100 text-purple-700';
      case 'Salle de TP': return 'bg-blue-100 text-blue-700';
      case 'Salle de TD': return 'bg-green-100 text-green-700';
      case 'Laboratoire': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  getMaterielName(materielId: string): string {
    const materiel = this.materiels().find(m => m.id === materielId);
    return materiel ? materiel.nom : 'Matériel inconnu';
  }

  getEquipementName(equipementId: string): string {
    const equipement = this.equipements().find(e => e.id === equipementId);
    return equipement ? equipement.nom : 'Équipement inconnu';
  }

  getSalleEquipmentInfo(salle: Salle) {
    return getSalleEquipmentCount(salle);
  }

  isSalleEquipee(salle: Salle): boolean {
    return isSalleEquipee(salle);
  }

  getQuantiteDisponible(materielId: string): number {
    const materiel = this.materiels().find(m => m.id === materielId);
    if (!materiel) return 0;

    // Calculer la quantité affectée à toutes les salles
    let quantiteAffectee = 0;
    this.salles().forEach(salle => {
      if (salle.materielAffecte) {
        const affectation = salle.materielAffecte.find(ma => ma.materielId === materielId);
        if (affectation) {
          quantiteAffectee += affectation.quantiteAffectee;
        }
      }
    });

    return materiel.quantite - quantiteAffectee;
  }

  isEquipementDisponible(equipementId: string): boolean {
    // Vérifier si l'équipement est déjà affecté à une salle
    const isAffecte = this.salles().some(salle =>
      salle.equipementAffecte?.some(ea => ea.equipementId === equipementId)
    );
    return !isAffecte;
  }

  // TrackBy functions for *ngFor
  trackById(index: number, item: any): string | number {
    return item.id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
