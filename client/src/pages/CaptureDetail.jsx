import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../utils/apiBase.js";

export default function CaptureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capture, setCapture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCapture = async () => {
      try {
        setErrorMessage("");
        const response = await fetch(`${API_BASE}/api/captures/${id}`);
        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(
            data?.error || `Request failed (${response.status})`,
          );
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (errorMessage) return <div className="p-6 text-red-600">{errorMessage}</div>;
  if (!capture) return <div className="p-6">Capture not found</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500"
      >
        ←Back
      </button>
      <h1 className="text-xl font-bold mb-2">{capture.title}</h1>
      <p className="text-sm text-gray-400 mb-4">
        {new Date(capture.createdAt).toLocaleDateString("en-US")}
      </p>
      <p className="text-gray-700 mb-4">{capture.content}</p>
      {capture.summary && (
        <div className="bg-gray-50 rounded-lg p-3 mb4">
          <p className="text-sm text-gray-600">{capture.summary}</p>
        </div>
      )}
      {capture.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {capture.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
