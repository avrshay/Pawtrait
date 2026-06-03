const path = require("path");

//server setup
const express = require("express");
const app = express();
const PORT= 3000
// Allow larger JSON bodies for pet image upload (base64); cart requests stay small (URL only).
app.use(express.json({ limit: "12mb" }));

// CORS: allow the React frontend to call this API.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-user-id, x-user-role");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

//Logger middleware to log the request and response
const logger = require("./middleware/logger");
app.use(logger);

const { sendSuccess } = require("./middleware/errorHandler");

app.get("/", (req, res) => {
  return sendSuccess(res, {
    message: "Welcome to Pawtrait API! The server is up and running.",
  });
});

app.use("/images", express.static(path.join(__dirname, "models", "images")));

const userRoutes     = require("./routes/users")
const orderRoutes = require("./routes/orders")
const cartRoutes = require("./routes/cart")
const authRoutes     = require("./routes/auth")
const galleryRoutes     = require("./routes/productsGallery.js")
const paymentRoutes = require("./routes/paymentRoutes")
const uploadRoutes = require("./routes/petImageUpload")

app.use("/users",     userRoutes)
app.use("/orders", orderRoutes)
app.use("/cart", cartRoutes)
app.use("/auth",     authRoutes)
app.use("/gallery",     galleryRoutes)
app.use("/payments", paymentRoutes)
app.use("/upload", uploadRoutes)

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("Could not start server:", err.message);
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other process (e.g. old node server) or change PORT.`);
  }
  process.exit(1);
});
