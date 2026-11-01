/**
 * Tailwind CSS configuration for Jalal Ahmmed's academic website.
 *
 * Only needed if you want to change the design and rebuild the CSS.
 * The compiled file (assets/css/style.css) is already included, so the
 * site works on GitHub Pages without running any build step.
 *
 * Rebuild:  npm install  &&  npm run build
 */
module.exports = {
  // Dark mode is switched by adding the "dark" class to <html> (see assets/js/main.js)
  darkMode: 'class',

  // Files Tailwind scans for class names
  content: ['./index.html', './404.html', './assets/js/**/*.js'],

  theme: {
    extend: {
      colors: {
        // Light theme
        ink: '#13203A',      // headings and main text (deep navy)
        paper: '#F5F7FA',    // page background (cool off-white)
        slate: '#5B6678',    // secondary text
        line: '#DCE2EA',     // borders and dividers
        teal: {
          DEFAULT: '#157A6E', // links and accents (AA contrast on white)
          bright: '#3CC5B2',  // accent on dark backgrounds
        },
        heat: '#F2C14E',     // saliency-map highlight (used sparingly)
        // Dark theme
        night: {
          DEFAULT: '#0D1526', // page background
          2: '#142038',       // raised surfaces
          3: '#1F2D4B',       // borders
        },
        mist: '#E7EBF2',     // main text on dark
        fog: '#A9B3C4',      // secondary text on dark
      },
      fontFamily: {
        serif: ['Newsreader', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['"Public Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
