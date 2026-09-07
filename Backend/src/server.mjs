import app from "./app.mjs";
import mongoose from "mongoose";
import { config } from "./config/config.mjs";

const PORT = config.port || 3000;

mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log("✅ MongoDB Connected!");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
