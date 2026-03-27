import { useState, useEffect, useRef } from "react";
import { API_BASE } from "../utils/apiBase.js";

/* ──────────────────────────────────────
   설정값 / 상수
   ────────────────────────────────────── */

// 태그 바 색상 팔레트 (순서대로 순환)
const TAG_BAR_COLORS = [
  "#60a5fa", "#34d399", "#fbbf24", "#f472b6", "#a78bfa",
  "#67e8f9", "#fb7185", "#fcd34d", "#4ade80", "#c084fc",
];

// "Who You're Becoming" 카드 배경 그라디언트 (순서대로 적용)
const IDENTITY_GRADIENTS = [
  "linear-gradient(to bottom right, #F7C7D9, #E888D1)",
  "linear-gradient(to bottom right, #0B5777, #193153)",
  "linear-gradient(to bottom right, #0DB8D3, #065B98)",
  "linear-gradient(to bottom right, #5CA87C, #1A5140)",
];

/* ──────────────────────────────────────
   공용 UI 컴포넌트 (화면 여러 곳에서 재사용)
   ────────────────────────────────────── */

// 스크롤해서 보일 때 페이드 인 애니메이션 트리거
function useInView(threshold = 0.2) {
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
  const [ref, visible] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Topic·Reflection 숫자 옆 파란 화살표 아이콘
function UpArrow() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center shrink-0">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 12V4M4 7l4-4 4 4"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────
   화면별 섹션 컴포넌트
   ────────────────────────────────────── */

// 🟩 "Who You're Becoming" 카드 한 장 (이모지 + 제목, 그라디언트 배경)
function IdentityCard({ emoji, subtitle, title, gradient, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay} className="flex-1 min-w-0">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative rounded-2xl p-5 pb-4 flex flex-col justify-between min-h-[180px] cursor-pointer overflow-hidden"
        style={{
          background: gradient,
          transform: hovered
            ? "translateY(-4px) scale(1.02)"
            : "translateY(0) scale(1)",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: hovered
            ? "0 12px 32px rgba(0,0,0,0.15)"
            : "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div
          className="text-5xl leading-none"
          style={{
            transform: hovered
              ? "scale(1.15) rotate(-5deg)"
              : "scale(1) rotate(0deg)",
            transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transformOrigin: "center center",
          }}
        >
          {emoji}
        </div>
        <div className="mt-auto">
          <div className="text-xs text-white/70 mb-0.5">{subtitle}</div>
          <div className="text-xl font-bold text-white tracking-tight">
            {title}
          </div>
        </div>
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: hovered
              ? "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)"
              : "none",
            transition: "background 0.3s ease",
          }}
        />
      </div>
    </FadeIn>
  );
}

// 🏷️ Tag 빈도 바 한 줄 (tagData 기반)
function TagBar({ tag, count, maxCount, colorIdx, delay }) {
  const [ref, visible] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  const pct = maxCount > 0 ? Math.max((count / maxCount) * 100, 15) : 15;
  const color = TAG_BAR_COLORS[colorIdx % TAG_BAR_COLORS.length];

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2 mb-2 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
      }}
    >
      <div
        className="relative flex items-center px-2.5 py-1.5 rounded-lg text-white text-xs font-medium"
        style={{
          width: `${pct}%`,
          minWidth: 72,
          maxWidth: "85%",
          height: 32,
          background: color,
          transform: hovered ? "scaleX(1.03)" : "scaleX(1)",
          transformOrigin: "left center",
          transition: "transform 0.2s ease",
        }}
        title={tag}
      >
        <span className="truncate"># {tag}</span>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
        {count}
      </span>
    </div>
  );
}

// 📋 Memories 캡처 카드 한 장 (Insight·Reflection 공용)
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

