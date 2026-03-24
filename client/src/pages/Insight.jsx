import { useState, useEffect, useRef } from 'react';
import {
  becomingCards,
  patternQuote,
  insightStats,
} from '../utils/dummyData';

/** Topic 범례 + 그리드 색 (디자인 스펙) */
const TOPICS = [
  { name: 'Productivity', color: 'bg-blue-400', hex: '#60a5fa' },
  { name: 'Note', color: 'bg-cyan-300', hex: '#67e8f9' },
  { name: 'Application', color: 'bg-rose-400', hex: '#fb7185' },
  { name: 'AI', color: 'bg-amber-300', hex: '#fcd34d' },
  { name: 'Car', color: 'bg-emerald-400', hex: '#34d399' },
];

const TOPIC_GRID = [
  [0, 0, 1, 1, -1, -1, -1],
  [0, 1, 0, 3, 3, 0, 0],
  [3, 0, 0, 3, 0, 0, 0],
  [3, 3, 0, 1, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0],
];

/** 카드별 이모지·그라디언트 (dummyData title 기준) */
const BECOMING_META = {
  Architect: {
    emoji: '🧩',
    gradient: 'bg-gradient-to-br from-emerald-300 to-emerald-500',
  },
  Overthinker: {
    emoji: '🧠',
    gradient: 'bg-gradient-to-br from-gray-400 to-gray-600',
  },
};

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, className = '' }) {
  const [ref, visible] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
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
        className={`relative rounded-2xl p-5 pb-4 flex flex-col justify-between min-h-[180px] cursor-pointer overflow-hidden ${gradient}`}
        style={{
          transform: hovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: hovered
            ? '0 12px 32px rgba(0,0,0,0.15)'
            : '0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <div
          className="text-5xl leading-none"
          style={{
            transform: hovered ? 'scale(1.15) rotate(-5deg)' : 'scale(1) rotate(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformOrigin: 'center center',
          }}
        >
          {emoji}
        </div>
        <div className="mt-auto">
          <div className="text-xs text-white/70 mb-0.5">{subtitle}</div>
          <div className="text-xl font-bold text-white tracking-tight">{title}</div>
        </div>
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: hovered
              ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)'
              : 'none',
            transition: 'background 0.3s ease',
          }}
        />
      </div>
    </FadeIn>
  );
}

