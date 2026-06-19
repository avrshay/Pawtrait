const path = require("path");
const http = require("http");
const express = require("express");

//for the AI chat agent
const { initSocket } = require("./chat/socketHandler");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "12mb" }));

const logger = require("./middleware/logger");
app.use(logger);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-user-id, x-user-role");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const { sendSuccess } = require("./middleware/errorHandler");

app.get("/", (req, res) => {
  return sendSuccess(res, { message: "Welcome to Pawtrait API! The server is up and running." });
});

app.use("/images", express.static(path.join(__dirname, "models", "images")));

app.use("/users",    require("./routes/users"));
app.use("/orders",   require("./routes/orders"));
app.use("/cart",     require("./routes/cart"));
app.use("/auth",     require("./routes/auth"));
app.use("/gallery",  require("./routes/productsGallery.js"));
app.use("/payments", require("./routes/paymentRoutes"));
app.use("/upload",   require("./routes/petImageUpload"));
app.use("/chat",     require("./routes/chat"));

//create HTTP server and initialize Socket.IO for AI chat agent:
const server = http.createServer(app);
initSocket(server); // Initialize Socket.IO for AI chat agent

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("Could not start server:", err.message);
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  }
  process.exit(1);
});
