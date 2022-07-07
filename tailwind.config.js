module.exports = {
    content: ["./src/**/*.njk", "./src/**/*.md"],
    theme: {
        extend: {
            fontFamily: {
                redaction: ["Redaction", "serif"],
                redaction20: ["Redaction20", "Redaction", "serif"],
                redaction70: ["Redaction70", "Redaction", "serif"],
                tte: ["TTE", "Courier New", "Courier", "monospace"],
                apfel: [
                    '"Apfel Grotezk"',
                    "Helvetica Neue",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                ],
                atkinson: [
                    "Atkinson Hyperlegible",
                    "system-ui", 
                    "-apple-system", 
                    "BlinkMacSystemFont",
                    '"Segoe UI"',
                    '"Ubuntu"',
                    '"Roboto"', 
                    '"Noto Sans"', 
                    '"Droid Sans"',
                    "sans-serif"
                ],
                dmmono: [
                    '"DM Mono"',
                    'ui-monospace', // San Francisco Mono on macOS and iOS
                    '"Cascadia Mono", "Segoe UI Mono"', // Newer Windows monospace fonts that are optionally installed. Most likely to be rendered in Consolas
                    '"Ubuntu Mono"', // Ubuntu
                    '"Roboto Mono"', // Chrome OS and Android
                    'Menlo', 'Monaco', 'Consolas', // A few sensible system font choices
                    'monospace' // The final fallback for rendering in monospace.
                ],
                piazzolla: [
                    'Piazzolla', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'
                ]
            },
            colors: {
                parchment: "#fff8ef",
                cocoa: {
                    50: "#fcfbf8",
                    100: "#faf0da",
                    200: "#f5d6b4",
                    300: "#e7ad81",
                    400: "#db7f53",
                    500: "#c75c33",
                    600: "#ab4221",
                    700: "#84311a",
                    800: "#5c2214",
                    900: "#3a150c",
                },
                lemon: {
                    50: "#faf9f4",
                    100: "#f7f0c4",
                    200: "#edde8b",
                    300: "#d3bb57",
                    400: "#ac9230",
                    500: "#8a7318",
                    600: "#6f5a10",
                    700: "#55430e",
                    800: "#3a2e0c",
                    900: "#261c09",
                },
                olive: {
                    50: "#f6f8f4",
                    100: "#ecf0e1",
                    200: "#d2e3bd",
                    300: "#a2c48a",
                    400: "#60a159",
                    500: "#458335",
                    600: "#386b25",
                    700: "#2e511f",
                    800: "#213719",
                    900: "#162213",
                },
                submarine: {
                    50: "#f1f7f6",
                    100: "#d8f0f4",
                    200: "#a9e4e6",
                    300: "#70c8c8",
                    400: "#34a8a2",
                    500: "#258b7d",
                    600: "#207262",
                    700: "#1d574d",
                    800: "#153b38",
                    900: "#0e2428",
                },
                cyan: {
                    50: "#f6f9fb",
                    100: "#e1f0fc",
                    200: "#c0dcf9",
                    300: "#94baf0",
                    400: "#6a93e4",
                    500: "#536fd9",
                    600: "#4453c8",
                    700: "#353ea6",
                    800: "#252a79",
                    900: "#151a4c",
                },
                coral: {
                    50: "#fcfbf9",
                    100: "#faf0e7",
                    200: "#f6d4cc",
                    300: "#e9a9a0",
                    400: "#e07a73",
                    500: "#cf564f",
                    600: "#b43c36",
                    700: "#8c2d28",
                    800: "#621f1c",
                    900: "#3c1310",
                },
            },
        },
    },
    plugins: [],
};
