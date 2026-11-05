export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    fontFamily: { sans: ['"Outfit"', 'system-ui', 'sans-serif'] },
    colors: { ink: '#0b2329', brand: '#2146d6', sun: '#ffb400', soft: '#eef6f1', chalk: '#10303a', deep: '#0b2329' },
    keyframes: {
      marquee: { to: { transform: 'translateX(-50%)' } },
      float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
      spin360: { to: { transform: 'rotate(360deg)' } },
      pop: { '0%': { opacity: 0, transform: 'scale(.9) translateY(8px)' }, '100%': { opacity: 1, transform: 'none' } },
    },
    animation: { marquee: 'marquee 30s linear infinite', float: 'float 4s ease-in-out infinite',
      slow: 'spin360 24s linear infinite', pop: 'pop .25s ease-out' },
  } },
  plugins: [],
}
