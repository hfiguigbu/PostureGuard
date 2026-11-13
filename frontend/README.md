# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## PostureGuard API

Set `VITE_API_URL` to the Flask server URL and `VITE_NODE_RED_URL` to the Node-RED server URL. Posture readings are requested from Node-RED's `/api/posturas`; user summaries (`/api/resumen_usuarios`) and alerts (`/api/alertas`) remain on Flask. In development, Vite proxies `/node-red` to Node-RED and removes that prefix, while its existing `/api` proxy continues to target Flask. The dashboard refreshes its data every five seconds.

For production builds, configure `VITE_NODE_RED_URL` to the reachable Node-RED URL; the development proxy is not included in the built frontend.

The API does not expose the user's configured maximum bad-posture duration. To show a progress percentage, set `VITE_MAX_BAD_POSTURE_SECONDS` to an explicit positive number of seconds before starting or building the frontend (for example, `600` for 10 minutes). Leave it empty when that value is unknown; the dashboard then shows the accumulated duration without inventing a limit or percentage. This frontend setting is not synchronized with the per-user value stored by the backend.

The alerts view displays records returned by `/api/alertas`; it does not send push or mobile notifications.
