import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorUser, phosphorLock, phosphorBuildings, phosphorBell, phosphorGear,
  phosphorCheckCircle, phosphorWarningCircle, phosphorX, phosphorEye, phosphorEyeSlash,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT, SPRING_SNAPPY } from '../../../core/animations/motion.variants';
import { AuthService } from '../../../core/services/auth.service';
import { UserService, UpdateUserRequest } from '../../../core/services/user.service';
import { EcoleService, EcoleDto } from '../../../core/services/ecole.service';
import { UpdateEcoleDTO } from '../../../core/models/academic.model';
import { catchError, of, Subscription } from 'rxjs';

export type SettingsTab = 'profil' | 'securite' | 'etablissement' | 'notifications' | 'systeme';

export interface Toast { id: number; type: 'success' | 'error'; message: string; }

type NotifSettings = {
  conflits: boolean; reservations: boolean; rappels: boolean; rapports: boolean;
  connexions: boolean; emailConflits: boolean; emailRapports: boolean;
};

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorUser, phosphorLock, phosphorBuildings, phosphorBell, phosphorGear,
      phosphorCheckCircle, phosphorWarningCircle, phosphorX, phosphorEye, phosphorEyeSlash,
    }),
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
  readonly FADE_UP = FADE_UP;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  readonly SPRING_SNAPPY = SPRING_SNAPPY;

  private authService  = inject(AuthService);
  private userService  = inject(UserService);
  private ecoleService = inject(EcoleService);

  private subs: Subscription[] = [];
  private toastId = 0;

  // ── Onglet actif ─────────────────────────────────────────────────────────
  activeTab = signal<SettingsTab>('profil');

  tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'profil',        label: 'Profil',        icon: 'phosphorUser'      },
    { id: 'securite',      label: 'Sécurité',      icon: 'phosphorLock'      },
    { id: 'etablissement', label: 'Établissement', icon: 'phosphorBuildings' },
    { id: 'notifications', label: 'Notifications', icon: 'phosphorBell'      },
    { id: 'systeme',       label: 'Système',        icon: 'phosphorGear'     },
  ];

  // ── Toast ─────────────────────────────────────────────────────────────────
  toasts = signal<Toast[]>([]);

  // ── État global ───────────────────────────────────────────────────────────
  savingProfil        = signal(false);
  savingPassword      = signal(false);
  savingEtab          = signal(false);
  savingNotifications = signal(false);
  savingSysteme       = signal(false);

  // ── Profil ────────────────────────────────────────────────────────────────
  profil = signal({
    name:    '',
    surname: '',
    email:   '',
    phone:   '',
    role:    '',
  });

  // ── Sécurité ──────────────────────────────────────────────────────────────
  password = signal({
    current:  '',
    next:     '',
    confirm:  '',
  });

  toggleShowCurrent(): void {
    this.showCurrent.update(v => !v);
  }

  toggleShowNext(): void {
    this.showNext.update(v => !v);
  }

  toggleShowConfirm(): void {
    this.showConfirm.update(v => !v);
  }
  showCurrent = signal(false);
  showNext    = signal(false);
  showConfirm = signal(false);

  passwordStrength = signal(0); // 0-4

  passwordRules() {
    const pwd = this.password().next || '';

    return [
      { text: 'Minimum 8 caractères',         ok: pwd.length >= 8 },
      { text: 'Au moins une majuscule',       ok: /[A-Z]/.test(pwd) },
      { text: 'Au moins un chiffre',          ok: /[0-9]/.test(pwd) },
      { text: 'Au moins un caractère spécial',ok: /[^A-Za-z0-9]/.test(pwd) }
    ];
  }

  getNotif(key: keyof NotifSettings): boolean {
    return this.notifications()[key];
  }

  // ── Établissement ─────────────────────────────────────────────────────────
  ecoles        = signal<EcoleDto[]>([]);
  ecoleLoading  = signal(false);

  etablissement = signal({
    nom:                '',
    code:               '',
    adresse:            '',
    telephone:          '',
    email:              '',
    contactResponsable: '',
  });

  private static readonly NOTIF_KEY = 'timely_notif_prefs';
  private static readonly SYSTEM_KEY = 'timely_system_prefs';

  // ── Notifications ─────────────────────────────────────────────────────────
  notifications = signal<NotifSettings>({
    conflits:       true,
    reservations:   true,
    rappels:        false,
    rapports:       true,
    connexions:     false,
    emailConflits:  true,
    emailRapports:  false,
  });

  // ── Système ───────────────────────────────────────────────────────────────
  systeme = signal({
    langue:          'fr',
    theme:           'light',
    fuseau:          'Africa/Douala',
    formatDate:      'dd/MM/yyyy',
    sessionTimeout:  '30',
    autoSave:        true,
    denseMode:       false,
  });

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadProfil();
    this.loadEcoles();
    this.loadSavedPrefs();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  // ── Chargement données ────────────────────────────────────────────────────
  private loadProfil(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profil.update(p => ({
        ...p,
        name:  user.name ?? '',
        email: user.email ?? '',
        role:  user.role ?? '',
      }));
    }
  }

  private loadSavedPrefs(): void {
    try {
      const notif = localStorage.getItem(SettingsComponent.NOTIF_KEY);
      if (notif) this.notifications.set(JSON.parse(notif) as NotifSettings);
    } catch { /* ignore */ }
    try {
      const sys = localStorage.getItem(SettingsComponent.SYSTEM_KEY);
      if (sys) this.systeme.set(JSON.parse(sys));
    } catch { /* ignore */ }
  }

  private loadEcoles(): void {
    this.ecoleLoading.set(true);
    const sub = this.ecoleService.fetchEcolesFromApi()
      .pipe(catchError(() => of([])))
      .subscribe(ecoles => {
        this.ecoles.set(ecoles as EcoleDto[]);
        if ((ecoles as EcoleDto[]).length > 0) {
          const e = (ecoles as EcoleDto[])[0];
          this.etablissement.set({
            nom:                e.nom ?? '',
            code:               e.code ?? '',
            adresse:            e.adresse ?? '',
            telephone:          e.telephone ?? '',
            email:              e.email ?? '',
            contactResponsable: e.contactResponsable ?? '',
          });
        }
        this.ecoleLoading.set(false);
      });
    this.subs.push(sub);
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  setTab(tab: SettingsTab): void { this.activeTab.set(tab); }

  // ── Profil ────────────────────────────────────────────────────────────────
  updateProfilField(field: string, value: string): void {
    this.profil.update(p => ({ ...p, [field]: value }));
  }

  saveProfil(): void {
    if (this.savingProfil()) return;
    this.savingProfil.set(true);
    const user = this.authService.currentUser();
    if (!user?.id) { this.savingProfil.set(false); return; }

    const req: UpdateUserRequest = {
      name:    this.profil().name,
      surname: this.profil().surname,
      email:   this.profil().email,
    };
    const sub = this.userService.updateUser(user.id, req)
      .pipe(catchError((e: unknown) => { this.toast('error', this.httpMsg(e)); return of(null); }))
      .subscribe(res => {
        this.savingProfil.set(false);
        if (res) this.toast('success', 'Profil mis à jour avec succès.');
      });
    this.subs.push(sub);
  }

  // ── Mot de passe ──────────────────────────────────────────────────────────
  updatePasswordField(field: string, value: string): void {
    this.password.update(p => ({ ...p, [field]: value }));
    if (field === 'next') this.computeStrength(value);
  }

  private computeStrength(pw: string): void {
    let score = 0;
    if (pw.length >= 8)              score++;
    if (/[A-Z]/.test(pw))           score++;
    if (/[0-9]/.test(pw))           score++;
    if (/[^A-Za-z0-9]/.test(pw))   score++;
    this.passwordStrength.set(score);
  }

  get strengthLabel(): string {
    return ['', 'Faible', 'Moyen', 'Bon', 'Fort'][this.passwordStrength()] ?? '';
  }
  get strengthColor(): string {
    return ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'][this.passwordStrength()] ?? '';
  }

  savePassword(): void {
    const { current, next, confirm } = this.password();
    if (!current) { this.toast('error', 'Saisissez votre mot de passe actuel.'); return; }
    if (next.length < 8) { this.toast('error', 'Le nouveau mot de passe doit contenir au moins 8 caractères.'); return; }
    if (next !== confirm) { this.toast('error', 'Les mots de passe ne correspondent pas.'); return; }

    this.savingPassword.set(true);
    const sub = this.authService.changePassword(current, next)
      .pipe(catchError((e: unknown) => {
        this.toast('error', this.httpMsg(e));
        return of(null);
      }))
      .subscribe(res => {
        this.savingPassword.set(false);
        if (res !== null) {
          this.password.set({ current: '', next: '', confirm: '' });
          this.passwordStrength.set(0);
          this.toast('success', 'Mot de passe modifié avec succès.');
        }
      });
    this.subs.push(sub);
  }

  // ── Établissement ─────────────────────────────────────────────────────────
  updateEtabField(field: string, value: string): void {
    this.etablissement.update(e => ({ ...e, [field]: value }));
  }

  saveEtablissement(): void {
    if (this.savingEtab()) return;
    this.savingEtab.set(true);
    const ecole = this.ecoles()[0];
    if (!ecole?.id) { this.savingEtab.set(false); return; }

    const payload: UpdateEcoleDTO = {
      id:        ecole.id,
      nom:       this.etablissement().nom,
      directeur: this.etablissement().contactResponsable,
      description: this.etablissement().adresse,
    };
    const sub = this.ecoleService.updateEcole(payload)
      .pipe(catchError((e: unknown) => { this.toast('error', this.httpMsg(e)); return of(null); }))
      .subscribe(res => {
        this.savingEtab.set(false);
        if (res) this.toast('success', 'Établissement mis à jour.');
      });
    this.subs.push(sub);
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  toggleNotif(key: keyof NotifSettings): void {
    this.notifications.update(n => ({ ...n, [key]: !n[key] }));
  }

  saveNotifications(): void {
    this.savingNotifications.set(true);
    localStorage.setItem(SettingsComponent.NOTIF_KEY, JSON.stringify(this.notifications()));
    this.savingNotifications.set(false);
    this.toast('success', 'Préférences de notifications sauvegardées.');
  }

  // ── Système ───────────────────────────────────────────────────────────────
  updateSystemeField(field: string, value: string | boolean): void {
    this.systeme.update(s => ({ ...s, [field]: value }));
  }

  saveSysteme(): void {
    this.savingSysteme.set(true);
    localStorage.setItem(SettingsComponent.SYSTEM_KEY, JSON.stringify(this.systeme()));
    this.savingSysteme.set(false);
    this.toast('success', 'Paramètres système enregistrés.');
  }

  // ── Toast helpers ─────────────────────────────────────────────────────────
  toast(type: Toast['type'], message: string): void {
    const id = ++this.toastId;
    this.toasts.update(l => [...l, { id, type, message }]);
    setTimeout(() => this.dismissToast(id), 4500);
  }

  dismissToast(id: number): void {
    this.toasts.update(l => l.filter(t => t.id !== id));
  }

  // ── HTTP error helper ─────────────────────────────────────────────────────
  private httpMsg(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0)   return 'Serveur inaccessible.';
      if (err.status === 401) return 'Session expirée.';
      if (err.status === 403) return 'Accès refusé.';
      if (err.status >= 500)  return 'Erreur interne du serveur.';
      return err.error?.message ?? `Erreur ${err.status}`;
    }
    return (err as Error)?.message ?? 'Erreur inattendue.';
  }

  // ── Notif items (typed to avoid template inference issue) ─────────────────
  readonly notifInApp: { key: keyof NotifSettings; icon: string; color: string; label: string; sub: string }[] = [
    { key: 'conflits',     icon: 'warning',   color: 'text-red-400',   label: 'Conflits de planning',   sub: 'Quand un conflit de créneau est détecté' },
    { key: 'reservations', icon: 'event',     color: 'text-teal-500',  label: 'Réservations',           sub: 'Nouvelles réservations et modifications' },
    { key: 'rappels',      icon: 'alarm',     color: 'text-amber-500', label: 'Rappels de cours',       sub: '30 minutes avant chaque créneau' },
    { key: 'rapports',     icon: 'bar_chart', color: 'text-blue-500',  label: 'Génération de rapports', sub: 'Quand un rapport est prêt' },
  ];

  readonly notifEmail: { key: keyof NotifSettings; icon: string; color: string; label: string; sub: string }[] = [
    { key: 'emailConflits', icon: 'mail', color: 'text-red-400',   label: 'Conflits critiques',       sub: 'Email immédiat pour les conflits non résolus' },
    { key: 'emailRapports', icon: 'mail', color: 'text-blue-500',  label: 'Rapports hebdomadaires',   sub: 'Récapitulatif chaque lundi matin' },
    { key: 'connexions',    icon: 'mail', color: 'text-slate-400', label: 'Connexions inhabituelles', sub: 'Alerte si connexion depuis un nouvel appareil' },
  ];

  // ── Getters UI ────────────────────────────────────────────────────────────
  get userInitials(): string {
    const n = this.profil().name;
    const s = this.profil().surname;
    return `${n.charAt(0)}${s.charAt(0)}`.toUpperCase() || 'AD';
  }
}
