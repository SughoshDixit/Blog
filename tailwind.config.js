const { spacing, fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./Components/**/*.{js,ts,jsx,tsx}"],
  // darkMode: false, // or 'media' or 'class'
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
        tertiary: "#FFE66D",
        accent: "#FFB677",
        dark: "#2B2D42",
        light: "#EDF2F4",
      },
      boxShadow: {
        2: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: "#242424",
            maxWidth: "none",
            a: {
              color: "#1a8917",
              textDecoration: "none",
              "&:hover": {
                color: "#0f730c",
                textDecoration: "underline",
              },
              code: { color: "#1a8917" },
            },
            "h1, h2, h3, h4, h5, h6": {
              color: "#191919",
              fontWeight: "600",
              lineHeight: "1.2",
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
            "h2,h3,h4": {
              "scroll-margin-top": spacing[32],
            },
            p: {
              color: "#242424",
              marginTop: "1em",
              marginBottom: "1em",
            },
            strong: {
              color: "#191919",
              fontWeight: "700",
            },
            code: { 
              color: "#191919",
              backgroundColor: "#f3f4f6",
              padding: "0.125rem 0.375rem",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
            pre: {
              color: "#191919",
              backgroundColor: "#f3f4f6",
            },
            blockquote: {
              color: "#4b5563",
              borderLeftColor: "#d1d5db",
              "p:first-of-type::before": false,
              "p:last-of-type::after": false,
            },
            li: {
              color: "#242424",
            },
            img: {
              display: "block",
              maxWidth: "100%",
              height: "auto",
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
              marginLeft: "auto",
              marginRight: "auto",
              opacity: "1",
              visibility: "visible",
            },
          },
        },
        dark: {
          css: {
            color: theme("colors.light"),
            a: {
              color: theme("colors.primary"),
              "&:hover": {
                color: theme("colors.primary"),
              },
              code: { color: theme("colors.primary") },
            },
            blockquote: {
              borderLeftColor: theme("colors.gray.700"),
              color: theme("colors.gray.300"),
            },
            "h2,h3,h4": {
              color: theme("colors.gray.100"),
              "scroll-margin-top": spacing[32],
            },
            hr: { borderColor: theme("colors.gray.700") },
            ol: {
              li: {
                "&:before": { color: theme("colors.gray.500") },
              },
            },
            ul: {
              li: {
                "&:before": { backgroundColor: theme("colors.gray.500") },
              },
            },
            strong: { color: theme("colors.light") },
            thead: {
              color: theme("colors.light"),
            },
            tbody: {
              tr: {
                borderBottomColor: theme("colors.gray.700"),
              },
            },
            img: {
              display: "block",
              maxWidth: "100%",
              height: "auto",
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
              marginLeft: "auto",
              marginRight: "auto",
              opacity: "1",
              visibility: "visible",
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      typography: ["dark"],
      boxShadow: ["dark"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
