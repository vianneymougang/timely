import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorBooks, phosphorPlus, phosphorPencil, phosphorTrash, phosphorX,
  phosphorMagnifyingGlass, phosphorArrowClockwise, phosphorTag,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT, SPRING_SNAPPY } from '../../../core/animations/motion.variants';
import { CoursService } from '../../../core/services/cours.service';
import { UEService } from '../../../core/services/ue.service';
import { FiliereService } from '../../../core/services/filiere.service';
import { ClasseService } from '../../../core/services/classe.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { Cours, UE, Filiere, CreateCoursDTO, CreateUEDTO } from '../../../core/models/cours.model';
import { Classe } from '../../../core/models/academic.model';
import { Teacher } from '../../../core/models/teacher.model';

@Component({
  selector: 'app-courses-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorBooks, phosphorPlus, phosphorPencil, phosphorTrash, phosphorX,
      phosphorMagnifyingGlass, phosphorArrowClockwise, phosphorTag,
    }),
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesComponent implements OnInit {
  readonly FADE_UP = FADE_UP;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  readonly SPRING_SNAPPY = SPRING_SNAPPY;

  private coursService = inject(CoursService);
  private ueService = inject(UEService);
  private filiereService = inject(FiliereService);
  private classeService = inject(ClasseService);
  private teacherService = inject(TeacherService);
  private fb = inject(FormBuilder);

  cours = signal<Cours[]>([]);
  ues = signal<UE[]>([]);
  filieres = signal<Filiere[]>([]);
  classes = signal<Classe[]>([]);
  teachers = signal<Teacher[]>([]);

  // Section active (cours ou ue)
  activeSection = signal<'cours' | 'ue'>('cours');

  // Modals
  showCoursModal = signal(false);
  showUEModal = signal(false);

  // Mode édition
  editingCours = signal<Cours | null>(null);
  editingUE = signal<UE | null>(null);

  // Formulaires
  coursForm!: FormGroup;
  ueForm!: FormGroup;

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.coursForm = this.fb.group({
      intitule: ['', [Validators.required, Validators.minLength(3)]],
      volumeHoraire: [0, [Validators.required, Validators.min(1)]],
      typeCours: ['CM', Validators.required],
      classeId: ['', Validators.required],
      ueId: ['', Validators.required],
      enseignantId: ['', Validators.required]
    });

    this.ueForm = this.fb.group({
      intituleUE: ['', [Validators.required, Validators.minLength(3)]],
      credit: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
      semestre: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      filiereId: ['', Validators.required]
    });
  }

  loadData(): void {
    this.coursService.getCours().subscribe(data => this.cours.set(data));
    this.ueService.getUE().subscribe(data => this.ues.set(data));
    this.filiereService.getFilieres().subscribe(data => this.filieres.set(data));
    this.classeService.getClasses().subscribe(data => this.classes.set(data));
    this.teacherService.getTeachers().subscribe(data => this.teachers.set(data));
  }

  // Gestion des sections
  setActiveSection(section: 'cours' | 'ue'): void {
    this.activeSection.set(section);
  }

  // Gestion des cours
  openCoursModal(cours?: Cours): void {
    if (cours) {
      this.editingCours.set(cours);
      this.coursForm.patchValue({
        ...cours,
        enseignantId: cours.enseignantId ?? ''
      });
    } else {
      this.editingCours.set(null);
      this.coursForm.reset({ typeCours: 'CM' });
    }
    this.showCoursModal.set(true);
  }

  closeCoursModal(): void {
    this.showCoursModal.set(false);
    this.editingCours.set(null);
    this.coursForm.reset();
  }

  saveCours(): void {
    if (this.coursForm.invalid) return;

    const coursData = this.coursForm.value;

    if (this.editingCours()) {
      this.coursService.updateCours({
        id: this.editingCours()!.id!,
        ...coursData
      }).subscribe(() => {
        this.closeCoursModal();
        this.loadData();
      });
    } else {
      this.coursService.createCours(coursData as CreateCoursDTO).subscribe(() => {
        this.closeCoursModal();
        this.loadData();
      });
    }
  }

  deleteCours(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      this.coursService.deleteCours(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // Gestion des UE
  openUEModal(ue?: UE): void {
    if (ue) {
      this.editingUE.set(ue);
      this.ueForm.patchValue(ue);
    } else {
      this.editingUE.set(null);
      this.ueForm.reset({ semestre: 1, credit: 0 });
    }
    this.showUEModal.set(true);
  }

  closeUEModal(): void {
    this.showUEModal.set(false);
    this.editingUE.set(null);
    this.ueForm.reset();
  }

  saveUE(): void {
    if (this.ueForm.invalid) return;

    const ueData = this.ueForm.value;

    if (this.editingUE()) {
      this.ueService.updateUE({
        id: this.editingUE()!.id!,
        ...ueData
      }).subscribe(() => {
        this.closeUEModal();
        this.loadData();
      });
    } else {
      this.ueService.createUE(ueData as CreateUEDTO).subscribe(() => {
        this.closeUEModal();
        this.loadData();
      });
    }
  }

  deleteUE(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette UE ?')) {
      this.ueService.deleteUE(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // Helpers
  getUEName(ueId: string): string {
    const ue = this.ues().find(u => u.id === ueId);
    return ue ? ue.intituleUE : 'UE inconnue';
  }

  getTeacherName(enseignantId: string): string {
    const t = this.teachers().find(t => t.id === enseignantId);
    return t ? `${t.firstName} ${t.lastName}` : 'Enseignant inconnu';
  }

  getFiliereName(filiereId: string): string {
    const filiere = this.filieres().find(f => f.id === filiereId);
    return filiere ? filiere.nom : 'Filière inconnue';
  }

  // TrackBy functions for *ngFor
  trackById(index: number, item: any): string | number {
    return item.id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
