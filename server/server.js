/** Express entry: env, MongoDB, API routes. */
import "./loadEnv.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import capturesRouter from "./routes/captures.js";
import parseRouter from "./routes/parse.js";
import insightsRouter from "./routes/insights.js";

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());
app.use("/api/parse", parseRouter);

app.get("/", (req, res) => {
  res.send({ message: "This is Authenticity Engine Server" });
});

app.use("/api/captures", capturesRouter);
app.use("/api/insights", insightsRouter);

const PORT = process.env.PORT || 5000;

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !String(uri).trim()) {
    console.error(
      "[FATAL] MONGODB_URI is missing. Set it in Railway Variables (or .env) to your Atlas connection string.",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15_000,
    });
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.error(
      "→ Check Atlas Network Access (e.g. 0.0.0.0/0), credentials, and that the cluster host in the URI matches your deployment.",
    );
    process.exit(1);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();