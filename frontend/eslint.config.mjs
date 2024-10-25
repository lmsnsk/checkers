import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import("eslint").Linter.Config} */
export default tseslint.config(
  pluginJs.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["**/node_modules/", ".git/", "**/*.config.*"],
  },

  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  }
  // { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  // ...tseslint.configs.recommended,
  // pluginReact.configs.flat.recommended,
);

