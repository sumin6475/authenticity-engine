import { useState, useEffect, useRef } from "react";
import { API_BASE } from "../utils/apiBase.js";
import { useNavigate } from "react-router-dom";

// 요소가 화면에 들어오면 visible — 스크롤 시 순차 등장 애니메이션용
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

// useInView + delay로 블록마다 살짝 어긋나게 등장
function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function HeroSection({ userName, captures }) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekCaptures = captures.filter(
    (c) => new Date(c.createdAt) > weekAgo,
  ).length;

  //첫 캡쳐기준으로 가입일 대체 (Auth 후엔 유저 정보로)
  const oldestCapture =
    captures.length > 0
      ? new Date(
          Math.min(...captures.map((c) => new Date(c.createdAt).getTime())),
        )
      : now;
  const dayOfBecoming = Math.max(
    1,
    Math.floor((now - oldestCapture) / (1000 * 60 * 60 * 24)),
  );

  return (
    <FadeIn delay={0.1}>
      <div className="pt-5 pt-6">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          {userName},
        </h1>
        <p className="text-3xl text-gray-700 mt-1 font-serif">
          You are the BRAND
        </p>

        <div className="gap-8 mt-6 mb-8">
          <div>
            <span className="text-3xl font-bold text-gray-300">
              {thisWeekCaptures}
            </span>
            <span className="text-base font-medium text-gray-900 ml-2">
              this week
            </span>
          </div>
          <div>
            <span className="text-3xl font-bold text-gray-300">
              {dayOfBecoming}
            </span>
            <span className="text-base font-medium text-gray-900 ml-2">
              days of becoming
            </span>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

const CAROUSEL_PLACEHOLDER_BGS = ["#e8e0d8", "#d4dce4", "#dce8d4", "#e4d8e8"];
// Recently Saved 상단 — slides는 캡처 객체 배열 (title 등)
function Carousel({ slides }) {
  const [active, setActive] = useState(0);
  const total = slides.length;
  const safeIndex = total ? active % total : 0;
  const navigate = useNavigate();
  const swiped = useRef(false);

  //스와이프
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;
    const threshold = 50;
    // 손가락을 왼쪽으로 치면 diff < 0 → 다음 슬라이드, 오른쪽이면 이전
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
    //웹 처리
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

function FilterIcon({ icon, active, color, ariaLabel }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 border-0 p-0"
      style={{
        background: active ? color : "#f3f4f6",
        color: active ? "#fff" : "#aaa",
      }}
    >
      {icon}
    </button>
  );
}

function Tag({ label }) {
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
      style={{ fontFamily: "'Pretendard', -apple-system, sans-serif" }}
    >
      # {label}
    </span>
  );
}

// History 리스트 한 줄 — thumbnail URL 있으면 이미지, 없으면 영역 자체 미표시
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
        className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] px-3 py-4 mb-3 overflow-hidden relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.2s ease",
        }}
      >
        <article
          onClick={() => navigate(`/capture/${id}`)}
          className="cursor-pointer"
        >
          {/* 썸네일 URL이 있을 때만 영역 표시 (Mongo에 thumbnail 등 필드 추가 후 연동) */}
          {thumbnail ? (
            <div
              className="rounded-xl overflow-hidden mb-3 relative"
              style={{ height: 180 }}
            >
              <img
                src={thumbnail}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
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
                  transform: isStarred ? "scale(1.1)" : "scale(1)",
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
            </div>
          ) : null}

          <h3
            className="text-[15px] font-bold text-gray-900 leading-snug mb-1"
            style={{ fontFamily: "'Pretendard', -apple-system, sans-serif" }}
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

/**
 * Home: Recently Saved 캐러셀, History 필터 + 카드 목록
 * Layout의 BottomNav·Fab 사용 — TabBar·상태바·폰 프레임·중복 FAB 제외
 */
const Home = () => {
  // 첫 페인트 직후 살짝 딜레이 → 카드 영역 페이드 인
  const [mounted, setMounted] = useState(false);

  // 서버 캡처 목록 (캐러셀·History 공통 데이터)
  const [captures, setCaptures] = useState([]);
  const [capturesLoading, setCapturesLoading] = useState(true);
  const [capturesError, setCapturesError] = useState(null);

  const navigate = useNavigate();

  // 마운트 시 한 번만 GET — 배포 URL은 VITE_API_BASE (없으면 localhost)
  useEffect(() => {
    let cancelled = false;
    setCapturesLoading(true);
    setCapturesError(null);

    fetch(`${API_BASE}/api/captures`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            data?.error || `Server responded ${res.status} (${res.statusText})`,
          );
        }
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.success && Array.isArray(data.data)) {
          setCaptures(data.data);
        } else {
          setCaptures([]);
          setCapturesError(data?.error || "Invalid list format.");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("GET /api/captures:", API_BASE, err);
        setCaptures([]);
        setCapturesError(err.message || "Failed to load the list.");
      })
      .finally(() => {
        if (!cancelled) setCapturesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-[calc(100dvh-5rem)] px-5 pb-6 w-full flex flex-col bg-white"
      style={{
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
        {/* Recently Saved 헤더 + 프로필 자리 */}
        <FadeIn delay={0.1}>
          <div className="flex justify-between items-start px-5 pt-5 pb-1 shrink-0 border-b border-gray-100/80">
            <div>
              <HeroSection userName="Sumin" captures={captures} />
            </div>
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
        </FadeIn>

        <div
          className="flex-1 overflow-y-auto px-5 pb-4 relative"
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

          {/* History 제목 + 필터 버튼 (상태 연동은 추후) */}
          <FadeIn delay={0.25}>
            <div className="flex justify-between items-center mb-4 mt-2">
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
              <div className="flex gap-1.5">
                <FilterIcon
                  active
                  color="#facc15"
                  ariaLabel="Starred filter"
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                      <path
                        fill="#fff"
                        stroke="#fff"
                        strokeWidth="1.5"
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      />
                    </svg>
                  }
                />
                <FilterIcon
                  active
                  color="#34d399"
                  ariaLabel="Gallery filter"
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 16l5-5 4 4 3-3 6 6" />
                    </svg>
                  }
                />
                <FilterIcon
                  active={false}
                  color=""
                  ariaLabel="Reflections filter"
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <circle cx="12" cy="12" r="5" />
                    </svg>
                  }
                />
                <FilterIcon
                  active={false}
                  color=""
                  ariaLabel="Sort or filter list"
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M3 4h18M7 8h10M10 12h4" strokeLinecap="round" />
                    </svg>
                  }
                />
              </div>
            </div>
          </FadeIn>

          {/* 전체 캡처 — Mongo는 _id */}
          {captures.map((item, i) => (
            <ContentCard
              key={item._id ?? item.id}
              id={item._id}
              title={item.title}
              description={item.summary || item.content?.slice(0, 150) + "..."}
              tags={item.tags || []}
              date={new Date(item.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              starred={false}
              delay={0.3 + i * 0.1}
              thumbnail={item.thumbnail}
            />
          ))}

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default Home;
