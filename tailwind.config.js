/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.35)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at top, rgba(16,185,129,0.18), transparent 45%), radial-gradient(circle at bottom, rgba(59,130,246,0.12), transparent 40%)',
      },
    },
  },
  plugins: [],
};