// 💬 Pattern 섹션 — AI 분석 텍스트, 3줄까지만 보이고 Read More로 펼침
function PatternSection({ analysis, analysisLoading }) {
  const [expanded, setExpanded] = useState(false);
  const text = analysisLoading
    ? "Analyzing your data..."
    : analysis || "Save more to reveal your pattern...";

  return (
    <FadeIn delay={0.4}>
      <div className="mb-7">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold text-gray-900 m-0">Pattern</h3>
          {analysis && !analysisLoading && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="text-sm text-blue-500 font-medium cursor-pointer hover:text-blue-600 transition-colors bg-transparent border-none p-0"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
        <div className="bg-gray-50 rounded-xl px-6 py-5 relative group hover:bg-gray-100 transition-colors">
          <span
            className="absolute top-3 left-4 text-3xl text-gray-300 select-none"
            aria-hidden
          >
            &ldquo;
          </span>
          <p
            className={`text-base font-medium text-gray-800 text-center leading-relaxed mx-4 my-1 ${!expanded ? "line-clamp-3" : ""}`}
          >
            {text}
          </p>
          <span
            className="absolute bottom-2 right-4 text-3xl text-gray-300 select-none"
            aria-hidden
          >
            &rdquo;
          </span>
        </div>
      </div>
    </FadeIn>
  );
}

/* ──────────────────────────────────────
   메인 페이지 컴포넌트
   화면 위→아래 순서:
     1) 헤더 ("Insight" 타이틀 + 프로필)
     2) "Who You're Becoming" 카드 2장
     3) Pattern (AI 분석 인용문)
     4) 월별 Topic 도트 그리드 + 범례
     5) Reflection 가로 막대 차트
   ────────────────────────────────────── */
const Insight = () => {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(null);

  // 서버에서 받아온 AI 패턴 분석 텍스트 + identity 카드
  const [analysis, setAnalysis] = useState(null);
  const [identities, setIdentities] = useState([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // 서버에서 받아온 태그 집계 (Topic 섹션)
  const [tagData, setTagData] = useState([]);

  // 서버에서 받아온 과거 캡처 (Memories 섹션)
  const [memoriesData, setMemoriesData] = useState([]);

  // 페이드 인 트리거
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // 마운트 시 "Who You're Becoming" 분석 API 호출
  useEffect(() => {
    const fetchAnalysis = async () => {
      setAnalysisLoading(true);
      try {
        const response = await fetch(
          `${API_BASE}/api/insights/who-youre-becoming`,
        );
        const data = await response.json();
        if (data.success) {
          setAnalysis(data.data.analysis);
          if (data.data.identities) setIdentities(data.data.identities);
        }
      } catch (error) {
        console.error("Error fetching analysis:", error);
      }

      setAnalysisLoading(false);
    };
    fetchAnalysis();
  }, []);

  // 마운트 시 태그 집계 API 호출
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/insights/tag-frequency`);
        const data = await response.json();
        if (data.success) setTagData(data.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  // 마운트 시 Memories(과거 캡처) API 호출
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/insights/memories`);
        const data = await response.json();
        if (data.success) setMemoriesData(data.data);
      } catch (error) {
        console.error("Error fetching memories:", error);
      }
    };
    fetchMemories();
  }, []);

  // tagData에서 최대 count (바 너비 계산용)
  const maxTagCount =
    tagData.length > 0 ? Math.max(...tagData.map((t) => t.count)) : 0;

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
        {/* ① 헤더: "Insight" + 프로필 아이콘 */}
        <FadeIn delay={0.1}>
          <div className="flex justify-between items-center px-5 pt-5 pb-2 shrink-0 border-b border-gray-100/80">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight m-0">
              Insight
            </h1>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
              aria-label="Profile"
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
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 pb-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* ② "Who You're Becoming" 섹션 제목 + 카드 2장 */}
          <FadeIn delay={0.2}>
            <h2 className="text-lg font-bold text-gray-900 mb-3 mt-4">
              Who You&apos;re Becoming...
            </h2>
          </FadeIn>
          <div className="flex gap-3 mb-5">
            {identities.length > 0
              ? identities.map((id, i) => (
                  <IdentityCard
                    key={id.keyword}
                    emoji={id.emoji}
                    subtitle={id.description}
                    title={id.keyword}
                    gradient={IDENTITY_GRADIENTS[i % IDENTITY_GRADIENTS.length]}
                    delay={0.25 + i * 0.1}
                  />
                ))
              : [0, 1].map((i) => (
                  <IdentityCard
                    key={i}
                    emoji="✨"
                    subtitle={
                      analysisLoading ? "Analyzing..." : "Save more captures"
                    }
                    title="?"
                    gradient="linear-gradient(to bottom right, #e5e7eb, #d1d5db)"
                    delay={0.25 + i * 0.1}
                  />
                ))}
          </div>

          {/* ③ Pattern 섹션: AI 분석 인용문 (3줄 접힘) */}
          <PatternSection
            analysis={analysis}
            analysisLoading={analysisLoading}
          />

          {/* 통계 구분선 */}
          <div className="h-px bg-gray-100 mb-4" />

          {/* ④ Topic 섹션: 태그별 빈도 바 리스트 (tagData) */}
          <FadeIn delay={0.2}>
            <div className="mb-7">
              <div className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
                Topic
              </div>
              <div className="text-sm text-gray-500 mb-1">
                You&apos;ve explored
              </div>
              <div className="flex items-center gap-2 mb-4">
                <UpArrow />
                <span className="text-4xl font-bold text-gray-900 leading-none">
                  {tagData.length}
                </span>
                <span className="text-lg text-gray-500">tags</span>
              </div>

              {tagData.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Save more captures to see your tag breakdown.
                </p>
              ) : (
                tagData.map((t, i) => (
                  <TagBar
                    key={t._id}
                    tag={t._id}
                    count={t.count}
                    maxCount={maxTagCount}
                    colorIdx={i}
                    delay={0.3 + i * 0.06}
                  />
                ))
              )}
            </div>
          </FadeIn>

          <div className="h-px bg-gray-100 mb-6" />

          {/* ⑤ Memories 섹션: 과거 캡처 카드 리스트 */}
          <FadeIn delay={0.2}>
            <div className="mb-6">
              <div className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
                Memories
              </div>
              <div className="text-sm text-gray-500 mb-1">
                You&apos;ve captured
              </div>
              <div className="flex items-center gap-2 mb-4">
                <UpArrow />
                <span className="text-4xl font-bold text-gray-900 leading-none">
                  {memoriesData.length}
                </span>
                <span className="text-lg text-gray-500">moments</span>
              </div>
            </div>
          </FadeIn>

          {memoriesData.length === 0 ? (
            <p className="text-sm text-gray-400 mb-6">
              Save captures to see your memories here.
            </p>
          ) : (
            memoriesData.map((m, i) => (
              <MemoryCaptureCard
                key={m._id || i}
                title={m.title}
                summary={m.summary}
                tags={m.tags}
                createdAt={m.createdAt}
                delay={0.3 + i * 0.06}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Insight;
