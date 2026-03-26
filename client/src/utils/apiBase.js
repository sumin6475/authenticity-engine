/**
 * Vite는 빌드할 때만 VITE_* 를 번들에 넣음 → Vercel 프로젝트에
 * VITE_API_BASE=https://(Railway에서 준 공개 URL) 를 넣고 다시 배포해야 함.
 * 로컬 개발은 기본값 localhost 유지.
 */
const raw = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export const API_BASE = String(raw).replace(/\/$/, "");
