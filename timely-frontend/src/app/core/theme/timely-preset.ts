import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const TimelyPreset = definePreset(Aura, {
  primitive: {
    indigo: {
      50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
      400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
      800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
    },
  },
  semantic: {
    primary: {
      50: '{indigo.50}', 100: '{indigo.100}', 200: '{indigo.200}',
      300: '{indigo.300}', 400: '{indigo.400}', 500: '{indigo.500}',
      600: '{indigo.600}', 700: '{indigo.700}', 800: '{indigo.800}',
      900: '{indigo.900}', 950: '{indigo.950}',
    },
    focusRing: { width: '2px', style: 'solid', color: '{primary.500}', offset: '2px' },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb',
          300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563',
          700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712',
        },
      },
    },
  },
  components: {
    button:    { root: { borderRadius: '8px' } },
    inputtext: { root: { borderRadius: '8px', paddingX: '0.75rem', paddingY: '0.5625rem' } },
    card:      { root: { borderRadius: '12px', shadow: '0 2px 8px rgba(17,24,39,0.06)' } },
    datatable: { headerCell: { padding: '0.75rem 1rem' } },
    select:    { root: { borderRadius: '8px' } },
  },
});
