/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // ブランドカラー（青系）
        secondary: '#10B981', // 補助色（緑系）
        accent: '#F59E0B', // アクセント色（オレンジ系）
        dark: '#1F2937', // 暗い色
        light: '#F9FAFB', // 明るい色
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 