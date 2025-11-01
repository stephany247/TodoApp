/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["app/**/*.{js,jsx,ts,tsx}", "components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  // darkMode: ['selector', '[data-mode="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        // josefin: ["JosefinSans_400Regular"],
        josefin: ["josefin_400"],
        "josefin-bold": ["josefin_700"],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "hsla(0, 0%, 100%, 1)",
        "strike-light": "hsla(233, 11%, 84%, 1)",
        "strike-dark": "hsla(233, 14%, 35%, 1)",
        "border-light": "hsla(236, 32%, 92%, 1)",
        "border-dark": "hsla(237, 14%, 26%, 1)",
        blue: "hsla(220, 98%, 61%, 1)",
        "button-dark": "hsla(235, 16%, 43%, 1)",
        "button-light": "hsla(235, 9%, 61%, 1)",
        "check-blue": "hsla(192, 100%, 67%, 1)",
        "check-purple": "hsla(280, 87%, 65%, 1)",
        "card-dark": "hsla(235, 24%, 19%, 1)",
        "card-light": "hsla(0, 0%, 100%, 1)",
        "bg-dark": "hsla(235, 21%, 11%, 1)",
        "bg-light": "hsla(0, 0%, 98%, 1)",
        "placeholder-light": "hsla(235, 9%, 61%, 1)",
        "placeholder-dark": "hsla(234, 11%, 52%, 1)",
        "text-dark": "hsla(235, 19%, 35%, 1)",
        "text-light": "hsla(234, 39%, 85%, 1)",
      },
    },
  },
  plugins: [],
};
