import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  onSubmit(): void {
    if (!this.email()) {
      this.errorMessage.set('Veuillez entrer votre adresse email');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.errorMessage.set('Adresse email invalide');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.forgotPassword(this.email()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set('Un email de réinitialisation a été envoyé à votre adresse email.');
        // Optionally navigate to login after a delay
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Une erreur est survenue');
      },
    });
  }
}
