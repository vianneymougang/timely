import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.email(), this.password()).subscribe({
      next: () => {
        // La redirection est gérée dans le service
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Email ou mot de passe incorrect');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
