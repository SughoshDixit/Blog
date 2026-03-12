const { spacing, fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./Components/**/*.{js,ts,jsx,tsx}"],
  // darkMode: false, // or 'media' or 'class'
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Oracle Redwood Design System
        primary: "#C74634",
        secondary: "#E8572A",
        tertiary: "#F5E4D3",
        accent: "#0572CE",
        dark: "#201E1C",
        light: "#FAF8F6",
        redwood: {
          50: "#FDF3F1",
          100: "#FAE4DF",
          200: "#F5C4BB",
          300: "#EE9A8B",
          400: "#E46A57",
          500: "#C74634",
          600: "#A73A2C",
          700: "#8B2F24",
          800: "#73271E",
          900: "#60211A",
        },
      },
      boxShadow: {
        2: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      },
      fontFamily: {
        sans: ["DM Sans", "Inter", ...fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: "#161513",
            maxWidth: "none",
            a: {
              color: "#C74634",
              textDecoration: "none",
              "&:hover": {
                color: "#A73A2C",
                textDecoration: "underline",
              },
              code: { color: "#C74634" },
            },
            "h1, h2, h3, h4, h5, h6": {
              color: "#161513",
              fontWeight: "600",
              lineHeight: "1.2",
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
            "h2,h3,h4": {
              "scroll-margin-top": spacing[32],
            },
            p: {
              color: "#161513",
              marginTop: "1em",
              marginBottom: "1em",
            },
            strong: {
              color: "#161513",
              fontWeight: "700",
            },
            code: {
              color: "#161513",
              backgroundColor: "#F5EDE9",
              padding: "0.125rem 0.375rem",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
            pre: {
              color: "#161513",
              backgroundColor: "#F5EDE9",
            },
            blockquote: {
              color: "#6E6B68",
              borderLeftColor: "#C74634",
              "p:first-of-type::before": false,
              "p:last-of-type::after": false,
            },
            li: {
              color: "#161513",
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
            color: "#F5F4F2",
            a: {
              color: "#E8572A",
              "&:hover": {
                color: "#F07A56",
              },
              code: { color: "#E8572A" },
            },
            blockquote: {
              borderLeftColor: "#E8572A",
              color: "#B8B4B0",
            },
            "h2,h3,h4": {
              color: "#F5F4F2",
              "scroll-margin-top": spacing[32],
            },
            hr: { borderColor: "#3D3A36" },
            ol: {
              li: {
                "&:before": { color: "#B8B4B0" },
              },
            },
            ul: {
              li: {
                "&:before": { backgroundColor: "#B8B4B0" },
              },
            },
            strong: { color: "#F5F4F2" },
            thead: {
              color: "#F5F4F2",
            },
            tbody: {
              tr: {
                borderBottomColor: "#3D3A36",
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
