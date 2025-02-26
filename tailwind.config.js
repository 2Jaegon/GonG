/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",  // ✅ src 폴더 내 모든 JS/TS/JSX/TSX 파일
    "./pages/**/*.{js,ts,jsx,tsx}", // ✅ pages 폴더 내 모든 JS/TS/JSX/TSX 파일
    "./components/**/*.{js,ts,jsx,tsx}", // ✅ components 폴더 내 모든 JS/TS/JSX/TSX 파일
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
