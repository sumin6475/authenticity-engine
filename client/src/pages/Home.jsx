import { useState, useEffect, useRef } from "react";
import { API_BASE } from "../utils/apiBase.js";
import { useNavigate } from "react-router-dom";

/**
 * Home — `GET /api/captures` (paginated), hero stats, carousel, history cards.
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
        transition: `opacity 0.22s ease-out ${delay}s, transform 0.22s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function HeroSection({ userName }) {
  return (
    <FadeIn delay={0.1}>
      <div className="pt-3">
        <h1
          className="text-[42px] font-black text-gray-900 leading-[1.1] tracking-tight"
          style={{
            fontFamily:
              "'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {userName},
        </h1>
        <p
          className="text-[26px] font-light text-[#8b8b96] mt-1 leading-[1.2] tracking-tight"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          You are the BRAND
        </p>
      </div>
    </FadeIn>
  );
}

const CAROUSEL_PLACEHOLDER_BGS = ["#e8e0d8", "#d4dce4", "#dce8d4", "#e4d8e8"];
const HERO_GRADIENT =
  "linear-gradient(160deg, #f0edf8 0%, #edf4fb 35%, #e8f5ee 65%, #fdf5e6 100%)";

function Carousel({ slides }) {
  const [active, setActive] = useState(0);
  const total = slides.length;
  const safeIndex = total ? active % total : 0;
  const navigate = useNavigate();
  const swiped = useRef(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;
    const threshold = 50;
    if (diff < -threshold) {
      swiped.current = true;
      setActive((a) => (a + 1) % total);
    } else if (diff > threshold) {
      swiped.current = true;
      setActive((a) => (a - 1 + total) % total);
    } else {
      swiped.current = true;
      navigate(`/capture/${slides[safeIndex]._id}`);
    }
  };

  const handleClick = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    navigate(`/capture/${slides[safeIndex]._id}`);
  };

  if (!total) return null;

  const slide = slides[safeIndex];

  return (
    <div className="mb-5">
      <button
        type="button"
        className="rounded-2xl overflow-hidden relative cursor-pointer group w-full text-left border-0 p-0"
        style={{ height: 200 }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={`Recently saved slide ${safeIndex + 1} of ${total}. Tap for next.`}
      >
        {slide.thumbnail ? (
          <>
            <img
              src={slide.thumbnail}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent pt-8 pb-2 px-3">
              <span className="text-xs text-white line-clamp-2 font-medium">
                {slide.title}
              </span>
            </div>
          </>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:
                CAROUSEL_PLACEHOLDER_BGS[
                  safeIndex % CAROUSEL_PLACEHOLDER_BGS.length
                ],
            }}
          >
            <div className="flex flex-col items-center gap-2 opacity-40">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="#666"
                  strokeWidth="1.5"
                />
                <circle cx="8.5" cy="8.5" r="1.5" fill="#666" />
                <path
                  d="M3 16l5-5 4 4 3-3 6 6"
                  stroke="#666"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-xs text-gray-500 px-4 text-center">
                {slide.title}
              </span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
      </button>
      <div
        className="flex justify-center gap-1.5 mt-3"
        role="tablist"
        aria-label="Carousel slides"
      >
        {slides.map((s, i) => (
          <button
            key={s.id ?? i}
            type="button"
            role="tab"
            aria-selected={i === safeIndex}
            onClick={() => setActive(i)}
            className="border-none cursor-pointer outline-none p-0 rounded-full transition-all duration-300"
            style={{
              width: i === safeIndex ? 8 : 6,
              height: i === safeIndex ? 8 : 6,
              background: i === safeIndex ? "#3b82f6" : "#d1d5db",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Tag({ label }) {
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
      style={{ fontFamily: "'Pretendard', -apple-system, sans-serif" }}
    >
      # {label}
    </span>
  );
}

function ContentCard({
  id,
  thumbnail,
  title,
  description,
  tags,
  date,
  starred,
  delay,
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [isStarred, setIsStarred] = useState(starred);

  return (
    <FadeIn delay={delay}>
      <div
        className="bg-ae-surface rounded-2xl shadow-ae-card px-4 py-4 mb-4 overflow-hidden relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered ? "translateY(-2.5px)" : "translateY(0)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          boxShadow: hovered
            ? "0 8px 24px rgba(0,0,0,0.08)"
            : "0 2px 8px rgba(0,0,0,0.07)",
        }}
      >
        <article
          onClick={() => navigate(`/capture/${id}`)}
          className="cursor-pointer relative"
        >
          {isStarred && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsStarred(!isStarred);
              }}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-300"
              style={{
                background: isStarred
                  ? "rgba(250,204,21,0.2)"
                  : "rgba(0,0,0,0.2)",
                transform: isStarred ? "scale(1.06)" : "scale(1)",
              }}
              aria-label={isStarred ? "Remove star" : "Star item"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={isStarred ? "#facc15" : "none"}
                  stroke={isStarred ? "#facc15" : "#fff"}
                  strokeWidth="2"
                />
              </svg>
            </button>
          )}
          {thumbnail && (
            <div
              className="rounded-xl overflow-hidden mb-3"
              style={{ height: 180 }}
            >
              <img
                src={thumbnail}
                alt=""
                className="inset-0 h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <h3
            className={`text-[15px] font-bold leading-snug mb-1 ${isStarred && !thumbnail ? "pr-10" : ""}`}
          >
            {title}
          </h3>
          <p
            className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-3"
            style={{ fontFamily: "'Pretendard', -apple-system, sans-serif" }}
          >
            {description}
          </p>

          <div className="flex gap-2 flex-wrap mb-2">
            {tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>

          <div
            className="text-xs text-gray-400"
            style={{ fontFamily: "'Pretendard', -apple-system, sans-serif" }}
          >
            {date}
          </div>
        </article>
      </div>
    </FadeIn>
  );
}

const Home = () => {
  const [mounted, setMounted] = useState(false);

  const [captures, setCaptures] = useState([]);
  const [capturesLoading, setCapturesLoading] = useState(true);
  const [capturesError, setCapturesError] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageScrollRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setCapturesLoading(true);
    setCapturesError(null);

    const loadCaptures = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/captures?page=1`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            data?.error || `Server responded ${res.status} (${res.statusText})`,
          );
        }
        if (cancelled) return;
        if (data.success && Array.isArray(data.data)) {
          setCaptures(data.data);
          setHasMore(data.hasMore);
        } else {
          setCaptures([]);
          setCapturesError(data?.error || "Invalid list format.");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("GET /api/captures:", API_BASE, err);
        setCaptures([]);
        setCapturesError(err.message || "Failed to load the list.");
      } finally {
        if (!cancelled) setCapturesLoading(false);
      }
    };

    loadCaptures();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      // 탭 이동 시 항상 히어로부터 보이도록 스크롤을 최상단으로 맞춘다.
      pageScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  const loadMore = async () => {
    const nextPage = page + 1;
    try {
      const res = await fetch(`${API_BASE}/api/captures?page=${nextPage}`);
      const data = await res.json();
      if (data.success) {
        setCaptures((prev) => [...prev, ...data.data]);
        setHasMore(data.hasMore);
        setPage(nextPage);
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
          "@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css'); @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');"
        }
      </style>
      <div
        className="relative w-full flex flex-col flex-1 overflow-hidden rounded-b-2xl"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.35s ease-out, transform 0.35s ease-out",
        }}
      >
        <FadeIn delay={0.1}>
          <div
            className="relative overflow-hidden rounded-b-2xl"
            style={{ background: HERO_GRADIENT }}
          >
            <div className="flex justify-end pt-5 pr-4">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors mt-1 border-0 p-0"
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

            <div className="flex justify-between items-start px-4 pt-5 pb-[76px] shrink-0">
              <div>
                <HeroSection userName="Sumin" />
              </div>
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
              style={{
                background:
                  "linear-gradient(180deg, rgba(248,248,246,0) 0%, rgba(248,248,246,0.82) 78%, #f8f8f6 100%)",
                filter: "blur(14px)",
                transform: "translateY(38%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
              style={{
                background:
                  "linear-gradient(180deg, rgba(248,248,246,0) 0%, #f8f8f6 96%)",
              }}
            />
          </div>
        </FadeIn>

        <div
          ref={pageScrollRef}
          className="flex-1 overflow-y-auto px-4 pb-4 relative"
          style={{ scrollBehavior: "smooth" }}
        >
          {capturesError && (
            <p
              className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 mt-2 mb-1"
              role="alert"
            >
              {capturesError}
            </p>
          )}

          <FadeIn delay={0.25}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 m-0 leading-tight">
                  History
                </h2>
                <span className="text-xs text-gray-400">
                  {capturesLoading
                    ? "…"
                    : capturesError
                      ? "—"
                      : `${captures.length} Items`}
                </span>
              </div>
            </div>
          </FadeIn>

          {captures.map((item, i) => (
            <ContentCard
              key={item._id ?? item.id}
              id={item._id}
              title={item.title}
              description={
                item.type === "link"
                  ? item.summary || ""
                  : item.content
                    ? `${item.content.slice(0, 150)}${item.content.length > 150 ? "..." : ""}`
                    : ""
              }
              tags={item.tags || []}
              date={new Date(item.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              starred={false}
              delay={0.06 + i * 0.02}
              thumbnail={item.thumbnail}
            />
          ))}
          {hasMore && (
            <div className="sticky bottom-0 pt-2 pb-2 bg-gradient-to-t from-ae-surface via-ae-surface to-transparent">
              <button
                type="button"
                onClick={loadMore}
                className="w-full rounded-xl bg-ae-surface shadow-ae-card py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-0"
              >
                Load more
              </button>
            </div>
          )}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default Home;
