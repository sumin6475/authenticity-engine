import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { recaps } from "../utils/dummyData";
import { API_BASE } from "../utils/apiBase.js";

/**
 * Reflection — `GET /api/insights/daily-prompt`, `memories`; recaps from `dummyData`.
 */

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

const hideScrollbar =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

function MemoryCaptureCard({ id, title, summary, tags, createdAt, delay }) {
  const navigate = useNavigate();
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
        onClick={() => {
          // Home 카드와 동일하게 상세 페이지로 이동한다.
          if (id) navigate(`/capture/${id}`);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-ae-surface rounded-2xl shadow-ae-card px-4 py-4 mb-4 overflow-hidden relative cursor-pointer"
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
        transform: hovered ? "translateY(-1.8px)" : "translateY(0)",
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
            transform: hovered ? "scale(1.03) rotate(-1.2deg)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        >
          {label === "January" ? "2026" : "2025"}
        </div>
      )}
    </div>
  );
}

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
            ? "scale(1.07)"
            : "scale(1)"
          : "scale(0.7)",
        transition: `opacity 0.4s ease ${delay}s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)`,
      }}
    />
  );
}

const WEEKLY_RECAP_ACCENTS = [
  "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
  "linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)",
  "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)",
];

const MONTHLY_RECAP_ACCENTS = [
  "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)",
  "linear-gradient(135deg, #fecdd3 0%, #fda4af 100%)",
];

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

const PHOTO_HIGHLIGHTS_UI = {
  heading: "Highlights from Photo Memories",
  captionMain: "Thesedays",
  captionSub: "December, 2025 - February, 2026",
};

const Reflection = () => {
  const [mounted, setMounted] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [dailyPrompt, setDailyPrompt] = useState("");
  const [memories, setMemories] = useState([]);
  const pageScrollRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      // 탭 전환 직후 항상 최상단부터 보이도록 리셋한다.
      pageScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

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

  const handleSend = async () => {
    if (!promptText.trim()) return;
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    try {
      const res = await fetch(`${API_BASE}/api/captures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: dailyPrompt || `${today} Reflection`,
          content: promptText.trim(),
          type: "idea",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPromptText("");
        alert("Saved!");
      }
    } catch (err) {
      console.error(err);
    }
  };

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
          ref={pageScrollRef}
          className="flex-1 overflow-y-auto px-4 pb-4"
          style={{ scrollBehavior: "smooth" }}
        >
          <FadeIn delay={0.2}>
            <div className="mt-2 mb-ae-section">
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
                className="rounded-xl overflow-hidden bg-ae-surface"
                style={{
                  border: "1.5px solid transparent",
                  boxShadow: inputFocused
                    ? "0 0 0 3px rgba(147,197,253,0.2), var(--ae-card-shadow)"
                    : "var(--ae-card-shadow)",
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
                    onClick={handleSend}
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

          <FadeIn delay={0.3}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 mt-4">
              Memories
            </h2>
          </FadeIn>
          {memories.length === 0 ? (
            <p className="text-sm text-gray-400 mb-5">
              Save captures to see your memories here.
            </p>
          ) : (
            memories.map((m, i) => (
              <MemoryCaptureCard
                key={m._id || i}
                id={m._id}
                title={m.title}
                summary={m.summary}
                tags={m.tags}
                createdAt={m.createdAt}
                delay={0.35 + i * 0.06}
              />
            ))
          )}

          <FadeIn delay={0.55}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 mt-ae-section">
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