function TopicDot({ colorIdx, size, delay }) {
  const [ref, visible] = useInView(0.1);
  const colors = ['#60a5fa', '#67e8f9', '#fb7185', '#fcd34d', '#34d399'];
  const sizes = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-7 h-7' };
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${sizes[size]} rounded-full cursor-pointer`}
      style={{
        backgroundColor: colors[colorIdx],
        opacity: visible ? (hovered ? 1 : 0.82) : 0,
        transform: visible ? (hovered ? 'scale(1.3)' : 'scale(1)') : 'scale(0)',
        transition: `opacity 0.4s ease ${delay}s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${visible ? 0 : delay}s`,
      }}
    />
  );
}

function ReflectionBar({ rank, label, words, pct, delay }) {
  const [ref, visible] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  const barWidth = Math.max(pct * 1.4, 12);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2 mb-2 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-20px)',
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
      }}
    >
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-xs font-medium shrink-0"
        style={{
          width: `${barWidth}%`,
          minWidth: 72,
          background: hovered
            ? 'linear-gradient(90deg, #f43f5e 0%, #e11d48 100%)'
            : 'linear-gradient(90deg, #fb7185 0%, #f43f5e 100%)',
          transform: hovered ? 'scaleX(1.03)' : 'scaleX(1)',
          transformOrigin: 'left center',
          transition: 'background 0.2s ease, transform 0.2s ease',
        }}
      >
        <span className="opacity-60">{rank}</span>
        <span className="opacity-40 text-[6px]">●</span>
        <span>{label}</span>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">
        {words} words · {pct}%
      </span>
    </div>
  );
}

/**
 * Insight: Who You&apos;re Becoming, Pattern, 월별 Topic/Reflection
 * Layout 하단 네비 사용 — 프로토타입의 TabBar/폰 크롬은 제외
 */
const Insight = () => {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const reflections = insightStats.reflectionBreakdown.map((r, i) => ({
    rank: i + 1,
    label: r.label,
    words: r.words,
    pct: r.percent,
  }));

  return (
    <div
      className="min-h-[calc(100dvh-5rem)] px-5 pb-6 max-w-mobile mx-auto flex flex-col"
      style={{
        background: 'linear-gradient(145deg, #f0f4f8 0%, #e2e8f0 50%, #dbeafe 100%)',
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
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* 헤더 */}
        <FadeIn delay={0.1}>
          <div className="flex justify-between items-center px-5 pt-5 pb-2 shrink-0 border-b border-gray-100/80">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight m-0">Insight</h1>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
              aria-label="Profile"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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
          style={{ scrollBehavior: 'smooth' }}
        >
          <FadeIn delay={0.2}>
            <h2 className="text-lg font-bold text-gray-900 mb-3 mt-4">
              Who You&apos;re Becoming...
            </h2>
          </FadeIn>
          <div className="flex gap-3 mb-5">
            {becomingCards.map((card, i) => {
              const meta = BECOMING_META[card.title] || {
                emoji: '✨',
                gradient: 'bg-gradient-to-br from-sky-300 to-blue-500',
              };
              return (
                <IdentityCard
                  key={card.id}
                  emoji={meta.emoji}
                  subtitle={card.phrase}
                  title={card.title}
                  gradient={meta.gradient}
                  delay={0.25 + i * 0.1}
                />
              );
            })}
          </div>

          <FadeIn delay={0.4}>
            <div className="mb-7">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold text-gray-900 m-0">Pattern</h3>
                <button
                  type="button"
                  className="text-sm text-blue-500 font-medium cursor-pointer hover:text-blue-600 transition-colors bg-transparent border-none p-0"
                >
                  Read More
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl px-6 py-5 relative group hover:bg-gray-100 transition-colors">
                <span className="absolute top-3 left-4 text-3xl text-gray-300 select-none" aria-hidden>
                  &ldquo;
                </span>
                <p className="text-base font-medium text-gray-800 text-center leading-relaxed mx-4 my-1">
                  {patternQuote}
                </p>
                <span className="absolute bottom-2 right-4 text-3xl text-gray-300 select-none" aria-hidden>
                  &rdquo;
                </span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              {insightStats.month}{' '}
              <span className="text-gray-300 font-normal">{insightStats.year}</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mb-7">
              <div className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
                Topic
              </div>
              <div className="text-sm text-gray-500 mb-1">You&apos;ve explored</div>
              <div className="flex items-center gap-2 mb-1">
                <UpArrow />
                <span className="text-4xl font-bold text-gray-900 leading-none">
                  {insightStats.topicCount}
                </span>
                <span className="text-lg text-gray-500">topics</span>
              </div>
              <div className="text-xs text-gray-400 mb-4">
                December: {insightStats.topicPrev} topics
              </div>

              <div className="flex gap-5 items-start">
                <div className="flex flex-col gap-1.5">
                  {TOPIC_GRID.map((row, ri) => (
                    <div key={ri} className="flex gap-1.5">
                      {row.map((val, ci) => {
                        if (val === -1) return <div key={ci} className="w-7 h-7" />;
                        const sizeMap = { 0: 'lg', 1: 'md', 2: 'lg', 3: 'md', 4: 'sm' };
                        return (
                          <TopicDot
                            key={ci}
                            colorIdx={val}
                            size={sizeMap[val] || 'md'}
                            delay={0.3 + ri * 0.06 + ci * 0.03}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  {TOPICS.map((t, i) => (
                    <FadeIn key={t.name} delay={0.5 + i * 0.06}>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: t.hex }}
                        />
                        {t.name}
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="h-px bg-gray-100 mb-6" />

          <FadeIn delay={0.2}>
            <div className="mb-6">
              <div className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
                Reflection
              </div>
              <div className="text-sm text-gray-500 mb-1">You&apos;ve reflected on</div>
              <div className="flex items-center gap-2 mb-1">
                <UpArrow />
                <span className="text-4xl font-bold text-gray-900 leading-none">
                  {insightStats.reflectionCount}
                </span>
                <span className="text-lg text-gray-500">moments</span>
              </div>
              <div className="text-xs text-gray-400 mb-5">
                December: {insightStats.reflectionPrev} moments
              </div>

              {reflections.map((r, i) => (
                <ReflectionBar key={r.rank} {...r} delay={0.3 + i * 0.08} />
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default Insight;
