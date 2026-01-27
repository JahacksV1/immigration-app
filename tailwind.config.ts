import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        'background-elevated': '#0f0f0f',
        foreground: '#fafafa',
        'foreground-muted': '#a1a1aa',
        card: '#18181b',
        'card-hover': '#27272a',
        border: '#27272a',
        'border-light': '#3f3f46',
        accent: {
          purple: '#a855f7',
          'purple-hover': '#9333ea',
          'purple-glow': '#c084fc',
          green: '#10b981',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 10px 20px -5px rgba(168, 85, 247, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
        'card-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        glow: '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.1)',
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '6px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};

export default config;
