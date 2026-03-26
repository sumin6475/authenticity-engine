import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../utils/apiBase.js";

/**
 * Capture: "I thought about..." — Idea / URL 모드, 파싱·저장 API 연동
 * 전체 화면 라우트(하단 네비 없음) — 바텀시트 스타일 UI
 */
const Capture = () => {
  const [mounted, setMounted] = useState(false);
  const [activeMode, setActiveMode] = useState("idea");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const canSave =
    activeMode === "idea"
      ? Boolean(title.trim() && body.trim())
      : Boolean(url.trim());

  const handleParse = async () => {
    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }
    setLoading(true);
    setParsedData(null);

    try {
      const response = await fetch(`${API_BASE}/api/captures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        setParsedData(data.data);
      } else {
        alert(`Parsing failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error parsing URL:", error);
      alert(`Server error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (activeMode === "idea") {
      if (!title.trim() || !body.trim()) {
        alert("Please fill in title and notes");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/captures`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            content: body.trim(),
            type: "idea",
          }),
        });

        const data = await response.json();
        if (data.success) {
          alert("Captured!");
          window.location.href = "/";
          setTitle("");
          setBody("");
        } else {
          alert(`Failed: ${data.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error saving capture:", error);
        alert(`Save failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      //URL 모드 : from-url API 호출
      if (!url.trim()) {
        alert("Please enter a URL");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/captures/from-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: url.trim(),
            note: body.trim() || "",
          }),
        });
        const data = await response.json();
        if (data.success) {
          alert("Captured!");
          window.location.href = "/";
          setUrl("");
          setBody("");
          setParsedData(data.data);
        } else {
          alert(`Failed: ${data.error || "Unknown error"}`);
        }
      } catch (error) {
        alert(`Save failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="min-h-dvh flex flex-col max-w-mobile mx-auto"
      style={{
        background: "#F1F0F6",
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
        className="relative w-full flex-1 flex flex-col min-h-0 overflow-hidden"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* 딤 처리된 상단 (이전 화면 느낌) */}
        <div
          className="shrink-0"
          style={{ background: "rgba(100,100,100,0.95)", height: 110 }}
        />

        {/* 바텀시트 본문 */}
        <div
          className="flex-1 flex flex-col min-h-0 rounded-t-3xl relative -mt-4"
          style={{ background: "#f0f0f0" }}
        >
          <div className="flex justify-between items-center px-5 pt-5 pb-3 shrink-0">
            <Link
              to="/"
              className="w-11 h-11 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: "rgba(200,200,200,0.6)" }}
              aria-label="Back"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave || loading}
              className="w-12 h-12 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: canSave ? "#3b82f6" : "#9ca3af",
                boxShadow: canSave
                  ? "0 4px 16px rgba(59,130,246,0.35)"
                  : "none",
              }}
              aria-label="Save"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </button>
          </div>

          <h1
            className="text-center text-3xl font-bold text-gray-900 px-6 mb-4 shrink-0"
            style={{ fontFamily: "'Pretendard', -apple-system, sans-serif" }}
          >
            I thought about...
          </h1>

          <div
            className="mx-6 mb-4 flex rounded-full p-1 shrink-0"
            style={{ background: "rgba(210,210,210,0.5)" }}
            role="tablist"
            aria-label="Capture mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === "idea"}
              onClick={() => {
                setActiveMode("idea");
                setParsedData(null);
              }}
              className="flex-1 py-2 rounded-full border-none cursor-pointer text-sm font-semibold transition-all duration-200"
              style={{
                background: activeMode === "idea" ? "#fff" : "transparent",
                color: activeMode === "idea" ? "#1a1a1a" : "#888",
                boxShadow:
                  activeMode === "idea" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                fontFamily: "'Pretendard', -apple-system, sans-serif",
              }}
            >
              Idea
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === "url"}
              onClick={() => setActiveMode("url")}
              className="flex-1 py-2 rounded-full border-none cursor-pointer text-sm font-semibold transition-all duration-200"
              style={{
                background: activeMode === "url" ? "#fff" : "transparent",
                color: activeMode === "url" ? "#1a1a1a" : "#888",
                boxShadow:
                  activeMode === "url" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                fontFamily: "'Pretendard', -apple-system, sans-serif",
              }}
            >
              URL
            </button>
          </div>

          <div
            className="mx-5 flex-1 min-h-0 rounded-3xl bg-white flex flex-col overflow-hidden mb-4"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            {activeMode === "idea" ? (
              <div className="flex flex-col flex-1 min-h-0 p-5">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base font-medium text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent pb-3 mb-0 shrink-0"
                  style={{
                    borderBottom: "1px solid #eee",
                    fontFamily: "'Pretendard', -apple-system, sans-serif",
                  }}
                />
                <textarea
                  placeholder="Start writing..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="flex-1 min-h-[120px] text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent resize-none pt-3 leading-relaxed"
                  style={{
                    fontFamily: "'Pretendard', -apple-system, sans-serif",
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col flex-1 min-h-0 p-5 overflow-y-auto">
                <div
                  className="flex items-center gap-2 pb-3 mb-3 shrink-0"
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                  <input
                    type="url"
                    placeholder="Paste a URL..."
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setParsedData(null);
                    }}
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent min-w-0"
                    style={{
                      fontFamily: "'Pretendard', -apple-system, sans-serif",
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Add a note (optional)"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent mb-3 shrink-0"
                  style={{
                    fontFamily: "'Pretendard', -apple-system, sans-serif",
                  }}
                />
                {url.length > 0 && (
                  <div
                    className="rounded-xl p-3 mt-auto shrink-0"
                    style={{ background: "#f8f9fa", border: "1px solid #eee" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#999"
                          strokeWidth="2"
                          aria-hidden
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-700 truncate">
                          {parsedData?.title
                            ? String(parsedData.title)
                            : "Link preview"}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">
                          {parsedData?.siteName || url}
                        </div>
                      </div>
                    </div>
                    {parsedData?.excerpt && (
                      <p className="text-[11px] text-gray-500 mt-2 line-clamp-3 leading-relaxed m-0">
                        {parsedData.excerpt}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mx-5 mb-6 flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="flex-1 flex items-center gap-2 rounded-full px-4 py-3 cursor-pointer border-none hover:bg-gray-200/60 transition-colors text-left"
              style={{ background: "rgba(220,220,220,0.45)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M12 19V5M5 12l7-7" />
                <path d="M15 8c0 0 2 1 2 4" />
              </svg>
              <span
                className="text-sm text-gray-500"
                style={{
                  fontFamily: "'Pretendard', -apple-system, sans-serif",
                }}
              >
                Ask AI
              </span>
            </button>
            <button
              type="button"
              className="w-11 h-11 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-gray-200/60 transition-colors"
              style={{ background: "rgba(220,220,220,0.45)" }}
              aria-label="Add image"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleParse}
              disabled={loading || activeMode !== "url"}
              className="w-11 h-11 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-gray-200/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "rgba(220,220,220,0.45)" }}
              aria-label={loading ? "Parsing URL" : "Parse URL"}
            >
              {loading ? (
                <span className="text-xs text-gray-500">…</span>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Capture;
