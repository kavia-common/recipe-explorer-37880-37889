# Recipe Frontend - Tizen Web (Vite 5 / Node 18 compatible)

This app is a modern, responsive SPA for browsing recipes using the Ocean Professional theme.

- Dev server: npm run dev (Vite, port 3000)
- Build: npm run build
- Tizen package: npm run package:tizen

Notes:
- The project is pinned to Vite 5.x to support Node 18 environments. A npm-shrinkwrap.json is included to ensure correct versions in CI.
- If you encounter engine errors about Node >=20, remove node_modules and reinstall to ensure Vite 5 is used.
