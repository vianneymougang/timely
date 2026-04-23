import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorEnvelopeSimpleFill } from '@ng-icons/phosphor-icons/fill';
import { NgmMotionDirective } from '@scripttype/ng-motion';
import { SCALE_IN, SPRING_DEFAULT } from '../../../core/animations/motion.variants';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIcon, NgmMotionDirective],
  providers: [provideIcons({ phosphorEnvelopeSimpleFill })],
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
})
export class VerifyCodeComponent implements OnInit {
  private router = inject(Router);

  email = signal('');
  code = signal(['', '', '', '', '', '']);
  errorMessage = signal('');
  successMessage = signal('');
  isVerifying = signal(false);
  codeStatus = signal<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');

  readonly SCALE_IN = SCALE_IN;
  readonly SPRING_DEFAULT = SPRING_DEFAULT;

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    if (state?.['email']) {
      this.email.set(state['email']);
    } else {
      this.router.navigate(['/auth/forgot-password']);
    }
  }

  onCodeInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value && !/^\d$/.test(value)) { input.value = ''; return; }
    if (value.length === 1 && index < 5) {
      (document.getElementById(`code-${index + 1}`) as HTMLInputElement)?.focus();
    }
    const newCode = [...this.code()];
    newCode[index] = value;
    this.code.set(newCode);
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
      if (!this.code()[index] && index > 0) {
        (document.getElementById(`code-${index - 1}`) as HTMLInputElement)?.focus();
        const newCode = [...this.code()];
        newCode[index - 1] = '';
        this.code.set(newCode);
      } else {
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
      digits.forEach((digit, i) => {
        const el = document.getElementById(`code-${i}`) as HTMLInputElement;
        if (el) el.value = digit;
      });
      (document.getElementById('code-5') as HTMLInputElement)?.focus();
      this.verifyCodeAutomatically(pastedData);
    }
  }

  verifyCodeAutomatically(fullCode: string): void {
    this.codeStatus.set('verifying');
    this.isVerifying.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    setTimeout(() => {
      if (fullCode === '123456') { this.handleValidCode(fullCode); }
      else { this.handleInvalidCode(); }
    }, 800);
  }

  handleValidCode(fullCode: string): void {
    this.codeStatus.set('valid');
    this.successMessage.set('Code valide');
    this.isVerifying.set(false);
    setTimeout(() => {
      this.router.navigate(['/auth/reset-password'], {
        state: { email: this.email(), code: fullCode },
      });
    }, 1500);
  }

  handleInvalidCode(): void {
    this.codeStatus.set('invalid');
    this.errorMessage.set('Code incorrect');
    this.isVerifying.set(false);
    setTimeout(() => this.clearCode(), 1500);
  }

  clearCode(): void {
    this.code.set(['', '', '', '', '', '']);
    this.codeStatus.set('idle');
    this.errorMessage.set('');
    this.successMessage.set('');
    for (let i = 0; i < 6; i++) {
      const el = document.getElementById(`code-${i}`) as HTMLInputElement;
      if (el) el.value = '';
    }
    (document.getElementById('code-0') as HTMLInputElement)?.focus();
  }

  resendCode(): void {
    this.clearCode();
    this.successMessage.set('Code renvoyé avec succès');
    setTimeout(() => this.successMessage.set(''), 3000);
  }
}
