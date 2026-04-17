/**
 * Backend origin for `fetch`. Set `VITE_API_BASE` in Vercel to your public API URL;
 * only `VITE_*` vars are inlined at build time. Local dev defaults below.
 */
const raw = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const API_BASE = String(raw).replace(/\/$/, "");
