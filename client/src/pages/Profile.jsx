import { API_BASE } from "../utils/apiBase.js";
import { useState, useEffect } from "react";

export default function Profile() {
  const [stats, setStats] = useState({ captures: 0, tags: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/captures`);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const captures = data.data;
          const allTags = new Set(captures.flatMap((c) => c.tags || []));
          setStats({ captures: captures.length, tags: allTags.size });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div
      className="min-h-screen px-5 pt-5 pt-6 pb-20"
      style={{ fontFamily: "'Pretendard', -apple-system, sans-serif" }}
    >
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* 통계 데이터 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-5 bg-white rounded-2xl border border-[#E8E6E1] text-center">
          <p className="text-3xl font-bold">{stats.captures}</p>
          <p className="text-sm text-gray-500 mt-1">Captures</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-[#E8E6E1] text-center">
          <p className="text-3xl font-bold">{stats.tags}</p>
          <p className="text-sm text-gray-500 mt-1">Tags</p>
        </div>
      </div>
    </div>
  );
}
