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
    },
  },
  plugins: [],
} satisfies Config;
