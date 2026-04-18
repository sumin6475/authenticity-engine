# Authenticity Engine

캡처(아이디어·링크)를 저장하고, AI로 태그·요약·임베딩을 붙인 뒤 유사 노트 검색과 인사이트를 보여주는 리플렉션 앱입니다.

## 스택

- **프론트:** React, Vite, Tailwind CSS  
- **백엔드:** Node.js, Express, Mongoose  
- **DB:** MongoDB Atlas + Vector Search  
- **AI:** OpenAI (`gpt-4o-mini`, `text-embedding-3-small`) — Responses API + Zod structured output  

## 사전 준비

- Node.js 18+ 권장  
- MongoDB Atlas 클러스터 및 연결 문자열  
- OpenAI API 키  

## 로컬 실행

```bash
git clone https://github.com/sumin6475/authenticity-engine.git
cd authenticity-engine
```

**서버** (`server/`)

```bash
cd server
npm install
```

`server/.env` 예시:

```env
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
# 생략 시 기본 5000 — 클라이언트 `VITE_API_BASE`와 맞출 것
PORT=5000
```

```bash
npm start
```

**클라이언트** (`client/`, 다른 터미널)

```bash
cd client
npm install
```

`client/.env` (또는 `.env.local`):

```env
# 끝에 슬래시 없이, 서버 origin과 동일하게
VITE_API_BASE=http://localhost:5000
```

```bash
npm run dev
```

## MongoDB Atlas — Vector Search

`captures` 컬렉션에 **인덱스 이름 `vector_index`** 로 Vector Search 인덱스를 만들어야 합니다(코드와 동일해야 함).

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

## 배포 메모

- 프론트: Vercel 등 — 빌드 시 `VITE_API_BASE`에 공개 API origin 설정  
- 백엔드·DB: Railway 등 — `MONGODB_URI`, `OPENAI_API_KEY`, `PORT` 환경 변수 설정  

## 레포 구조

```
authenticity-engine/
├── client/    # Vite + React
└── server/    # Express + Mongoose + OpenAI
```
