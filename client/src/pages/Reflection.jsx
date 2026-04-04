import { useState, useEffect, useRef } from "react";
import { recommended, recaps } from "../utils/dummyData";
import { API_BASE } from "../utils/apiBase.js";
import { useNavigate } from "react-router-dom";

/* ──────────────────────────────────────
   공용 UI 컴포넌트
   ────────────────────────────────────── */

// 스크롤해서 보일 때 페이드 인 애니메이션 트리거
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────
   화면별 섹션 컴포넌트
   ────────────────────────────────────── */

// 가로 스크롤 영역 스크롤바 숨김
const hideScrollbar =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

// 📋 Memories 캡처 카드 한 장 (서버 데이터 기반)
function MemoryCaptureCard({ title, summary, tags, createdAt, delay }) {
  const [hovered, setHovered] = useState(false);
  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <FadeIn delay={delay}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="border border-gray-100 rounded-xl p-4 mb-3 cursor-pointer"
        style={{
          background: hovered ? "#f9fafb" : "#fff",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "all 0.25s ease",
          boxShadow: hovered
            ? "0 6px 20px rgba(0,0,0,0.06)"
            : "0 1px 4px rgba(0,0,0,0.03)",
        }}
      >
        <div className="flex justify-between items-start mb-1.5">
          <h4 className="text-sm font-bold text-gray-900 leading-snug m-0 line-clamp-1 flex-1">
            {title}
          </h4>
          {dateStr && (
            <span className="text-[11px] text-gray-400 shrink-0 ml-2">
              {dateStr}
            </span>
          )}
        </div>
        {summary && (
          <p className="text-xs text-gray-500 leading-relaxed m-0 mb-2 line-clamp-2">
            {summary}
          </p>
        )}
        {tags?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
              >
                # {t}
              </span>
            ))}
          </div>
        )}
      </article>
    </FadeIn>
  );
}

