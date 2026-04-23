import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { withViewTransitions } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideMotionConfig, provideMotionFeatures, ngmAllFeatures } from '@scripttype/ng-motion';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { TimelyPreset } from './core/theme/timely-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: TimelyPreset,
        options: { darkModeSelector: '.app-dark', cssLayer: false },
      },
      ripple: true,
    }),
    provideMotionConfig({
      transition: { type: 'spring', stiffness: 280, damping: 24 },
      reducedMotion: 'user',
    }),
    provideMotionFeatures(ngmAllFeatures),
  ],
};
