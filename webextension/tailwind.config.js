/** @type {import('tailwindcss').Config} */
const rootConfig = require('../tailwind.config.ts')

module.exports = {
  darkMode: rootConfig.darkMode,
  content: [
    '../app/**/*.{js,ts,jsx,tsx,mdx}',
    '../components/**/*.{js,ts,jsx,tsx,mdx}',
    './newtab/**/*.{js,ts,jsx,tsx}',
  ],
  theme: rootConfig.theme,
  plugins: rootConfig.plugins || [],
}
