module.exports = {
  "apps/web/**/*.{ts,tsx,js,jsx,mjs,cjs,json,css,md}": ["prettier --write"],
  "apps/api/**/*.py": ["apps/api/venv/bin/black"],
  "apps/api/**/*.md": ["prettier --write"],
};
