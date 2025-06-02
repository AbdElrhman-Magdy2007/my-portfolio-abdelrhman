// import type { Config } from "tailwindcss";

// const config: Config = {
//   darkMode: "class",
//   content: [
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//     "./my-app/src/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}", // Added to include app/ directory
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: '2rem',
//       screens: {
//         '2xl': '1400px',
//       },
//     },
//     extend: {
//       fontFamily: {
//         sans: ['var(--font-inter)'],
//         heading: ['var(--font-poppins)'],
//         arabic: ['Noto Sans Arabic', 'sans-serif'],
//       },
//       colors: {
//         // Custom colors from first theme.extend
//         primary: '#3b82f6',
//         secondary: '#ec4899',
//         'blue-900': '#1e3a8a',
//         'indigo-800': '#3730a3',
//         'purple-900': '#4c1d95',
//         'emerald-900': '#064e3b',
//         'teal-800': '#115e59',
//         'cyan-900': '#164e63',
//         'rose-900': '#4a044e',
//         'red-800': '#991b1b',
//         'amber-900': '#78350f',
//         // Colors from second theme.extend
//         border: 'hsl(var(--border))',
//         input: 'hsl(var(--input))',
//         ring: 'hsl(var(--ring))',
//         background: 'hsl(var(--background))',
//         foreground: 'hsl(var(--foreground))',
//         primary: {
//           DEFAULT: 'hsl(var(--primary))',
//           foreground: 'hsl(var(--primary-foreground))',
//         },
//         secondary: {
//           DEFAULT: 'hsl(var(--secondary))',
//           foreground: 'hsl(var(--secondary-foreground))',
//         },
//         destructive: {
//           DEFAULT: 'hsl(var(--destructive))',
//           foreground: 'hsl(var(--destructive-foreground))',
//         },
//         muted: {
//           DEFAULT: 'hsl(var(--muted))',
//           foreground: 'hsl(var(--muted-foreground))',
//         },
//         accent: {
//           DEFAULT: 'hsl(var(--accent))',
//           foreground: 'hsl(var(--accent-foreground))',
//         },
//         popover: {
//           DEFAULT: 'hsl(var(--popover))',
//           foreground: 'hsl(var(--popover-foreground))',
//         },
//         card: {
//           DEFAULT: 'hsl(var(--card))',
//           foreground: 'hsl(var(--card-foreground))',
//         },
//         slate: {
//           50: '#F8FAFC',
//           100: '#F1F5F9',
//           200: '#E2E8F0',
//           300: '#CBD5E1',
//           400: '#94A3B8',
//           500: '#64748B',
//           600: '#475569',
//           700: '#334155',
//           800: '#1E293B',
//           900: '#0F172A',
//         },
//         blue: {
//           500: '#3B82F6',
//           600: '#2563EB',
//         },
//         emerald: {
//           500: '#10B981',
//           600: '#059669',
//         },
//         red: {
//           500: '#EF4444',
//           600: '#DC2626',
//         },
//       },
//       borderRadius: {
//         lg: 'var(--radius)',
//         md: 'calc(var(--radius) - 2px)',
//         sm: 'calc(var(--radius) - 4px)',
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: '0' },
//           to: { height: 'var(--radix-accordion-content-height)' },
//         },
//         "accordion-up": {
//           from: { height: 'var(--radix-accordion-content-height)' },
//           to: { height: '0' },
//         },
//         "fade-in": {
//           "0%": { opacity: "0", transform: "translateY(10px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         "slide-in": {
//           "0%": { opacity: "0", transform: "translateY(-20px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         "slide-in-right": {
//           "0%": { transform: "translateX(100%)" },
//           "100%": { transform: "translateX(0)" },
//         },
//         "scale-in": {
//           "0%": { opacity: "0", transform: "scale(0.95)" },
//           "100%": { opacity: "1", transform: "scale(1)" },
//         },
//         "pulse": {
//           "0%, 100%": { opacity: "1" },
//           "50%": { opacity: "0.8" },
//         },
//         "float": {
//           "0%, 100%": { transform: "translateY(0)" },
//           "50%": { transform: "translateY(-10px)" },
//         },
//         "glow": {
//           "0%, 100%": { filter: "drop-shadow(0 0 2px rgba(99, 102, 241, 0.8))" },
//           "50%": { filter: "drop-shadow(0 0 5px rgba(99, 102, 241, 1))" },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//         "fade-in": "fade-in 0.7s ease-out",
//         "slide-in": "slide-in 0.5s ease-out",
//         "slide-in-right": "slide-in-right 0.3s ease-out",
//         "scale-in": "scale-in 0.4s ease-out",
//         "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
//         "float": "float 3s ease-in-out infinite",
//         "glow": "glow 2s ease-in-out infinite",
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate")],
// };

// export default config;




import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./my-app/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-poppins)"],
        arabic: ["Noto Sans Arabic", "sans-serif"],
      },
      colors: {
        // ألوان الوضع الفاتح والليلي باستخدام متغيرات HSL
        border: {
          DEFAULT: "hsl(var(--border))",
          dark: "hsl(215 19% 35%)", // slate-600
        },
        input: {
          DEFAULT: "hsl(var(--input))",
          dark: "hsl(215 19% 35%)", // slate-600
        },
        ring: {
          DEFAULT: "hsl(var(--ring))",
          dark: "hsl(217 91% 60%)", // blue-500
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          dark: "hsl(222 47% 11.2%)", // slate-900
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          dark: "hsl(210 40% 98%)", // slate-100
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / 1)", // blue-600 (#2563EB) للوضع الفاتح
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(217 91% 60%)", // blue-500 (#3B82F6) للوضع الليلي
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / 1)", // emerald-600 (#059669) للوضع الفاتح
          foreground: "hsl(var(--secondary-foreground))",
          dark: "hsl(160 84% 39%)", // emerald-500 (#10B981) للوضع الليلي
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          dark: "hsl(0 84.2% 60.2%)", // red-500 (#EF4444)
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          dark: "hsl(215 19% 35%)", // slate-600
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          dark: "hsl(215 19% 35%)", // slate-600
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
          dark: "hsl(217 33% 17.5%)", // slate-800
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          dark: "hsl(217 33% 17.5%)", // slate-800
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        blue: {
          500: "#3B82F6",
          600: "#2563EB",
        },
        emerald: {
          500: "#10B981",
          600: "#059669",
        },
        red: {
          500: "#EF4444",
          600: "#DC2626",
        },
        // الألوان الإضافية من الإعدادات الأولى
        "blue-900": "#1e3a8a",
        "indigo-800": "#3730a3",
        "purple-900": "#4c1d95",
        "emerald-900": "#064e3b",
        "teal-800": "#115e59",
        "cyan-900": "#164e63",
        "rose-900": "#4a044e",
        "red-800": "#991b1b",
        "amber-900": "#78350f",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 3px hsl(var(--primary)/0.6))" },
          "50%": { filter: "drop-shadow(0 0 6px hsl(var(--primary)/0.8))" },
        },
        "logo-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "sparkle": {
          "0%, 100%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1)", opacity: "0.9" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.7s ease-out",
        "slide-in": "slide-in 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3.5s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "logo-spin": "logo-spin 20s linear infinite",
        "sparkle": "sparkle 0.7s forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;