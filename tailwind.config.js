/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Atkinson Hyperlegible handles all body copy
        sans: ['Atkinson Hyperlegible', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        // Fraunces reserved for the sidebar nameplate
        heading: ['Fraunces', 'serif'],
      },
      fontSize: {
        // Custom heading scale used across typography utilities
        'heading-md': ['1.875rem', { lineHeight: '1.35' }], // 30px
        'heading-sm': ['1.5rem', { lineHeight: '1.4' }],   // 24px
        'heading-xs': ['1.25rem', { lineHeight: '1.45' }], // 20px
      },
      colors: {
        // vCard color palette from original CSS
        'jet': 'hsl(0, 0%, 22%)',
        'onyx': 'hsl(240, 1%, 17%)',
        'eerie-black-1': '#0b0b0b',
        'eerie-black-2': 'hsl(240, 2%, 12%)',
        'smoky-black': 'hsl(0, 0%, 7%)',
        'white-1': 'hsl(0, 0%, 100%)',
        'white-2': 'hsl(0, 0%, 98%)',
        'orange-yellow': 'hsl(45, 100%, 72%)',
        'vegas-gold': 'hsl(45, 54%, 58%)',
        'light-gray': 'hsl(0, 0%, 84%)',
        'light-gray-70': 'hsla(0, 0%, 84%, 0.7)',
        'bittersweet': 'hsl(0, 43%, 51%)',
      },
      backgroundImage: {
        'gradient-onyx': 'linear-gradient(to bottom right, hsl(240, 1%, 25%) 3%, hsl(0, 0%, 19%) 97%)',
        'gradient-jet': 'linear-gradient(to bottom right, hsla(240, 1%, 18%, 0.251) 0%, hsla(240, 2%, 11%, 0) 100%), hsl(240, 2%, 13%)',
        'gradient-yellow-1': 'linear-gradient(to bottom right, hsl(45, 100%, 71%) 0%, hsla(36, 100%, 69%, 0) 50%)',
        'gradient-yellow-2': 'linear-gradient(135deg, hsla(45, 100%, 71%, 0.251) 0%, hsla(35, 100%, 68%, 0) 59.86%), hsl(240, 2%, 13%)',
        'text-gradient-yellow': 'linear-gradient(to right, hsl(45, 100%, 72%), hsl(35, 100%, 68%))',
      },
      boxShadow: {
        'vcard-1': '-4px 8px 24px hsla(0, 0%, 0%, 0.25)',
        'vcard-2': '0 16px 30px hsla(0, 0%, 0%, 0.25)',
      },
      // Consistent spacing system
      spacing: {
        'section-lg': '4rem', // 64px - Large section spacing
        'section-md': '3rem', // 48px - Medium section spacing  
        'section-sm': '2rem', // 32px - Small section spacing
        'content-lg': '1.5rem', // 24px - Large content spacing
        'content-md': '1rem', // 16px - Medium content spacing
        'content-sm': '0.75rem', // 12px - Small content spacing
      },

    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
