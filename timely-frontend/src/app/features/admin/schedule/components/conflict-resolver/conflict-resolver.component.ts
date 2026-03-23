import { Component, Input, Output, EventEmitter, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  ConflitResponse,
  TypeConflitLabels,
  SeveriteLabels
} from '../../../../../core/models/planning.model';

export type ResolutionType = 'DEPLACER_SALLE' | 'CHANGER_HORAIRE' | 'REASSIGNER_ENSEIGNANT' | 'ANNULER_COURS' | 'MANUEL';

export interface ResolutionData {
  type: ResolutionType;
  commentaire: string;
  nouvelleSalle?: string;
  nouvelHoraire?: string;
  nouvelEnseignant?: string;
}

@Component({
  selector: 'app-conflict-resolver',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conflict-resolver.component.html',
  styleUrl: './conflict-resolver.component.scss'
})
export class ConflictResolverComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() set conflict(value: ConflitResponse | null) {
    this.conflit.set(value);
    if (value) {
      this.initializeForm();
    }
  }

  @Input() isOpen = signal(false);
  @Output() close = new EventEmitter<void>();
  @Output() resolve = new EventEmitter<ResolutionData>();

  conflit = signal<ConflitResponse | null>(null);
  resolutionForm!: FormGroup;
  selectedType = signal<ResolutionType>('MANUEL');

  typeConflitLabels = TypeConflitLabels;
  severiteLabels = SeveriteLabels;

  resolutionTypes: { value: ResolutionType; label: string; icon: string; description: string }[] = [
    {
      value: 'DEPLACER_SALLE',
      label: 'Déplacer vers une autre salle',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      description: 'Déplacer le cours vers une salle disponible'
    },
    {
      value: 'CHANGER_HORAIRE',
      label: 'Modifier l\'horaire',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      description: 'Changer l\'heure du créneau'
    },
    {
      value: 'REASSIGNER_ENSEIGNANT',
      label: 'Réassigner l\'enseignant',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      description: 'Attribuer un autre enseignant au cours'
    },
    {
      value: 'ANNULER_COURS',
      label: 'Annuler le cours',
      icon: 'M6 18L18 6M6 6l12 12',
      description: 'Annuler le créneau en conflit'
    },
    {
      value: 'MANUEL',
      label: 'Résolution manuelle',
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      description: 'Résoudre manuellement avec un commentaire'
    }
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.resolutionForm = this.fb.group({
      type: [this.selectedType(), Validators.required],
      commentaire: ['', [Validators.required, Validators.minLength(10)]],
      nouvelleSalle: [''],
      nouvelHoraire: [''],
      nouvelEnseignant: ['']
    });

    // Écouter les changements de type
    this.resolutionForm.get('type')?.valueChanges.subscribe(type => {
      this.selectedType.set(type);
      this.updateValidators(type);
    });
  }

  updateValidators(type: ResolutionType): void {
    // Reset tous les validateurs optionnels
    this.resolutionForm.get('nouvelleSalle')?.clearValidators();
    this.resolutionForm.get('nouvelHoraire')?.clearValidators();
    this.resolutionForm.get('nouvelEnseignant')?.clearValidators();

    // Ajouter les validateurs selon le type
    switch (type) {
      case 'DEPLACER_SALLE':
        this.resolutionForm.get('nouvelleSalle')?.setValidators([Validators.required]);
        break;
      case 'CHANGER_HORAIRE':
        this.resolutionForm.get('nouvelHoraire')?.setValidators([Validators.required]);
        break;
      case 'REASSIGNER_ENSEIGNANT':
        this.resolutionForm.get('nouvelEnseignant')?.setValidators([Validators.required]);
        break;
    }

    // Mettre à jour la validité
    this.resolutionForm.get('nouvelleSalle')?.updateValueAndValidity();
    this.resolutionForm.get('nouvelHoraire')?.updateValueAndValidity();
    this.resolutionForm.get('nouvelEnseignant')?.updateValueAndValidity();
  }

  selectType(type: ResolutionType): void {
    this.selectedType.set(type);
    this.resolutionForm.patchValue({ type });
  }

  closeModal(): void {
    this.resolutionForm.reset();
    this.selectedType.set('MANUEL');
    this.close.emit();
  }

  submitResolution(): void {
    if (this.resolutionForm.valid) {
      const data: ResolutionData = this.resolutionForm.value;
      this.resolve.emit(data);
      this.closeModal();
    }
  }

  getSeveriteColor(severite: string): string {
    switch (severite) {
      case 'CRITIQUE': return 'text-red-600 bg-red-50 border-red-200';
      case 'MOYENNE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'MINEURE': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  getSeveriteIcon(severite: string): string {
    switch (severite) {
      case 'CRITIQUE':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'MOYENNE':
        return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'MINEURE':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }
}
