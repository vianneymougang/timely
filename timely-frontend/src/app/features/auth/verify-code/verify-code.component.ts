import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent implements OnInit {
  private router = inject(Router);

  email = signal('');
  code = signal(['', '', '', '', '', '']); // 6 chiffres
  errorMessage = signal('');
  successMessage = signal('');
  isVerifying = signal(false);
  codeStatus = signal<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');

  ngOnInit(): void {
    // Récupérer l'email depuis l'état de navigation
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    if (state && state['email']) {
      this.email.set(state['email']);
    } else {
      // Si pas d'email, rediriger vers forgot-password
      this.router.navigate(['/auth/forgot-password']);
    }
  }

  onCodeInput(index: number, event: any): void {
    const value = event.target.value;

    // N'accepter que les chiffres
    if (value && !/^\d$/.test(value)) {
      event.target.value = '';
      return;
    }

    if (value.length === 1 && index < 5) {
      // Passer au champ suivant
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }

    // Mettre à jour le code
    const newCode = [...this.code()];
    newCode[index] = value;
    this.code.set(newCode);

    // Vérifier si le code est complet
    const fullCode = newCode.join('');
    if (fullCode.length === 6) {
      this.verifyCodeAutomatically(fullCode);
    } else {
      this.codeStatus.set('idle');
      this.errorMessage.set('');
      this.successMessage.set('');
    }
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      const currentInput = document.getElementById(`code-${index}`) as HTMLInputElement;

      if (!this.code()[index] && index > 0) {
        // Si le champ actuel est vide, revenir au champ précédent
        const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          // Effacer le champ précédent
          const newCode = [...this.code()];
          newCode[index - 1] = '';
          this.code.set(newCode);
        }
      } else {
        // Effacer le champ actuel
        const newCode = [...this.code()];
        newCode[index] = '';
        this.code.set(newCode);
      }

      this.codeStatus.set('idle');
      this.errorMessage.set('');
      this.successMessage.set('');
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');

    if (pastedData && /^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      this.code.set(digits);

      // Remplir tous les champs
      digits.forEach((digit, index) => {
        const input = document.getElementById(`code-${index}`) as HTMLInputElement;
        if (input) input.value = digit;
      });

      // Focus sur le dernier champ
      const lastInput = document.getElementById('code-5') as HTMLInputElement;
      if (lastInput) lastInput.focus();

      // Vérifier le code
      this.verifyCodeAutomatically(pastedData);
    }
  }

  verifyCodeAutomatically(fullCode: string): void {
    this.codeStatus.set('verifying');
    this.isVerifying.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // TODO: Remplacer par l'appel API réel
    // this.authService.checkResetCode(this.email(), fullCode).subscribe({
    //   next: (response) => {
    //     if (response.valid) {
    //       this.handleValidCode(fullCode);
    //     } else {
    //       this.handleInvalidCode();
    //     }
    //   },
    //   error: (error) => {
    //     this.handleInvalidCode();
    //   }
    // });

    // Simulation (À REMPLACER PAR L'APPEL API)
    setTimeout(() => {
      // Simuler une validation (code correct = "123456")
      if (fullCode === '123456') {
        this.handleValidCode(fullCode);
      } else {
        this.handleInvalidCode();
      }
    }, 800);
  }

  handleValidCode(fullCode: string): void {
    this.codeStatus.set('valid');
    this.successMessage.set('✓ Code valide');
    this.isVerifying.set(false);

    // Attendre 1.5 secondes puis rediriger automatiquement
    setTimeout(() => {
      this.router.navigate(['/auth/reset-password'], {
        state: { email: this.email(), code: fullCode }
      });
    }, 1500);
  }

  handleInvalidCode(): void {
    this.codeStatus.set('invalid');
    this.errorMessage.set('✗ Code incorrect');
    this.isVerifying.set(false);

    // Attendre 1.5 secondes puis effacer automatiquement
    setTimeout(() => {
      this.clearCodeAutomatically();
    }, 1500);
  }

  clearCodeAutomatically(): void {
    this.code.set(['', '', '', '', '', '']);
    this.codeStatus.set('idle');
    this.errorMessage.set('');
    this.successMessage.set('');

    // Effacer tous les champs
    for (let i = 0; i < 6; i++) {
      const input = document.getElementById(`code-${i}`) as HTMLInputElement;
      if (input) input.value = '';
    }

    // Focus sur le premier champ
    const firstInput = document.getElementById('code-0') as HTMLInputElement;
    if (firstInput) firstInput.focus();
  }

  resendCode(): void {
    // TODO: Appel API pour renvoyer le code
    // this.authService.resendResetCode(this.email()).subscribe(...)

    // Réinitialiser l'état
    this.clearCodeAutomatically();
    this.successMessage.set('✓ Code renvoyé avec succès !');

    // Effacer le message de succès après 3 secondes
    setTimeout(() => {
      this.successMessage.set('');
    }, 3000);
  }
}
