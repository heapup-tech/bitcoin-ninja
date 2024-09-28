import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1600px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'code-block-hide': {
          '0%': { opacity: '1', transform: 'translate(-50%,-50%)' },
          '20%': { opacity: '0', transform: 'translate(-50%,-50%) scale(.5)' },
          '80%': { opacity: '0', transform: 'translate(-50%,-50%) scale(.5)' },
          to: { opacity: '1', transform: 'translate(-50%,-50%) ' }
        },
        'code-block-show': {
          '0%': { opacity: '0', transform: 'translate(-50%,-50%) scale(.5)' },
          '20%': { opacity: '1', transform: 'translate(-50%,-50%)' },
          '60%': { opacity: '1', transform: 'translate(-50%,-50%)' },
          '80%': { opacity: '0', transform: 'translate(-50%,-50%) scale(.5)' },
          to: { opacity: '0', transform: 'translate(-50%,-50%) scale(.5)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'code-block-hide': 'code-block-hide 1.25s forwards',
        'code-block-show': 'code-block-show 1.25s .15s forwards'
      },
      gridTemplateColumns: {
        'auto-fill-40': 'repeat(auto-fill, 40px)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config

export default config
