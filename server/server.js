//Express 서버 기본 세팅
import "./loadEnv.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import capturesRouter from "./routes/captures.js";
import parseRouter from "./routes/parse.js";

const app = express();

// 미들웨어 설정 — Vercel 등 외부 오리진에서 오는 요청 허용 (프리플라이트 포함)
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json()); //JSON 형식으로 데이터 전송 허용
app.use("/api/parse", parseRouter);

app.get("/", (req, res) => {
  res.send({ message: "This is Authenticity Engine Server" });
});

app.use("/api/captures", capturesRouter);

const PORT = process.env.PORT || 5000;

// DB 붙기 전에 listen 하면 find()가 버퍼링됐다가 10초 타임아웃 날 수 있음 → 연결 성공 후에만 HTTP 열기
async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !String(uri).trim()) {
    console.error(
      "[FATAL] MONGODB_URI 가 비어 있습니다. Railway Variables 에 동일한 이름으로 Atlas 연결 문자열을 넣으세요.",
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
      "→ Atlas Network Access 에 0.0.0.0/0 허용, 사용자/비밀번호·클러스터 호스트가 URI 와 일치하는지 확인하세요.",
    );
    process.exit(1);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();