# Optimize RECOMO App Design

  This is a code bundle for Optimize RECOMO App Design. The original project is available at https://www.figma.com/design/tEOnnJQ1iOZRXpMeKykS0O/Optimize-RECOMO-App-Design.

  ## One-command dev run

  A helper script will install deps (if missing) and start both backend (port 3001) and frontend (port 3000) bound to all interfaces.

  ```bash
  chmod +x run_dev.sh
  ./run_dev.sh
  ```

  Defaults:
  - API host: `192.168.100.100` (override `API_HOST`)
  - API port: `3001` (override `API_PORT`)
  - Frontend port: `3000` (override `VITE_PORT`)
  - Data dir: `/home/converge/data/RECOMO_App_Data` (override `DATA_DIR`)

  ## Manual run (optional)

  Frontend:
  ```bash
  npm install
  VITE_API_BASE_URL=http://192.168.100.100:3001 npm run dev -- --host 0.0.0.0 --port 3000
  ```

  Backend:
  ```bash
  cd server
  npm install
  PORT=3001 STORAGE_BASE_PATH=/home/converge/data/RECOMO_App_Data node index.js
  ```
