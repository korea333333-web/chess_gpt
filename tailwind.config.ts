import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ebony: "#17120d",
        brass: "#b08d57",
        ivory: "#efe6d0"
      }
    }
  },
  plugins: []
};

export default config;
