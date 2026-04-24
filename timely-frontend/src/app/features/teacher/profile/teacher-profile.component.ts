import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorUser, phosphorLock, phosphorEye, phosphorEyeSlash,
  phosphorCheckCircle, phosphorWarningCircle,
} from '@ng-icons/phosphor-icons/regular';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { FADE_UP, SPRING_DEFAULT, SPRING_SNAPPY } from '../../../core/animations/motion.variants';
import { AuthService } from '../../../core/services/auth.service';
import { UserService, UpdateUserRequest } from '../../../core/services/user.service';
import { catchError, of, Subscription } from 'rxjs';

interface Toast { id: number; type: 'success' | 'error'; message: string; }

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon, NgmMotionDirective],
  providers: [
    provideIcons({
      phosphorUser, phosphorLock, phosphorEye, phosphorEyeSlash,
      phosphorCheckCircle, phosphorWarningCircle,
    }),
  ],
  templateUrl: './teacher-profile.component.html',
  styleUrl: './teacher-profile.component.scss',
})
export class TeacherProfileComponent implements OnInit, OnDestroy {
  readonly FADE_UP = FADE_UP;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  readonly SPRING_SNAPPY = SPRING_SNAPPY;

  private authService = inject(AuthService);
  private userService = inject(UserService);

  private subs: Subscription[] = [];
  private toastId = 0;

  toasts = signal<Toast[]>([]);
  savingProfil = signal(false);
  savingPassword = signal(false);

  profil = signal({ name: '', email: '' });

  password = signal({ current: '', next: '', confirm: '' });
  showCurrent = signal(false);
  showNext = signal(false);
  showConfirm = signal(false);
  passwordStrength = signal(0);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profil.set({ name: user.name ?? '', email: user.email ?? '' });
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  updateProfilField(field: 'name' | 'email', value: string): void {
    this.profil.update(p => ({ ...p, [field]: value }));
  }

  toggleShowCurrent(): void { this.showCurrent.update(v => !v); }
  toggleShowNext(): void { this.showNext.update(v => !v); }
  toggleShowConfirm(): void { this.showConfirm.update(v => !v); }

  get userInitials(): string {
    const n = this.profil().name;
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return n.substring(0, 2).toUpperCase() || 'PR';
  }

  saveProfil(): void {
    if (this.savingProfil()) return;
    this.savingProfil.set(true);
    const user = this.authService.currentUser();
    if (!user?.id) { this.savingProfil.set(false); return; }

    const req: UpdateUserRequest = { name: this.profil().name, email: this.profil().email };
    const sub = this.userService.updateUser(user.id, req)
      .pipe(catchError((e: unknown) => { this.toast('error', this.httpMsg(e)); return of(null); }))
      .subscribe(res => {
        this.savingProfil.set(false);
        if (res) this.toast('success', 'Profil mis à jour avec succès.');
      });
    this.subs.push(sub);
  }

  updatePasswordField(field: 'current' | 'next' | 'confirm', value: string): void {
    this.password.update(p => ({ ...p, [field]: value }));
    if (field === 'next') this.computeStrength(value);
  }

  private computeStrength(pw: string): void {
    let score = 0;
    if (pw.length >= 8)            score++;
    if (/[A-Z]/.test(pw))         score++;
    if (/[0-9]/.test(pw))         score++;
    if (/[^A-Za-z0-9]/.test(pw))  score++;
    this.passwordStrength.set(score);
  }

  get strengthLabel(): string {
    return ['', 'Faible', 'Moyen', 'Bon', 'Fort'][this.passwordStrength()] ?? '';
  }

  get strengthColor(): string {
    return ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'][this.passwordStrength()] ?? '';
  }

  passwordRules() {
    const pwd = this.password().next;
    return [
      { text: 'Minimum 8 caractères',          ok: pwd.length >= 8 },
      { text: 'Au moins une majuscule',         ok: /[A-Z]/.test(pwd) },
      { text: 'Au moins un chiffre',            ok: /[0-9]/.test(pwd) },
      { text: 'Au moins un caractère spécial',  ok: /[^A-Za-z0-9]/.test(pwd) },
    ];
  }

  savePassword(): void {
    const { current, next, confirm } = this.password();
    if (!current) { this.toast('error', 'Saisissez votre mot de passe actuel.'); return; }
    if (next.length < 8) { this.toast('error', 'Le nouveau mot de passe doit faire au moins 8 caractères.'); return; }
    if (next !== confirm) { this.toast('error', 'Les mots de passe ne correspondent pas.'); return; }

    this.savingPassword.set(true);
    const sub = this.authService.changePassword(current, next)
      .pipe(catchError((e: unknown) => { this.toast('error', this.httpMsg(e)); return of(null); }))
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

  toast(type: Toast['type'], message: string): void {
    const id = ++this.toastId;
    this.toasts.update(l => [...l, { id, type, message }]);
    setTimeout(() => this.toasts.update(l => l.filter(t => t.id !== id)), 4500);
  }

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
}
