import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);

  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  // Comptes rapides pour le développement
  quickAccess = [
    {
      label: 'Administrateur',
      email: 'admin@isjcam.org',
      icon: '👨‍💼',
      description: 'Accès complet'
    },
    {
      label: 'Enseignant',
      email: 'arthur.pessah@isjcam.org',
      icon: '👨‍🏫',
      description: 'Dashboard personnel'
    }
  ];

  fillCredentials(email: string): void {
    this.email.set(email);
    if (email === 'admin@isjcam.org') {
      this.password.set('admin123');
    } else {
      this.password.set('teacher123');
    }
  }

  onSubmit(): void {
    // Validation des champs
    const emailValue = this.email().trim();
    const passwordValue = this.password();

    if (!emailValue || !passwordValue) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      this.errorMessage.set('Veuillez entrer une adresse email valide');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(emailValue, passwordValue).subscribe({
      next: () => {
        // La redirection est gérée dans le service AuthService
        // Le loading sera arrêté après la redirection
      },
      error: (error) => {
        // Gestion des différents types d'erreurs
        let message = 'Une erreur est survenue lors de la connexion';
        
        if (error.error) {
          // Erreur de l'API backend
          if (error.error.message) {
            message = error.error.message;
          } else if (error.error.error) {
            message = error.error.error;
          } else if (typeof error.error === 'string') {
            message = error.error;
          }
        } else if (error.message) {
          // Erreur du service
          message = error.message;
        }

        // Messages spécifiques selon le code d'erreur HTTP
        if (error.status === 401) {
          message = 'Email ou mot de passe incorrect';
        } else if (error.status === 403) {
          message = 'Accès refusé. Votre compte peut être désactivé.';
        } else if (error.status === 0 || error.status === undefined) {
          message = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
        } else if (error.status >= 500) {
          message = 'Erreur serveur. Veuillez réessayer plus tard.';
        }

        this.errorMessage.set(message);
        this.isLoading.set(false);
      },
      complete: () => {
        // Le loading peut être arrêté ici si la redirection n'a pas encore eu lieu
        // Mais généralement, la redirection se fait dans next()
        this.isLoading.set(false);
      }
    });
  }
}
