import { API_BASE } from "../utils/apiBase.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [captures, setCaptures] = useState([]);
  const [tagFreq, setTagFreq] = useState([]);
  const [loading, setLoading] = useState(true);
  const PAGE_BG = "#f8f8f6";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [capRes, tagRes] = await Promise.all([
          fetch(`${API_BASE}/api/captures`),
          fetch(`${API_BASE}/api/insights/tag-frequency`),
        ]);
        const capData = await capRes.json();
        const tagData = await tagRes.json();
        if (capData.success) setCaptures(capData.data);
        if (tagData.success) setTagFreq(tagData.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = captures.filter(
    (c) => new Date(c.createdAt) > weekAgo,
  ).length;

  const oldestCapture =
    captures.length > 0
      ? new Date(
          Math.min(...captures.map((c) => new Date(c.createdAt).getTime())),
        )
      : now;
  const daysOfBecoming = Math.max(
    1,
    Math.floor((now - oldestCapture) / (1000 * 60 * 60 * 24)),
  );

  const totalTags = new Set(captures.flatMap((c) => c.tags || [])).size;
  const ideaCount = captures.filter((c) => c.type === "idea").length;
  const linkCount = captures.filter((c) => c.type === "link").length;

  const GRADIENT =
    "linear-gradient(160deg, #f0edf8 0%, #edf4fb 35%, #e8f5ee 65%, #fdf5e6 100%)";

  const TAG_COLORS = ["#7B6BB5", "#2D8A6E", "#4A7FB5", "#C15B78", "#B8860B"];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          fontFamily:
            "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: PAGE_BG,
      }}
    >
      {/* Header with gradient */}
      <div
        className="relative overflow-hidden"
        style={{
          background: GRADIENT,
          borderRadius: "0 0 28px 28px",
          padding: "48px 24px 40px",
        }}
      >
        <div className="flex justify-between items-start mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors bg-transparent border-0 p-0 cursor-pointer"
          >
            &larr; Back
          </button>
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(96,165,250,0.15)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"
                fill="#60a5fa"
              />
            </svg>
          </div>
          <div>
            <h1
              className="font-bold text-gray-900"
              style={{ fontSize: 24, margin: 0, letterSpacing: "-0.5px" }}
            >
              Sumin
            </h1>
            <p className="text-sm text-gray-500 m-0 mt-0.5">
              {daysOfBecoming} days of becoming
            </p>
          </div>
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-3 gap-3">
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(255,255,255,0.6)" }}
          >
            <p
              className="font-bold text-gray-900"
              style={{ fontSize: 28, margin: 0, lineHeight: 1 }}
            >
              {captures.length}
            </p>
            <p className="text-xs text-gray-500 mt-1 m-0">Captures</p>
          </div>
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(255,255,255,0.6)" }}
          >
            <p
              className="font-bold text-gray-900"
              style={{ fontSize: 28, margin: 0, lineHeight: 1 }}
            >
              {totalTags}
            </p>
            <p className="text-xs text-gray-500 mt-1 m-0">Tags</p>
          </div>
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(255,255,255,0.6)" }}
          >
            <p
              className="font-bold"
              style={{ fontSize: 28, margin: 0, lineHeight: 1, color: "#2D8A6E" }}
            >
              {thisWeek}
            </p>
            <p className="text-xs text-gray-500 mt-1 m-0">This week</p>
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{
            // 하단 경계를 자연스럽게 지우기 위해 배경색(PAGE_BG)으로 끝나는 페이드를 길게 깐다.
            background: `linear-gradient(180deg, rgba(248,248,246,0) 0%, rgba(248,248,246,0.58) 58%, ${PAGE_BG} 100%)`,
            transform: "translateY(45%)",
            filter: "blur(18px)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
          style={{
            background: `linear-gradient(180deg, rgba(248,248,246,0) 0%, ${PAGE_BG} 92%)`,
          }}
        />
      </div>

      {/* Content area */}
      <div className="px-5 mt-1">
        {/* Capture breakdown */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <h3
            className="font-semibold text-gray-900 mb-4"
            style={{ fontSize: 15, margin: 0, marginBottom: 14 }}
          >
            Capture breakdown
          </h3>
          <div className="flex gap-3">
            {/* Idea bar */}
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">Ideas</span>
                <span className="text-xs font-medium text-gray-700">
                  {ideaCount}
                </span>
              </div>
              <div
                className="h-2 rounded-full"
                style={{ background: "#EEEDFE" }}
              >
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: captures.length
                      ? `${(ideaCount / captures.length) * 100}%`
                      : "0%",
                    background: "#7B6BB5",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
            {/* Link bar */}
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">Links</span>
                <span className="text-xs font-medium text-gray-700">
                  {linkCount}
                </span>
              </div>
              <div
                className="h-2 rounded-full"
                style={{ background: "#E1F5EE" }}
              >
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: captures.length
                      ? `${(linkCount / captures.length) * 100}%`
                      : "0%",
                    background: "#2D8A6E",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top interests */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <h3
            className="font-semibold text-gray-900"
            style={{ fontSize: 15, margin: 0, marginBottom: 14 }}
          >
            Top interests
          </h3>
          <div className="flex flex-col gap-2.5">
            {tagFreq.map((t, i) => (
              <div key={t._id} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: TAG_COLORS[i % TAG_COLORS.length] }}
                />
                <span className="text-sm text-gray-700 flex-1">{t._id}</span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: `${TAG_COLORS[i % TAG_COLORS.length]}15`,
                    color: TAG_COLORS[i % TAG_COLORS.length],
                  }}
                >
                  {t.count}
                </span>
              </div>
            ))}
            {tagFreq.length === 0 && (
              <p className="text-sm text-gray-400">
                Save more captures to see your interests.
              </p>
            )}
          </div>
        </div>

        {/* Journey */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <h3
            className="font-semibold text-gray-900"
            style={{ fontSize: 15, margin: 0, marginBottom: 14 }}
          >
            Your journey
          </h3>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "#EEEDFE" }}
            >
              <span style={{ fontSize: 20 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="#7B6BB5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-700 m-0">
                <span className="font-semibold">{daysOfBecoming} days</span>{" "}
                since your first capture
              </p>
              <p className="text-xs text-gray-400 m-0 mt-0.5">
                Started{" "}
                {oldestCapture.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
