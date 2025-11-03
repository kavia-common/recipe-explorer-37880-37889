# Recipe Frontend - Tizen Web (Vite 5 / Node 18 compatible)

This app is a modern, responsive SPA for browsing recipes using the Ocean Professional theme.

- Dev server: npm start or npm run dev (Vite, port 3000 on 0.0.0.0). In CI lint/init, production build is skipped; runtime preview uses the dev server.
- Build: npm run build
- Tizen package: npm run package:tizen

Notes:
- The project targets Node 18 and pins Vite 5.4.x. If you see Node >=20 engine messages or "crypto.hash is not a function", remove node_modules and package-lock.json, then run npm install to restore Vite 5.x using the provided shrinkwrap.

Troubleshooting:
- Port not ready: ensure no other service is using 3000. The server is configured with strictPort and host 0.0.0.0 in vite.config.js.
- Wrong Vite version: run `npm run clean` then `npm install`.
