import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { EtudiantService } from '../../../core/services/etudiant.service';
import { GroupeService } from '../../../core/services/groupe.service';
import { ClasseService } from '../../../core/services/classe.service';
import {
  Etudiant,
  Groupe,
  Classe,
  CreateEtudiantDTO,
  GroupeGenerationOptions
} from '../../../core/models/etudiant.model';

@Component({
  selector: 'app-etudiants',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './etudiants.component.html',
  styleUrls: ['./etudiants.component.scss']
})
export class EtudiantsComponent implements OnInit {
  private etudiantService = inject(EtudiantService);
  private groupeService = inject(GroupeService);
  private classeService = inject(ClasseService);
  private fb = inject(FormBuilder);

  // Signaux pour les données
  etudiants = signal<Etudiant[]>([]);
  groupes = signal<Groupe[]>([]);
  classes = signal<Classe[]>([]);

  // Section active
  activeSection = signal<'etudiants' | 'groupes'>('etudiants');

  // Filtres
  classeFilter = signal<string>('');
  groupeFilter = signal<string>('');
  searchTerm = signal<string>('');

  // Modals
  showEtudiantModal = signal(false);
  showGroupeModal = signal(false);
  showGenerationModal = signal(false);

  // Mode édition
  editingEtudiant = signal<Etudiant | null>(null);
  editingGroupe = signal<Groupe | null>(null);

  // Formulaires
  etudiantForm!: FormGroup;
  groupeForm!: FormGroup;
  generationForm!: FormGroup;

  // Données filtrées
  etudiantsFiltered = computed(() => {
    let result = this.etudiants();

    if (this.classeFilter()) {
      result = result.filter(e => e.classeId === this.classeFilter());
    }

    if (this.groupeFilter()) {
      result = result.filter(e => e.groupeId === this.groupeFilter());
    }

    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      result = result.filter(e =>
        e.nom.toLowerCase().includes(term) ||
        e.prenom.toLowerCase().includes(term) ||
        e.matricule.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term)
      );
    }

