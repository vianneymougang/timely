import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { AuthService } from '../../../core/services/auth.service';
import { FADE_UP, SCALE_IN, SPRING_DEFAULT, SPRING_SOFT } from '../../../core/animations/motion.variants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputText, Button, NgmMotionDirective],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private authService = inject(AuthService);

  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  readonly FADE_UP = FADE_UP;
  readonly SCALE_IN = SCALE_IN;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;
  readonly SPRING_SOFT = SPRING_SOFT;

  quickAccess = [
    { label: 'Admin', email: 'admin@isjcam.org', password: 'admin123' },
    { label: 'Enseignant', email: 'arthur.pessah@isjcam.org', password: 'teacher123' },
  ];

  fillCredentials(item: { email: string; password: string }): void {
    this.email.set(item.email);
    this.password.set(item.password);
  }

  onSubmit(): void {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.authService.login(this.email(), this.password()).subscribe({
      next: () => {},
      error: (error) => {
        this.errorMessage.set(error.message || 'Email ou mot de passe incorrect');
        this.isLoading.set(false);
      },
      complete: () => { this.isLoading.set(false); },
    });
  }
}
