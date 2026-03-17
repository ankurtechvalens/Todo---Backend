  import app from "./app.js";
  import dotenv from "dotenv";
  import http from "http";
  import { Server } from "socket.io";
  import { prisma } from "./config/prisma.js";
import { sequelize } from "./config/databseconfigSq.js";

  dotenv.config();

  const PORT = process.env.PORT || 3000;

  // 🔥 Create HTTP server manually
  const server = http.createServer(app);

  // 🔥 Attach Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "*", // change in production
    },
  });

  // 🔥 WebSocket connection handler
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // User joins personal room
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  // Export io so services can emit events
  export { io };
  
  async function startServer() {
    try {
      await prisma.$connect();
      console.log("Database connected");

      server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });

    } catch (error) {
      console.error("Server failed to start", error);
      process.exit(1);
    }
    try {
  await sequelize.authenticate();
  console.log("✅ DB connected successfully- using sequelize");
} catch (error) {
  console.error("❌ Connection error:", error);
}
  }

  startServer();