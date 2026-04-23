import type { Variants, Transition } from '@scripttype/ng-motion';

export const SPRING_DEFAULT: Transition = { type: 'spring', stiffness: 280, damping: 24 };
export const SPRING_SOFT:    Transition = { type: 'spring', stiffness: 180, damping: 20 };
export const SPRING_SNAPPY:  Transition = { type: 'spring', stiffness: 400, damping: 28 };

export const FADE_UP:    Variants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
export const FADE_IN:    Variants = { hidden: { opacity: 0 },        visible: { opacity: 1 } };
export const SCALE_IN:   Variants = { hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1 } };
export const SLIDE_LEFT: Variants = { hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } };
export const LIST_ITEM:  Variants = { hidden: { opacity: 0, x: -8  }, visible: { opacity: 1, x: 0 } };
