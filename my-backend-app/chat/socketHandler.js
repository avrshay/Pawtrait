const { Server } = require("socket.io");

// AI replies are now served over REST (POST /chat/message); this socket layer
// only handles the live human-handoff channel between a client and a manager.
// roomId → { managerSocketId | null, history: [{role, content}] }
const chatRooms = {};

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    const role = socket.handshake.query.role; // "user" or "manager" or "admin"

    if (role === "manager" || role === "admin") {
      handleManager(socket, io);
    } else {
      handleClient(socket, io);
    }
  });
}

function handleManager(socket, io) {
  socket.join("manager_room");
  console.log(`Manager connected: ${socket.id}`);

  socket.on("handoff_accepted", ({ clientSocketId }) => {
    socket.join(clientSocketId);
    if (chatRooms[clientSocketId]) {
      chatRooms[clientSocketId].managerSocketId = socket.id;
    }
    io.to(clientSocketId).emit("handoff_accepted", { managerSocketId: socket.id });
    socket.emit("joined_room", { clientSocketId });
    console.log(`Manager ${socket.id} accepted handoff for room ${clientSocketId}`);
  });

  // Manager → Client: manager sends via sendMessage, client receives via receiveMessage
  socket.on("sendMessage", ({ clientSocketId, text }) => {
    if (chatRooms[clientSocketId]) {
      chatRooms[clientSocketId].history.push({ role: "assistant", content: text });
    }
    io.to(clientSocketId).emit("receiveMessage", { from: "manager", text });
  });

  socket.on("typing", ({ clientSocketId, isTyping }) => {
    io.to(clientSocketId).emit("typing", { isTyping });
  });

  socket.on("disconnect", () => {
    console.log(`Manager disconnected: ${socket.id}`);
  });
}

async function handleClient(socket, io) {
  console.log(`Client connected: ${socket.id}`);
  chatRooms[socket.id] = { managerSocketId: null, history: [] };
  socket.join(socket.id);

  // Client → Server: once a manager has accepted the handoff, messages are
  // relayed live over this socket. AI replies go through the REST endpoint instead.
  socket.on("sendMessage", ({ text }) => {
    const room = chatRooms[socket.id];
    if (!room || !room.managerSocketId) return;

    room.history.push({ role: "user", content: text });
    io.to("manager_room").emit("receiveMessage", { clientSocketId: socket.id, from: "user", text });
  });

  socket.on("human_handoff", ({ userName, history } = {}) => {
    if (Array.isArray(history)) {
      chatRooms[socket.id].history = history;
    }
    io.to("manager_room").emit("human_handoff", {
      clientSocketId: socket.id,
      userName: userName || "Guest",
      history: chatRooms[socket.id]?.history ?? [],
    });
    socket.emit("receiveMessage", { from: "bot", text: "Connecting you to a the manager... please hold on 🐾" });
    console.log(`Manager was requested by client ${socket.id}`);
  });

  socket.on("disconnect", () => {
    delete chatRooms[socket.id];
    io.to("manager_room").emit("client_disconnected", { clientSocketId: socket.id });
    console.log(`Client disconnected: ${socket.id}`);
  });
}

module.exports = { initSocket };
