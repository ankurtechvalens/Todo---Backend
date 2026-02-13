import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";
import { logger } from "./middleware/logger.middleware.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(logger);
// Routes
app.use("/api", routes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Todo API");
});

// Global Error Handler
app.use(errorMiddleware);

export default app;
