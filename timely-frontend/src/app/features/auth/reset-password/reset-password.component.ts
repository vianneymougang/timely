import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  private router = inject(Router);

  email = signal('');
  code = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  errorMessage = signal('');
  isLoading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  ngOnInit(): void {
    // Récupérer l'email et le code depuis l'état de navigation
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    if (state && state['email'] && state['code']) {
      this.email.set(state['email']);
      this.code.set(state['code']);
    } else {
      // Si pas d'email/code, rediriger vers forgot-password
      this.router.navigate(['/auth/forgot-password']);
    }
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

    // TODO: Appel API pour réinitialiser le mot de passe
    /*
    this.authService.resetPassword(
      this.email(),
      this.code(),
      this.newPassword()
    ).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.errorMessage.set('Erreur lors de la réinitialisation');
        this.isLoading.set(false);
      }
    });
    */

    // Simuler la réinitialisation (à remplacer par l'appel API)
    setTimeout(() => {
      this.isLoading.set(false);
      // Rediriger vers login avec message de succès
      this.router.navigate(['/auth/login'], {
        state: { message: 'Mot de passe réinitialisé avec succès !' }
      });
    }, 1000);
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }
}
