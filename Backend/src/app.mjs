import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config/config.mjs";
import authRoutes from "./routes/auth.routes.mjs";
import feedbackRoutes from "./routes/feedback.routes.mjs";
import dashboardRoutes from "./routes/dashboard.routes.mjs";
import userRoutes from "./routes/user.routes.mjs";
import settingsRoutes from "./routes/settings.routes.mjs";
import notificationRoutes from "./routes/notification.routes.mjs";
import analyticsRoutes from "./routes/analytics.routes.mjs";
import workspaceRoutes from "./routes/workspace.routes.mjs";

const app = express();
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

app.use(
  cors({
   origin: config.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running...",
  });
});

export default app;
