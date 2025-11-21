// server.js
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
app.use(cors());

// === Configurar __dirname en ES Modules ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Crear carpeta uploads si no existe ===
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// === Servir archivos estáticos ===
app.use("/uploads", express.static(uploadDir));

// === Configuración de multer ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // hasta 50MB
});

// === Endpoint de subida de imágenes ===
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });
  res.json({ url: `http://localhost:5000/uploads/${req.file.filename}` });
});

// === Nuevos endpoints para guardar/cargar el diagrama ===
const diagramFile = path.join(__dirname, "diagram.json");

// Guardar diagrama
app.post("/save-diagram", express.json(), (req, res) => {
  try {
    fs.writeFileSync(diagramFile, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("Error guardando diagrama:", err);
    res.status(500).json({ error: "No se pudo guardar el diagrama" });
  }
});

// Cargar diagrama
app.get("/load-diagram", (req, res) => {
  try {
    if (fs.existsSync(diagramFile)) {
      const data = fs.readFileSync(diagramFile, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.json({ nodes: [], edges: [] }); // si no existe, devolvemos vacío
    }
  } catch (err) {
    console.error("Error cargando diagrama:", err);
    res.status(500).json({ error: "No se pudo cargar el diagrama" });
  }
});

// === Iniciar servidor ===
app.listen(5000, () => console.log("Servidor corriendo en puerto 5000"));
