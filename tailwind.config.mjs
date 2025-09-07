/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        'car-red': 'hsl(var(--car-red))',
        'car-red-light': 'hsl(var(--car-red-light))',
        'car-red-dark': 'hsl(var(--car-red-dark))',
        'car-black': 'hsl(var(--car-black))',
        'car-gray': 'hsl(var(--car-gray))',
        'car-gray-light': 'hsl(var(--car-gray-light))',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
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
        "headlight-sweep": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        speedometer: {
          "0%": { transform: "translate(-50%, -100%) rotate(-35deg)" },
          "50%": { transform: "translate(-50%, -100%) rotate(35deg)" },
          "100%": { transform: "translate(-50%, -100%) rotate(-35deg)" },
        },
        "dashboard-blink": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        "particle-fall": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(60vh)" },
        },
        "neon-pulse": {
          "0%, 100%": { filter: "drop-shadow(0 0 0px rgba(255,255,255,0.0))" },
          "50%": { filter: "drop-shadow(0 0 16px rgba(255,255,255,0.25))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "headlight-sweep": "headlight-sweep 2.4s linear infinite",
        speedometer: "speedometer 2.2s ease-in-out infinite",
        "dashboard-blink": "dashboard-blink 1.2s ease-in-out infinite",
        "particle-fall": "particle-fall 4.5s linear infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