// 📅 Recaps 카드 (WEEKLY 작은 카드 / MONTHLY 넓은 카드)
function RecapCard({ type, label, accent }) {
  const [hovered, setHovered] = useState(false);
  const isMonthly = type === "MONTHLY";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl cursor-pointer overflow-hidden relative shrink-0"
      style={{
        width: isMonthly ? 230 : 138,
        height: isMonthly ? 105 : 95,
        background: accent,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition:
          "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
        boxShadow: hovered
          ? "0 10px 28px rgba(0,0,0,0.1)"
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div className="p-3.5 h-full flex flex-col justify-between relative z-10">
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{
            color: isMonthly ? "rgba(30,64,175,0.5)" : "rgba(67,56,202,0.5)",
          }}
        >
          {type}
        </span>
        <div
          className="font-bold text-xl leading-tight"
          style={{ color: isMonthly ? "#1e40af" : "#4338ca" }}
        >
          {label}
        </div>
      </div>
      {isMonthly && (
        <div
          className="absolute right-3 bottom-0 text-5xl font-black select-none pointer-events-none"
          style={{
            color:
              label === "January"
                ? "rgba(59,130,246,0.15)"
                : "rgba(244,63,94,0.2)",
            transform: hovered ? "scale(1.05) rotate(-2deg)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        >
          {label === "January" ? "2026" : "2025"}
        </div>
      )}
    </div>
  );
}

// 🖼️ 사진 그리드 안의 썸네일 한 칸
function PhotoThumbnail({ color, delay }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useInView(0.1);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="aspect-square rounded-lg cursor-pointer"
      style={{
        background: color,
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? "scale(1.12)"
            : "scale(1)"
          : "scale(0.7)",
        transition: `opacity 0.4s ease ${delay}s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)`,
      }}
    />
  );
}

// 📰 Recommended 카드 (Notion 등 외부 소스 추천)
function RecommendedCard({ pillLabel, title, description }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl border border-gray-100 p-4 cursor-pointer"
      style={{
        background: hovered ? "#f9fafb" : "#fff",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.3s ease",
        boxShadow: hovered
          ? "0 8px 24px rgba(0,0,0,0.06)"
          : "0 1px 4px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-3 py-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="3" fill="#111" />
            <text
              x="12"
              y="16.5"
              textAnchor="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="bold"
              fontFamily="serif"
            >
              N
            </text>
          </svg>
          <span className="text-xs text-gray-500 font-medium">{pillLabel}</span>
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed m-0">{description}</p>
    </div>
  );
}

/* ──────────────────────────────────────
   설정값 / 상수 (색상·그라디언트 팔레트)
   ────────────────────────────────────── */

// Recaps 주간·월간 카드 배경
const WEEKLY_RECAP_ACCENTS = [
  "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
  "linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)",
  "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)",
];

const MONTHLY_RECAP_ACCENTS = [
  "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)",
  "linear-gradient(135deg, #fecdd3 0%, #fda4af 100%)",
];

// 사진 그리드 썸네일 색상
const PHOTO_THUMB_COLORS = [
  "linear-gradient(135deg, #97B3AE, #7A9A94)",
  "linear-gradient(135deg, #D2E0D3, #B5CCB7)",
  "linear-gradient(135deg, #F0DDD6, #E0C4BB)",
  "linear-gradient(135deg, #F2C3B9, #E0A89D)",
  "linear-gradient(135deg, #D6CBBF, #BFB0A2)",
  "linear-gradient(135deg, #F0EEEA, #DDD9D4)",
  "linear-gradient(135deg, #B8C5C1, #97B3AE)",
  "linear-gradient(135deg, #E5D4CB, #D6CBBF)",
];

/* ──────────────────────────────────────
   메인 페이지 컴포넌트
   화면 위→아래 순서:
     1) 헤더 ("Reflection" + 프로필)
     2) Today's Prompt (질문 + 텍스트 입력)
     3) Memories (가로 스크롤 카드)
     4) Recommended (외부 콘텐츠 추천 카드)
     5) Photo Highlights (사진 그리드)
     6) Recaps (주간·월간 카드)
   ────────────────────────────────────── */
const Reflection = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  // Today's Prompt 입력 상태
  const [promptText, setPromptText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  // 서버에서 받아온 Daily Prompt 질문
  const [dailyPrompt, setDailyPrompt] = useState("");
  // 서버에서 받아온 Memories 목록
  const [memories, setMemories] = useState([]);

  // 페이드 인 트리거
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // 마운트 시 Daily Prompt API 호출
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/insights/daily-prompt`);
        const data = await res.json();
        if (data.success) setDailyPrompt(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrompt();
  }, []);

  // 마운트 시 Memories API 호출
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/insights/memories`);
        const data = await res.json();
        if (data.success) setMemories(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMemories();
  }, []);

  // 더미데이터에서 Recommended / Photo Grid 항목 추출
  const notionSource =
    recommended.find((r) => r.type === "notion") || recommended[0];
  const sequenceItem =
    recommended.find((r) => r.description && !r.isPhotoGrid) || recommended[1];
  const photoGridItem = recommended.find((r) => r.isPhotoGrid);

  const photoMeta = photoGridItem?.sub
    ? photoGridItem.sub.split("·").map((s) => s.trim())
    : ["Thesedays", "December, 2025 - February, 2026"];
  const photoTitle = photoMeta[0] || "Thesedays";
  const photoSubtitle =
    photoMeta.slice(1).join(" · ") || "December, 2025 - February, 2026";

  return (
    <div
      className="min-h-[calc(100dvh-5rem)] px-5 pb-6 max-w-mobile mx-auto flex flex-col"
      style={{
        background:
          "linear-gradient(145deg, #f0f4f8 0%, #e2e8f0 50%, #dbeafe 100%)",
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>
        {
          "@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');"
        }
      </style>
      <div
        className="relative w-full flex flex-col flex-1 overflow-hidden bg-white rounded-b-3xl shadow-soft"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* ① 헤더: "Reflection" + 프로필 아이콘 */}
        <FadeIn delay={0.1}>
          <div className="flex justify-between items-center px-5 pt-5 pb-2 shrink-0 border-b border-gray-100/80">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight m-0">
              Reflection
            </h1>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
              aria-label="Profile"
              onClick={() => navigate("/profile")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"
                  fill="#60a5fa"
                />
              </svg>
            </button>
          </div>
        </FadeIn>

        <div
          className="flex-1 overflow-y-auto px-5 pb-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* ② Today's Prompt: 질문 텍스트 + 입력창 + 이모지·링크·전송 버튼 */}
          <FadeIn delay={0.2}>
            <div className="mt-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                    stroke="#60a5fa"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-800 leading-snug mb-3">
                {dailyPrompt || "What would you like to reflect on today?"}
              </p>
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: `1.5px solid ${inputFocused ? "#93c5fd" : "#e5e7eb"}`,
                  boxShadow: inputFocused
                    ? "0 0 0 3px rgba(147,197,253,0.2)"
                    : "none",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <input
                  type="text"
                  placeholder="Start writing..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="w-full px-4 py-3 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-300 border-0"
                  style={{ fontSize: 14, fontFamily: "inherit" }}
                />
                <div className="flex items-center justify-between px-3 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors border-0 cursor-pointer p-0"
                      aria-label="Sticker"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#c0c0c0"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 14s1.5 2 4 2 4-2 4-2"
                          stroke="#c0c0c0"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <circle cx="9" cy="10" r="1" fill="#c0c0c0" />
                        <circle cx="15" cy="10" r="1" fill="#c0c0c0" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors border-0 cursor-pointer p-0"
                      aria-label="Attach link"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
                          stroke="#c0c0c0"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
                          stroke="#c0c0c0"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer border-0 p-0"
                    style={{
                      background: promptText.length > 0 ? "#3b82f6" : "#f3f4f6",
                      transition: "background 0.25s ease",
                    }}
                    aria-label="Send"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        stroke={promptText.length > 0 ? "#fff" : "#c0c0c0"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* ③ Memories: 과거 캡처 카드 리스트 */}
          <FadeIn delay={0.3}>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Memories</h2>
          </FadeIn>
          {memories.length === 0 ? (
            <p className="text-sm text-gray-400 mb-5">
              Save captures to see your memories here.
            </p>
          ) : (
            memories.map((m, i) => (
              <MemoryCaptureCard
                key={m._id || i}
                title={m.title}
                summary={m.summary}
                tags={m.tags}
                createdAt={m.createdAt}
                delay={0.35 + i * 0.06}
              />
            ))
          )}

          {/* ④ Recommended: 외부 콘텐츠 추천 카드 */}
          {notionSource && sequenceItem && (
            <>
              <FadeIn delay={0.4}>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Recommended
                </h2>
              </FadeIn>
              <FadeIn delay={0.45}>
                <RecommendedCard
                  pillLabel={notionSource.title}
                  title={sequenceItem.title}
                  description={sequenceItem.description || ""}
                />
              </FadeIn>
            </>
          )}

          {/* ⑤ Photo Highlights: 4×2 사진 그리드 */}
          {photoGridItem && (
            <FadeIn delay={0.5}>
              <div className="mt-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-5 h-5 rounded-full shrink-0"
                    style={{
                      background:
                        "conic-gradient(#ea4335, #fbbc05, #34a853, #4285f4, #ea4335)",
                    }}
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {photoGridItem.title}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {PHOTO_THUMB_COLORS.map((c, i) => (
                    <PhotoThumbnail key={i} color={c} delay={0.55 + i * 0.04} />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      {photoTitle}
                    </div>
                    <div className="text-xs text-gray-400">{photoSubtitle}</div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="#d1d5db"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </FadeIn>
          )}

          {/* ⑥ Recaps: 주간 카드 → 월간 카드 (가로 스크롤) */}
          <FadeIn delay={0.55}>
            <h2 className="text-xl font-bold text-gray-900 mb-3 mt-1">
              Recaps
            </h2>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div
              className={`flex gap-2.5 overflow-x-auto pb-3 -mx-1 px-1 ${hideScrollbar}`}
            >
              {recaps.weekly.map((w, i) => (
                <RecapCard
                  key={w.id}
                  type="WEEKLY"
                  label={`${w.month} ${w.range}`}
                  accent={WEEKLY_RECAP_ACCENTS[i % WEEKLY_RECAP_ACCENTS.length]}
                />
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.65}>
            <div
              className={`flex gap-2.5 overflow-x-auto pb-4 -mx-1 px-1 mt-1 ${hideScrollbar}`}
            >
              {recaps.monthly.map((m, i) => (
                <RecapCard
                  key={m.id}
                  type="MONTHLY"
                  label={m.month}
                  accent={
                    MONTHLY_RECAP_ACCENTS[i % MONTHLY_RECAP_ACCENTS.length]
                  }
                />
              ))}
            </div>
          </FadeIn>

          <div className="h-3" />
        </div>
      </div>
    </div>
  );
};

export default Reflection;
