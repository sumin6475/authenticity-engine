//Capture 데이터 모델 = MongoDB에 저장항 데이터의 '틀'
import mongoose from "mongoose";

const captureSchema = new mongoose.Schema({
    //제목
    title : { type: String, required: true},
    
    //본문 내용 (사용자가 쓴 글 또는 URL에서 파싱한 텍스트)
    content: { type: String, required: true},

    // 타입: idea(직접 입력) | link(URL에서 가져온 캡처)
    type: { type: String, enum: ["idea", "link"], default: "idea" },

    url: { type: String, default: ""},
    note: { type: String, default: ""},

    // AI가 생성한 태그들 
    tags : [String],

    // AI가 분류한 카테고리
    category : {type: String, default: ""},

    // AI가 생성한 요약
    summary : { type: String, default: ""},

    // 저장 날짜 (자동 생성)
    createdAt : { type: Date, default: Date.now},
})

export default mongoose.model("Capture", captureSchema);