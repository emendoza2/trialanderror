module.exports = {
  content: ['./src/**/*.njk', './src/**/*.md',],
  theme: {
    extend: {
      fontFamily: {
        switzer: ["Switzer", "sans-serif"],
        redaction: ["Redaction", "serif"],
        redaction70: ["Redaction70", "Redaction", "serif"],
        tte: ["TTB", "monospace"],
        tte: ["TTE", "monospace"],
        computermoderntypewriter: ['"Computer Modern Typewriter"', "monospace"]
      }
    },
  },
  plugins: [],
}