    return result;
  });

  groupesFiltered = computed(() => {
    let result = this.groupes();

    if (this.classeFilter()) {
      result = result.filter(g => g.classeId === this.classeFilter());
    }

    return result;
  });

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.etudiantForm = this.fb.group({
      matricule: ['', [Validators.required, Validators.minLength(4)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.minLength(8)]],
      dateNaissance: ['', Validators.required],
      classeId: ['', Validators.required],
      groupeId: ['']
    });

    this.groupeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      capaciteMax: [15, [Validators.min(1)]],
      etudiantsIds: this.fb.array([])
    });

    this.generationForm = this.fb.group({
      classeId: ['', Validators.required],
      modeRepartition: ['nombre', Validators.required],
      nombreGroupes: [3, [Validators.min(1)]],
      tailleGroupe: [5, [Validators.min(1)]],
      prefixeNom: ['Groupe', Validators.required],
      repartitionAleatoire: [true]
    });
  }

  loadData(): void {
    this.etudiantService.getEtudiants().subscribe(data => this.etudiants.set(data));
    this.groupeService.getGroupes().subscribe(data => this.groupes.set(data));
    this.classeService.getClasses().subscribe(data => this.classes.set(data));
  }

  // Gestion des sections
  setActiveSection(section: 'etudiants' | 'groupes'): void {
    this.activeSection.set(section);
  }

  // Gestion des étudiants
  openEtudiantModal(etudiant?: Etudiant): void {
    if (etudiant) {
      this.editingEtudiant.set(etudiant);
      this.etudiantForm.patchValue(etudiant);
    } else {
      this.editingEtudiant.set(null);
      this.etudiantForm.reset();
    }
    this.showEtudiantModal.set(true);
  }

  closeEtudiantModal(): void {
    this.showEtudiantModal.set(false);
    this.editingEtudiant.set(null);
    this.etudiantForm.reset();
  }

  saveEtudiant(): void {
    if (this.etudiantForm.invalid) return;

    const etudiantData = this.etudiantForm.value;

    if (this.editingEtudiant()) {
      this.etudiantService.updateEtudiant({
        id: this.editingEtudiant()!.id!,
        ...etudiantData
      }).subscribe(() => {
        this.closeEtudiantModal();
        this.loadData();
      });
    } else {
      this.etudiantService.createEtudiant(etudiantData as CreateEtudiantDTO).subscribe(() => {
        this.closeEtudiantModal();
        this.loadData();
      });
    }
  }

  deleteEtudiant(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      this.etudiantService.deleteEtudiant(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // Gestion des groupes
  get etudiantsIdsArray(): FormArray {
    return this.groupeForm.get('etudiantsIds') as FormArray;
  }

  openGroupeModal(groupe: Groupe): void {
    this.editingGroupe.set(groupe);
    this.groupeForm.patchValue({
      nom: groupe.nom,
      description: groupe.description,
      capaciteMax: groupe.capaciteMax
    });

    // Charger les étudiants du groupe
    this.etudiantsIdsArray.clear();
    if (groupe.etudiantsIds && groupe.etudiantsIds.length > 0) {
      groupe.etudiantsIds.forEach(etudiantId => {
        this.etudiantsIdsArray.push(this.fb.control(etudiantId));
      });
    }

    this.showGroupeModal.set(true);
  }

  closeGroupeModal(): void {
    this.showGroupeModal.set(false);
    this.editingGroupe.set(null);
    this.groupeForm.reset();
    this.etudiantsIdsArray.clear();
  }

  saveGroupe(): void {
    if (this.groupeForm.invalid || !this.editingGroupe()) return;

    const groupeData = {
      id: this.editingGroupe()!.id!,
      nom: this.groupeForm.value.nom,
      description: this.groupeForm.value.description,
      capaciteMax: this.groupeForm.value.capaciteMax,
      etudiantsIds: this.etudiantsIdsArray.value,
      classeId: this.editingGroupe()!.classeId
    };

    this.groupeService.updateGroupe(groupeData).subscribe(() => {
      this.closeGroupeModal();
      this.loadData();
    });
  }

  deleteGroupe(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce groupe ? Les étudiants ne seront pas supprimés.')) {
      this.groupeService.deleteGroupe(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  toggleEtudiant(etudiantId: string): void {
    const index = this.etudiantsIdsArray.value.indexOf(etudiantId);
    if (index > -1) {
      this.etudiantsIdsArray.removeAt(index);
    } else {
      this.etudiantsIdsArray.push(this.fb.control(etudiantId));
    }
  }

  isEtudiantInGroupe(etudiantId: string): boolean {
    return this.etudiantsIdsArray.value.includes(etudiantId);
  }

  // Génération de groupes
  openGenerationModal(): void {
    this.generationForm.reset({
      modeRepartition: 'nombre',
      nombreGroupes: 3,
      tailleGroupe: 5,
      prefixeNom: 'Groupe',
      repartitionAleatoire: true
    });
    this.showGenerationModal.set(true);
  }

  closeGenerationModal(): void {
    this.showGenerationModal.set(false);
    this.generationForm.reset();
  }

  genererGroupes(): void {
    if (this.generationForm.invalid) return;

    const formValue = this.generationForm.value;
    const options: GroupeGenerationOptions = {
      classeId: formValue.classeId,
      prefixeNom: formValue.prefixeNom,
      repartitionAleatoire: formValue.repartitionAleatoire,
      nombreGroupes: formValue.modeRepartition === 'nombre' ? formValue.nombreGroupes : undefined,
      tailleGroupe: formValue.modeRepartition === 'taille' ? formValue.tailleGroupe : undefined
    };

    this.groupeService.genererGroupes(options, this.etudiants()).subscribe(() => {
      this.closeGenerationModal();
      this.loadData();
    });
  }

  // Helpers
  getClasseName(classeId: string): string {
    const classe = this.classes().find(c => c.id === classeId);
    return classe ? classe.nom : 'Classe inconnue';
  }

  getGroupeName(groupeId?: string): string {
    if (!groupeId) return 'Aucun groupe';
    const groupe = this.groupes().find(g => g.id === groupeId);
    return groupe ? groupe.nom : 'Groupe inconnu';
  }

  getEtudiantsInGroupe(groupeId: string): Etudiant[] {
    const groupe = this.groupes().find(g => g.id === groupeId);
    if (!groupe || !groupe.etudiantsIds) return [];
    return this.etudiants().filter(e => groupe.etudiantsIds.includes(e.id!));
  }

  getEtudiantsOfClasseNotInGroup(classeId: string): Etudiant[] {
    if (!this.editingGroupe()) return [];

    // Récupérer tous les IDs d'étudiants déjà dans d'autres groupes
    const etudiantsDejaAffectes = new Set<string>();
    this.groupes().forEach(groupe => {
      // Ne pas compter les étudiants du groupe en cours d'édition
      if (groupe.id !== this.editingGroupe()!.id && groupe.etudiantsIds) {
        groupe.etudiantsIds.forEach(id => etudiantsDejaAffectes.add(id));
      }
    });

    // Filtrer les étudiants qui ne sont ni dans le groupe actuel ni dans un autre groupe
    return this.etudiants().filter(e =>
      e.classeId === classeId &&
      !this.isEtudiantInGroupe(e.id!) &&
      !etudiantsDejaAffectes.has(e.id!)
    );
  }

//pour filtrer les groupes par classe
  getGroupesForClasse(classeId: string): Groupe[] {
    return this.groupes().filter(groupe => groupe.classeId === classeId);
  }

  calculateAge(dateNaissance: Date | string): number {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  protected readonly Math = Math;
}
