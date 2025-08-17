import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/.prisma/**", 
      "**/prisma/generated/**",
      "**/.next/**",
      "**/dist/**", 
      "**/build/**",
      "**/*.min.js",
      "**/*.bundle.js",
      "**/src/generated/**",
    ]
  },
  
  // Apply Next.js rules (this handles TypeScript parsing automatically)
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Additional configuration
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Relax strict rules for development
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn", 
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
    },
  },
];

export default eslintConfig;