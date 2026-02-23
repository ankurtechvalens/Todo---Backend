import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";
import { logger } from "./middleware/logger.middleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
app.use(cookieParser());

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(logger);


export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  message: {
    status: 429,
    message: "Too many requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);
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