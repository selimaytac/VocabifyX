module.exports = {
  extends: ["expo", "prettier", "plugin:react/recommended"],
  plugins: ["prettier", "simple-import-sort", "import"],
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": "error",
    "no-console": ["warn", { allow: ["warn", "error", "info", "debug"] }],
    "react/react-in-jsx-scope": "off",
    "react/no-array-index-key": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
  },
  ignorePatterns: [
    "expo-env.d.ts",
    "dist",
    "deno-scripts/**",
    "generated/**",
    "supabase/**",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};
