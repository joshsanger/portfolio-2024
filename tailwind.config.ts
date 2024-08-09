import type {Config} from 'tailwindcss';

import {
  animation,
  backgroundImage,
  borderRadius,
  boxShadow,
  colors,
  fontFamily,
  fontSize,
  keyframes,
  maxWidth,
  minWidth,
  minHeight,
  screens,
  spacing,
  transitionTimingFunction,
} from './app/styles/tailwindOverrides';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation,
      backgroundImage,
      borderRadius,
      boxShadow,
      colors,
      fontFamily,
      fontSize,
      keyframes,
      maxWidth,
      minWidth,
      minHeight,
      screens,
      spacing,
      transitionTimingFunction,
    },
  },
  plugins: [],
} satisfies Config;
