import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorWarningCircle,
  phosphorLightning,
  phosphorGitMerge,
  phosphorFunnel,
  phosphorX,
  phosphorCheck,
  phosphorPencil,
  phosphorEye,
  phosphorArrowRight,
  phosphorCaretRight,
  phosphorUsers,
  phosphorDoor,
  phosphorBooks,
} from '@ng-icons/phosphor-icons/regular';
import {
  phosphorWarningCircleFill,
  phosphorLightningFill,
  phosphorCheckCircleFill,
} from '@ng-icons/phosphor-icons/fill';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SCALE_IN, SLIDE_LEFT, SPRING_DEFAULT, SPRING_SNAPPY } from '../../../core/animations/motion.variants';

export type ConflictType = 'ROOM_DOUBLE_BOOKING' | 'TEACHER_OVERLAP' | 'GROUP_OVERLAP' | 'CAPACITY_EXCEEDED';
export type ConflictSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM';
export type ConflictStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface ConflictEntity {
  type: 'room' | 'teacher' | 'group' | 'course';
  name: string;
}

export interface Conflict {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  status: ConflictStatus;
  title: string;
  description: string;
  entities: ConflictEntity[];
  slot: string;
  detectedAt: string;
}

const MOCK_CONFLICTS: Conflict[] = [
  {
    id: '1',
    type: 'ROOM_DOUBLE_BOOKING',
    severity: 'CRITICAL',
    status: 'OPEN',
    title: 'Double réservation — Amphi A',
    description: 'La salle Amphi A est réservée simultanément par deux cours distincts le mardi de 8h00 à 10h00.',
    entities: [
      { type: 'room', name: 'Amphi A' },
      { type: 'course', name: 'Mathématiques L1' },
      { type: 'course', name: 'Physique L1' },
    ],
    slot: 'Mar. 08h00–10h00',
    detectedAt: '2026-04-23T06:14:00Z',
  },
  {
    id: '2',
    type: 'TEACHER_OVERLAP',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    title: 'Chevauchement enseignant — Dr. Mbarga',
    description: 'Dr. Mbarga est assigné à deux créneaux simultanés le jeudi de 14h00 à 16h00.',
    entities: [
      { type: 'teacher', name: 'Dr. Mbarga' },
      { type: 'course', name: 'Algorithmique L2' },
      { type: 'course', name: 'Structures de données L3' },
    ],
    slot: 'Jeu. 14h00–16h00',
    detectedAt: '2026-04-22T14:30:00Z',
  },
  {
    id: '3',
    type: 'GROUP_OVERLAP',
    severity: 'HIGH',
    status: 'OPEN',
    title: 'Conflit de groupe — L2 Info A',
    description: 'Le groupe L2 Info A a deux cours planifiés au même créneau sans interruption.',
    entities: [
      { type: 'group', name: 'L2 Info A' },
      { type: 'course', name: 'Réseaux informatiques' },
      { type: 'course', name: 'Base de données' },
    ],
    slot: 'Mer. 10h00–12h00',
    detectedAt: '2026-04-22T09:00:00Z',
  },
  {
    id: '4',
    type: 'CAPACITY_EXCEEDED',
    severity: 'MEDIUM',
    status: 'OPEN',
    title: 'Capacité dépassée — Salle B12',
    description: 'La salle B12 (capacité 35 places) est assignée à un groupe de 52 étudiants.',
    entities: [
      { type: 'room', name: 'Salle B12 (cap. 35)' },
      { type: 'group', name: 'L3 Info B (52 étudiants)' },
      { type: 'course', name: 'Génie logiciel' },
    ],
    slot: 'Ven. 08h00–10h00',
    detectedAt: '2026-04-21T16:00:00Z',
  },
  {
    id: '5',
    type: 'TEACHER_OVERLAP',
    severity: 'HIGH',
    status: 'RESOLVED',
    title: 'Chevauchement enseignant — Prof. Nkomo',
    description: 'Prof. Nkomo était assigné à deux cours simultanés. Résolu en réaffectant le cours de Statistiques à Dr. Fotso.',
    entities: [
      { type: 'teacher', name: 'Prof. Nkomo' },
      { type: 'course', name: 'Statistiques L2' },
    ],
    slot: 'Lun. 10h00–12h00',
    detectedAt: '2026-04-20T08:00:00Z',
  },
];

