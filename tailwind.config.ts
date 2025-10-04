import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4338CA',
          foreground: '#ffffff'
        },
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#e11d48'
      }
    }
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: []
};

export default config;
