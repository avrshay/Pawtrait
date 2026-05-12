const path = require("path");
const express = require("express");
const logger = require("./middleware/logger");
const app = express();
const PORT= 3000
app.use(express.json());
app.use(logger);
app.use("/images", express.static(path.join(__dirname, "models", "images")));

const userRoutes     = require("./routes/users")
const orderRoutes = require("./routes/orders")
const authRoutes     = require("./routes/auth")
const galleryRoutes     = require("./routes/productsGallery.js")
const aiRoutes     = require("./routes/ai")
const adminRoutes     = require("./routes/admin")

app.use("/users",     userRoutes)
app.use("/orders", orderRoutes)
app.use("/auth",     authRoutes)
app.use("/gallery",     galleryRoutes)
app.use("/ai",     aiRoutes)
app.use("/admin",     adminRoutes)

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler)
app.listen(PORT, () => {
  console.log("Server running on http://localhost:3000");
})