const SEVERITY_CONFIG: Record<ConflictSeverity, { label: string; dot: string; badge: string; panel: string }> = {
  CRITICAL: {
    label: 'Critique',
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-100',
    panel: 'border-l-red-500',
  },
  HIGH: {
    label: 'Élevé',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    panel: 'border-l-amber-500',
  },
  MEDIUM: {
    label: 'Modéré',
    dot: 'bg-blue-400',
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    panel: 'border-l-blue-400',
  },
};

const STATUS_CONFIG: Record<ConflictStatus, { label: string; classes: string }> = {
  OPEN:        { label: 'Ouvert',      classes: 'bg-red-50 text-red-600 border-red-100' },
  IN_PROGRESS: { label: 'En cours',    classes: 'bg-amber-50 text-amber-600 border-amber-100' },
  RESOLVED:    { label: 'Résolu',      classes: 'bg-green-50 text-green-600 border-green-100' },
};

const TYPE_LABELS: Record<ConflictType, string> = {
  ROOM_DOUBLE_BOOKING: 'Double réservation',
  TEACHER_OVERLAP:     'Chevauchement enseignant',
  GROUP_OVERLAP:       'Conflit de groupe',
  CAPACITY_EXCEEDED:   'Capacité dépassée',
};

const ENTITY_ICON: Record<ConflictEntity['type'], string> = {
  room:    'phosphorDoor',
  teacher: 'phosphorUsers',
  group:   'phosphorUsers',
  course:  'phosphorBooks',
};

@Component({
  selector: 'app-conflicts',
  standalone: true,
  imports: [CommonModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorWarningCircle, phosphorLightning, phosphorGitMerge, phosphorFunnel,
      phosphorX, phosphorCheck, phosphorPencil, phosphorEye, phosphorArrowRight, phosphorCaretRight,
      phosphorUsers, phosphorDoor, phosphorBooks,
      phosphorWarningCircleFill, phosphorLightningFill, phosphorCheckCircleFill,
    }),
  ],
  templateUrl: './conflicts.component.html',
})
export class ConflictsComponent {
  readonly FADE_UP = FADE_UP;
  readonly SCALE_IN = SCALE_IN;
  readonly SLIDE_LEFT = SLIDE_LEFT;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  readonly SPRING_SNAPPY = SPRING_SNAPPY;
  readonly SEVERITY_CONFIG = SEVERITY_CONFIG;
  readonly STATUS_CONFIG = STATUS_CONFIG;
  readonly TYPE_LABELS = TYPE_LABELS;
  readonly ENTITY_ICON = ENTITY_ICON;

  conflicts = signal<Conflict[]>(MOCK_CONFLICTS);
  selectedId = signal<string | null>(null);
  filterSeverity = signal<ConflictSeverity | null>(null);
  filterStatus = signal<ConflictStatus | null>(null);

  selectedConflict = computed(() =>
    this.conflicts().find(c => c.id === this.selectedId()) ?? null
  );

  filteredConflicts = computed(() => {
    let list = this.conflicts();
    const sev = this.filterSeverity();
    const sta = this.filterStatus();
    if (sev) list = list.filter(c => c.severity === sev);
    if (sta) list = list.filter(c => c.status === sta);
    return list;
  });

  stats = computed(() => {
    const all = this.conflicts();
    return {
      total:    all.length,
      critical: all.filter(c => c.severity === 'CRITICAL' && c.status !== 'RESOLVED').length,
      open:     all.filter(c => c.status === 'OPEN').length,
      resolved: all.filter(c => c.status === 'RESOLVED').length,
    };
  });

  selectConflict(id: string): void {
    this.selectedId.set(this.selectedId() === id ? null : id);
  }

  closePanel(): void {
    this.selectedId.set(null);
  }

  markInProgress(id: string): void {
    this.conflicts.update(list =>
      list.map(c => c.id === id ? { ...c, status: 'IN_PROGRESS' } : c)
    );
  }

  resolveConflict(id: string): void {
    this.conflicts.update(list =>
      list.map(c => c.id === id ? { ...c, status: 'RESOLVED' } : c)
    );
    this.selectedId.set(null);
  }

  setSeverityFilter(sev: ConflictSeverity | null): void {
    this.filterSeverity.set(this.filterSeverity() === sev ? null : sev);
  }

  setStatusFilter(sta: ConflictStatus | null): void {
    this.filterStatus.set(this.filterStatus() === sta ? null : sta);
  }
}
