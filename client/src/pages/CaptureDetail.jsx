import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../utils/apiBase.js";

/** Single capture — `GET /api/captures/:id`. */
export default function CaptureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capture, setCapture] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCapture = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const response = await fetch(`${API_BASE}/api/captures/${id}`);
        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(data?.error || `Request failed (${response.status})`);
        }

        if (data?.success && data?.data) {
          setCapture(data.data);
        } else {
          throw new Error(data?.error || "Invalid capture response.");
        }
      } catch (error) {
        console.error(error);
        setCapture(null);
        setErrorMessage(error.message || "Failed to load capture.");
      } finally {
        setLoading(false);
      }
    };
    fetchCapture();
  }, [id]);

  //similar captures
  useEffect(() => {
    if (!id) return;
    const fetchSimilar = async () => {
      try {
        setSimilar([]);
        const res = await fetch(`${API_BASE}/api/captures/similar/${id}`);
        const contentType = res.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await res.json()
          : null;

        // 백엔드가 404를 반환해도 "유사 캡처 없음"일 수 있어서 조용히 무시한다.
        if (res.status === 404) {
          setSimilar([]);
          return;
        }

        if (!res.ok) {
          throw new Error(data?.error || `Request failed (${res.status})`);
        }

        if (data.success && data.data?.length > 0) {
          setSimilar(data.data.slice(0, 1));
        }
      } catch (err) {
        console.error("Similar fetch failed:", err);
      }
    };
    fetchSimilar();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }
  if (errorMessage)
    return (
      <div className="p-6">
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
          {errorMessage}
        </p>
      </div>
    );
  if (!capture) return <div className="p-6">Capture not found</div>;

  const isLink = capture.type === "link";
  const dateStr = new Date(capture.createdAt).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="min-h-dvh bg-ae-bg"
      style={{
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div className="max-w-lg mx-auto px-4 pt-5 pb-24">
        <div className="bg-ae-surface rounded-2xl shadow-ae-card p-5">
        {/*Back button*/}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-5 cursor-pointer bg-transparent border-0 p-0"
        >
          &larr; Back
        </button>
        {/*Badge + link*/}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{
              background: isLink ? "#E1F5EE" : "#E6F1FB",
              color: isLink ? " #085041" : "#0C4467",
            }}
          >
            {isLink ? "Link" : "Idea"}
          </span>

          {isLink && capture.url && (
            <a
              href={capture.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-700 transition-colors ml-auto no-underline"
            >
              Open original {"\u2197"}
            </a>
          )}
        </div>

        {/*Title +Date*/}
        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-1">
          {capture.title}
        </h1>
        <p className="text-sm text-gray-400 mb-6">{dateStr}</p>

        {/*Idea: Content */}
        {!isLink && capture.content && (
          <div className="mb-6">
            <p className="text-base text-gray-700 leading-relaxed">
              {capture.content}
            </p>
          </div>
        )}

        {/*Link: Summary*/}
        {isLink && capture.summary && (
          <div
            className="mb-6 py-4 px-4 rounded-xl"
            style={{ background: "#E1F5EE", boxShadow: "var(--ae-card-shadow)" }}
          >
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "#085041", letterSpacing: "0.5px" }}
            >
              AI SUMMARY
            </p>
            <p
              className="text-sm leading-relaxed m-0"
              style={{ color: "#04342C" }}
            >
              {capture.summary}
            </p>
          </div>
        )}

        {/*Tags*/}
        {capture.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {capture.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-500 px-3 py-1 rounded-full bg-gray-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/*Link: My Reflection*/}
        {isLink && (
          <div className="mb-6 mt-ae-section">
            <p className="text-xs text-gray-400 font-medium mb-2 tracking-wide">
              MY REFLECTION
            </p>
            {capture.note ? (
              <p className="text-sm text-gray-700 leading-relaxed">
                {capture.note}
              </p>
            ) : (
              <p className="text-sm text-gray-300 italic">No reflection yet</p>
            )}
          </div>
        )}

        {/*Similar captures*/}
        {similar.length > 0 && (
          <div className="mt-ae-section">
            <p className="text-xs text-gray-400 font-medium mb-2 tracking-wide">
              SIMILAR NOTES
            </p>
            <button
              onClick={() => navigate(`/capture/${similar[0]._id}`)}
              className="w-full text-left rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-colors bg-ae-surface shadow-ae-card border-0"
            >
              <p className="text-sm font-medium text-gray-800 m-0 mb-0.5">
                {similar[0].title}
              </p>
              <p className="text-xs text-gray-400 m-0">
                {new Date(similar[0].createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
