# Maintainers Notes

- This project targets Node 18 and pins Vite to 5.4.x. If you see errors like "Vite requires Node 20.19+" or "crypto.hash is not a function", remove node_modules and package-lock.json then run `npm install`. The included npm-shrinkwrap.json ensures Vite 5 is selected.
- Dev server: `npm start` (binds to 0.0.0.0:3000).
- If CI or tooling upgrades Vite to 7 accidentally, run `npm run clean` and reinstall.
