import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EcoleService } from '../../../core/services/ecole.service';
import { FiliereService } from '../../../core/services/filiere.service';
import { ClasseService } from '../../../core/services/classe.service';
import {
  Ecole,
  Filiere,
  Classe,
  CreateEcoleDTO,
  CreateFiliereDTO,
  CreateClasseDTO
} from '../../../core/models/academic.model';

@Component({
  selector: 'app-academic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './academic.component.html',
  styleUrls: ['./academic.component.scss']
})
export class AcademicComponent implements OnInit {
  private ecoleService = inject(EcoleService);
  private filiereService = inject(FiliereService);
  private classeService = inject(ClasseService);
  private fb = inject(FormBuilder);

  // Signaux pour les données
  ecoles = signal<Ecole[]>([]);
  filieres = signal<Filiere[]>([]);
  classes = signal<Classe[]>([]);

  // Section active (ecole, filiere ou classe)
  activeSection = signal<'ecole' | 'filiere' | 'classe'>('ecole');

  // Modals
  showEcoleModal = signal(false);
  showFiliereModal = signal(false);
  showClasseModal = signal(false);

  // Mode édition
  editingEcole = signal<Ecole | null>(null);
  editingFiliere = signal<Filiere | null>(null);
  editingClasse = signal<Classe | null>(null);

  // Formulaires
  ecoleForm!: FormGroup;
  filiereForm!: FormGroup;
  classeForm!: FormGroup;

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.ecoleForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      directeur: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.filiereForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      ecoleId: ['', Validators.required]
    });

    this.classeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      niveau: ['', [Validators.required, Validators.minLength(2)]],
      filiereId: ['', Validators.required]
    });
  }

  loadData(): void {
    this.ecoleService.getEcoles().subscribe(data => this.ecoles.set(data));
    this.filiereService.getFilieres().subscribe(data => this.filieres.set(data));
    this.classeService.getClasses().subscribe(data => this.classes.set(data));
  }

  // Gestion des sections
  setActiveSection(section: 'ecole' | 'filiere' | 'classe'): void {
    this.activeSection.set(section);
  }

  // Gestion des écoles
  openEcoleModal(ecole?: Ecole): void {
    if (ecole) {
      this.editingEcole.set(ecole);
      this.ecoleForm.patchValue(ecole);
    } else {
      this.editingEcole.set(null);
      this.ecoleForm.reset();
    }
    this.showEcoleModal.set(true);
  }

  closeEcoleModal(): void {
    this.showEcoleModal.set(false);
    this.editingEcole.set(null);
    this.ecoleForm.reset();
  }

  saveEcole(): void {
    if (this.ecoleForm.invalid) return;

    const ecoleData = this.ecoleForm.value;

    if (this.editingEcole()) {
      this.ecoleService.updateEcole({
        id: this.editingEcole()!.id!,
        ...ecoleData
      }).subscribe(() => {
        this.closeEcoleModal();
        this.loadData();
      });
    } else {
      this.ecoleService.createEcole(ecoleData as CreateEcoleDTO).subscribe(() => {
        this.closeEcoleModal();
        this.loadData();
      });
    }
  }

  deleteEcole(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette école ? Toutes les filières associées seront également affectées.')) {
      this.ecoleService.deleteEcole(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // Gestion des filières
  openFiliereModal(filiere?: Filiere): void {
    if (filiere) {
      this.editingFiliere.set(filiere);
      this.filiereForm.patchValue(filiere);
    } else {
      this.editingFiliere.set(null);
      this.filiereForm.reset();
    }
    this.showFiliereModal.set(true);
  }

  closeFiliereModal(): void {
    this.showFiliereModal.set(false);
    this.editingFiliere.set(null);
    this.filiereForm.reset();
  }

  saveFiliere(): void {
    if (this.filiereForm.invalid) return;

    const filiereData = this.filiereForm.value;

    if (this.editingFiliere()) {
      this.filiereService.updateFiliere({
        id: this.editingFiliere()!.id!,
        ...filiereData
      }).subscribe(() => {
        this.closeFiliereModal();
        this.loadData();
      });
    } else {
      this.filiereService.createFiliere(filiereData as CreateFiliereDTO).subscribe(() => {
        this.closeFiliereModal();
        this.loadData();
      });
    }
  }

  deleteFiliere(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filière ? Toutes les classes associées seront également affectées.')) {
      this.filiereService.deleteFiliere(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // Gestion des classes
  openClasseModal(classe?: Classe): void {
    if (classe) {
      this.editingClasse.set(classe);
      this.classeForm.patchValue(classe);
    } else {
      this.editingClasse.set(null);
      this.classeForm.reset();
    }
    this.showClasseModal.set(true);
  }

  closeClasseModal(): void {
    this.showClasseModal.set(false);
    this.editingClasse.set(null);
    this.classeForm.reset();
  }

  saveClasse(): void {
    if (this.classeForm.invalid) return;

    const classeData = this.classeForm.value;

    if (this.editingClasse()) {
      this.classeService.updateClasse({
        id: this.editingClasse()!.id!,
        ...classeData
      }).subscribe(() => {
        this.closeClasseModal();
        this.loadData();
      });
    } else {
      this.classeService.createClasse(classeData as CreateClasseDTO).subscribe(() => {
        this.closeClasseModal();
        this.loadData();
      });
    }
  }

  deleteClasse(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      this.classeService.deleteClasse(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // Helpers
  getEcoleName(ecoleId: string): string {
    const ecole = this.ecoles().find(e => e.id === ecoleId);
    return ecole ? ecole.nom : 'École inconnue';
  }

  getFiliereName(filiereId: string): string {
    const filiere = this.filieres().find(f => f.id === filiereId);
    return filiere ? filiere.nom : 'Filière inconnue';
  }
}
