const path = require("path");

//server setup
const express = require("express");
const app = express();
const PORT= 3000
app.use(express.json());

//Logger middleware to log the request and response
const logger = require("./middleware/logger");
app.use(logger);

const { sendSuccess } = require("./middleware/errorHandler");

app.get("/", (req, res) => {
  return sendSuccess(res, {
    message: "Welcome to Pawtrait API! The server is up and running.",
  });
});

app.use("/models/images", express.static(path.join(__dirname, "models", "images")));

const userRoutes     = require("./routes/users")
const orderRoutes = require("./routes/orders")
const cartRoutes = require("./routes/cart")
const authRoutes     = require("./routes/auth")
const galleryRoutes     = require("./routes/productsGallery.js")
const paymentRoutes = require("./routes/paymentRoutes")

app.use("/users",     userRoutes)
app.use("/orders", orderRoutes)
app.use("/cart", cartRoutes)
app.use("/auth",     authRoutes)
app.use("/gallery",     galleryRoutes)
app.use("/payments", paymentRoutes)

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
