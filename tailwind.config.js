module.exports = {
  content: ['./src/**/*.njk', './src/**/*.md',],
  theme: {
    extend: {
      fontFamily: {
        switzer: ["Switzer", "sans-serif"],
        redaction: ["Redaction", "serif"],
        redaction70: ["Redaction70", "Redaction", "serif"],
        tte: ["TTB", "Courier New", "Courier", "monospace"],
        tte: ["TTE", "Courier New", "Courier", "monospace"],
        computermoderntypewriter: ['"Computer Modern Typewriter"', "Courier New", "Courier", "monospace"]
      }
    },
  },
  plugins: [],
}
