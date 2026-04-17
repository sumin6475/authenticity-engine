import { useState, useEffect, useRef } from "react";
import { API_BASE } from "../utils/apiBase.js";

/**
 * Insight — `GET /api/insights/who-youre-becoming`, `tag-frequency`, `memories`.
 */

const TAG_BAR_COLORS = [
  "#5b9fe8",
  "#3ebe90",
  "#e1ae4a",
  "#da7fab",
  "#9f82df",
  "#60c8d8",
  "#d97084",
  "#dfb562",
  "#5dbb8d",
  "#af8ce0",
];

const IDENTITY_GRADIENT_PAIR = [
  // Cool Mist + balanced: 같은 계열 안에서 은은하지만 구분되는 2가지 톤
  "linear-gradient(to bottom right, #D9E7F6, #97BEDF)",
  "linear-gradient(to bottom right, #C5DFE4, #78A9B7)",
];

const GRAIN_TEXTURE_STYLE = {
  backgroundImage:
    "radial-gradient(rgba(255,255,255,0.24) 0.35px, transparent 0.35px), radial-gradient(rgba(0,0,0,0.18) 0.3px, transparent 0.3px)",
  backgroundSize: "2px 2px, 2.5px 2.5px",
  backgroundPosition: "0 0, 0.8px 0.8px",
};

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
            ? "translateY(-2.5px) scale(1.012)"
            : "translateY(0) scale(1)",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: hovered
            ? "0 12px 32px rgba(0,0,0,0.15)"
            : "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            ...GRAIN_TEXTURE_STYLE,
            opacity: 0.22,
          }}
        />
        <div
          className="text-5xl leading-none"
          style={{
            transform: hovered
              ? "scale(1.09) rotate(-3deg)"
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
          transform: hovered ? "scaleX(1.02)" : "scaleX(1)",
          transformOrigin: "left center",
          transition: "transform 0.2s ease",
        }}
        title={tag}
      >
        {/* 색상 바 위에 은은한 grain을 얹어 평면감을 줄인다. */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            ...GRAIN_TEXTURE_STYLE,
            opacity: 0.18,
          }}
        />
        <span className="truncate relative z-10"># {tag}</span>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
        {count}
      </span>
    </div>
  );
}

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
        className="bg-ae-surface rounded-2xl shadow-ae-card px-4 py-4 mb-4 cursor-pointer"
        style={{
          transform: hovered ? "translateY(-2.5px)" : "translateY(0)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          boxShadow: hovered
            ? "0 8px 24px rgba(0,0,0,0.08)"
            : "0 2px 8px rgba(0,0,0,0.07)",
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

function PatternSection({ analysis, analysisLoading }) {
  const [expanded, setExpanded] = useState(false);
  const text = analysisLoading
    ? "Analyzing your data..."
    : analysis || "Save more to reveal your pattern...";

  return (
    <FadeIn delay={0.4}>
      <div className="mb-ae-section">
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
        <div className="bg-ae-surface rounded-xl shadow-ae-card px-6 py-5 relative">
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

const Insight = () => {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(null);

  const [analysis, setAnalysis] = useState(null);
  const [identities, setIdentities] = useState([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [tagData, setTagData] = useState([]);

  const [memoriesData, setMemoriesData] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      // 페이지 진입 시 이전 스크롤 위치를 남기지 않는다.
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

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

  const maxTagCount =
    tagData.length > 0 ? Math.max(...tagData.map((t) => t.count)) : 0;
  const now = new Date();
  const currentMonth = now.toLocaleDateString("en-US", { month: "long" });
  const currentYear = now.getFullYear();

  return (
    <div
      className="min-h-[calc(100dvh-5rem)] pb-6 w-full flex flex-col"
      style={{
        background: "#f8f8f6",
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
        className="relative w-full flex flex-col flex-1 overflow-hidden"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 pb-4"
          style={{ scrollBehavior: "smooth" }}
        >
          <FadeIn delay={0.2}>
            <h2 className="text-lg font-bold text-gray-900 mb-3 mt-2">
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
                    gradient={IDENTITY_GRADIENT_PAIR[i % IDENTITY_GRADIENT_PAIR.length]}
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
                    gradient={IDENTITY_GRADIENT_PAIR[i % IDENTITY_GRADIENT_PAIR.length]}
                    delay={0.25 + i * 0.1}
                  />
                ))}
          </div>

          <PatternSection
            analysis={analysis}
            analysisLoading={analysisLoading}
          />

          <div className="h-px bg-gray-100 mb-ae-section" />
          <div className="mt-6 mb-4">
            <span className="text-[32px] font-bold text-gray-900 leading-none">
              {currentMonth}
            </span>
            <span className="text-[32px] font-bold text-gray-300 leading-none ml-1.5">
              {currentYear}
            </span>
          </div>

          <FadeIn delay={0.2}>
            <div className="mb-ae-section">
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
        </div>
      </div>
    </div>
  );
};

export default Insight;
