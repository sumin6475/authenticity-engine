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

//MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log("Successfully connected to MongoDB"))
.catch((err)=> console.error("MongoDB connection error", err));


app.get("/", (req, res) => {
    res.send({message : "This is Authenticity Engine Server"});
});

app.use("/api/captures", capturesRouter);

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});