import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorKeyFill } from '@ng-icons/phosphor-icons/fill';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { AuthService } from '../../../core/services/auth.service';
import { SCALE_IN, SPRING_DEFAULT } from '../../../core/animations/motion.variants';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputText, Button, NgIcon, NgmMotionDirective],
  providers: [provideIcons({ phosphorKeyFill })],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  email = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  readonly SCALE_IN = SCALE_IN;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;

  onSubmit(): void {
    if (!this.email()) {
      this.errorMessage.set('Veuillez entrer votre adresse email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.errorMessage.set('Adresse email invalide');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.authService.forgotPassword(this.email()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Un email de réinitialisation a été envoyé.');
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Une erreur est survenue');
      },
    });
  }
}
