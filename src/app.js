import express from "express";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware.js";
import { logger } from "./middleware/logger.middleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routesv1 from "./routes/v1/index.js";
import routesv2 from "./routes/v2/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();
app.use(cookieParser());

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://todo-app-a4277.web.app"
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
app.use("/api/v1", routesv1);
app.use("/api/v2", routesv2);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/", (req, res) => {
  res.send("Welcome to the Todo API");
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
// Global Error Handler
app.use(errorMiddleware);

export default app;