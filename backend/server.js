// Packages NPM
import express from "express";
import cors from "cors";
import morgan from "morgan";

// Modules natifs
import path from "path";
import { fileURLToPath } from "url";

// Modules locaux
import router from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5253; // Port différent pour éviter les conflits

app.use(morgan("short"));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

// Middleware pour corriger le Content-Type
app.use((req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('json')) {
    req.headers['content-type'] = 'application/json';
  }
  // Si le Content-Type est text/plain mais que le body semble être du JSON (pour POST et PUT)
  if (req.headers['content-type'] === 'text/plain;charset=UTF-8' && (req.method === 'POST' || req.method === 'PUT')) {
    req.headers['content-type'] = 'application/json';
  }
  next();
});

// Configuration plus permissive pour express.json()
app.use(express.json({
  type: ['application/json', 'application/json;', 'application/json; charset=utf-8', 'text/plain'],
  limit: '10mb'
}));

app.use(express.urlencoded({ extended: true }));

app.use(router);

// Middleware de gestion des erreurs - doit être après les routes
app.use(errorHandler);

app.listen(PORT, () => console.log(`Montres API Server is on http://localhost:${PORT}`));
