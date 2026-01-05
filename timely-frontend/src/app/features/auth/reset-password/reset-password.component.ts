import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  token = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  errorMessage = signal('');
  isLoading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isValidatingToken = signal(true);

  ngOnInit(): void {
    // Get token from URL query params (e.g., ?token=abc123)
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.token.set(token);
        this.validateToken(token);
      } else {
        this.errorMessage.set('Token manquant. Veuillez utiliser le lien reçu par email.');
        this.isValidatingToken.set(false);
      }
    });
  }

  validateToken(token: string): void {
    this.authService.validateResetToken(token).subscribe({
      next: (response) => {
        this.isValidatingToken.set(false);
        if (!response.valid) {
          this.errorMessage.set('Le lien de réinitialisation est invalide ou a expiré.');
        }
      },
      error: (error) => {
        this.isValidatingToken.set(false);
        this.errorMessage.set(
          error.message || 'Le lien de réinitialisation est invalide ou a expiré.'
        );
      },
    });
  }

  onSubmit(): void {
    this.errorMessage.set('');

    // Validations
    if (!this.newPassword() || !this.confirmPassword()) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }

    if (this.newPassword().length < 8) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('Les mots de passe ne correspondent pas');
      return;
    }

    this.isLoading.set(true);

    this.authService.resetPassword(this.token(), this.newPassword()).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Redirect to login with success message
        this.router.navigate(['/auth/login'], {
          state: {
            message:
              'Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.',
          },
        });
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Erreur lors de la réinitialisation');
        this.isLoading.set(false);
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }
}
