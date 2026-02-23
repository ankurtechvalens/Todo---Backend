import app from "./app.js";
import dotenv from 'dotenv'

dotenv.config();

import { prisma } from "./config/prisma.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
}

startServer();