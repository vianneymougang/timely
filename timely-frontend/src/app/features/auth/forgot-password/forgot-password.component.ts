import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  private router = inject(Router);

  email = signal('');
  errorMessage = signal('');
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

    // TODO: Appel API pour envoyer le code
    // this.authService.sendResetCode(this.email()).subscribe(...)

    // Simuler l'envoi (à remplacer par l'appel API)
    setTimeout(() => {
      this.isLoading.set(false);
      // Rediriger vers la page de vérification du code
      this.router.navigate(['/auth/verify-code'], {
        state: { email: this.email() }
      });
    }, 1000);
  }
}
