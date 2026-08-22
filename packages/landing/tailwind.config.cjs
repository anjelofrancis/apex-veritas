/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg-background)',
        surface: 'var(--color-bg-surface)',
        divider: 'var(--color-border-divider)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        amber: {
          DEFAULT: 'var(--color-amber)',
          grad1: 'var(--color-amber-grad1)',
          grad2: 'var(--color-amber-grad2)',
        },
        teal: {
          DEFAULT: 'var(--color-teal)',
          grad: 'var(--color-teal-grad)',
        },
        oxide: 'var(--color-oxide)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(20, 184, 166, 0.15) 0px, transparent 50%)',
        'gradient-amber': 'linear-gradient(135deg, #F59E0B, #EF4444)',
        'gradient-teal': 'linear-gradient(135deg, #14B8A6, #06B6D4)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.8))' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
      },
    },
  },
  plugins: [],
};
