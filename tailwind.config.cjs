module.exports = {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      screens: {
         "3xs": "411px", // Große Smartphones
         "2xs": "480px", // Monster-Smartphones
         xs: "540px",
         sm: "640px",
         md: "768px",
         lg: "1024px",
         xl: "1280px",
         "2xl": "1536px"
      },
      extend: {
         fontSize: {
            "2xs": ["0.65rem", { lineHeight: "0.9rem" }],
            "3xs": ["0.575rem", { lineHeight: "0.8rem" }],
            "4xs": ["0.5rem", { lineHeight: "0.7rem" }]
         }
      }
   },
   plugins: [require("@tailwindcss/forms")]
};
