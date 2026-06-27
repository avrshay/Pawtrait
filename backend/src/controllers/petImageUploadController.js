const fs = require("fs");
const path = require("path");
const { sendSuccess, sendError } = require("../middleware/errorHandler");

const clientsDir = path.join(__dirname, "..", "..", "models", "images", "clients");

const MIME_TO_EXT = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/bmp": "bmp",
  "image/svg+xml": "svg",
};

// POST /upload/pet-image — body: { dataUrl } (from file upload on the frontend).
// Decodes the base64 image, saves it as a real file under models/images/clients,
// and returns a normal URL string for petImageUrl.
function uploadPetImage(req, res) {
  const dataUrl = req.body && req.body.dataUrl != null ? String(req.body.dataUrl).trim() : "";
  if (!dataUrl) {
    return sendError(res, 400, "BAD_REQUEST", "dataUrl is required", { field: "dataUrl" });
  }

  const match = dataUrl.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  if (!match) {
    return sendError(res, 400, "BAD_REQUEST", "dataUrl must be a valid image data URL", {
      field: "dataUrl",
    });
  }

  const mime = match[1].toLowerCase();
  const ext = MIME_TO_EXT[mime];
  if (!ext) {
    return sendError(res, 400, "BAD_REQUEST", "Unsupported image type", { field: "dataUrl" });
  }

  const userId = req.headers["x-user-id"] || "guest";
  const fileName = `pet-user${userId}-${Date.now()}.${ext}`;
  const filePath = path.join(clientsDir, fileName);

  try {
    if (!fs.existsSync(clientsDir)) {
      fs.mkdirSync(clientsDir, { recursive: true });
    }
    fs.writeFileSync(filePath, Buffer.from(match[2], "base64"));
  } catch (err) {
    return sendError(res, 500, "INTERNAL_ERROR", "Could not save pet image", {
      message: err.message,
    });
  }

  const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
  const petImageUrl = `${backendUrl}/images/clients/${fileName}`;
  return sendSuccess(res, { petImageUrl }, 201);
}

module.exports = { uploadPetImage };
