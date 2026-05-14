const path = require("path");

//server setup
const express = require("express");
const app = express();
const PORT= 3000
app.use(express.json());

//Logger middleware to log the request and response
const logger = require("./middleware/logger");
app.use(logger);


app.get("/", (req, res) => {
  res.send("Welcome to Pawtrait API! The server is up and running.");
});

app.use("/models/images", express.static(path.join(__dirname, "models", "images")));

const userRoutes     = require("./routes/users")
const orderRoutes = require("./routes/orders")
const cartRoutes = require("./routes/cart")
const authRoutes     = require("./routes/auth")
const galleryRoutes     = require("./routes/productsGallery.js")
const aiRoutes     = require("./routes/ai")
const paymentRoutes = require("./routes/paymentRoutes")

app.use("/users",     userRoutes)
app.use("/orders", orderRoutes)
app.use("/cart", cartRoutes)
app.use("/auth",     authRoutes)
app.use("/gallery",     galleryRoutes)
app.use("/ai",     aiRoutes)
app.use("/payments", paymentRoutes)

const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler)
app.listen(PORT, () => {
  console.log("Server running on http://localhost:3000");
})
