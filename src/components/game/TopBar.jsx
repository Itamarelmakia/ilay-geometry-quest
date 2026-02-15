import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { AVATARS } from "./gameData";
import { Sparkles } from "lucide-react";

export default function TopBar({ progress }) {
  const avatar = AVATARS[progress?.avatar_id ?? 0];

  return (
    <div dir="rtl" className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="h-full bg-white/80 backdrop-blur-xl border-b border-purple-100 shadow-sm px-4 flex items-center justify-between max-w-lg mx-auto">
        {/* App name */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <span className="text-white text-lg">📐</span>
          </div>
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-indigo-600 to-purple-600 text-lg tracking-tight">
            GeoQuest
          </span>
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gradient-to-l from-amber-100 to-yellow-50 border border-amber-200 rounded-full px-3 py-1.5 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-amber-700 text-sm">{progress?.xp ?? 0}</span>
            <span className="text-amber-500 text-xs font-medium">XP</span>
          </div>

          {/* Profile avatar */}
          <Link to={createPageUrl("Profile")}>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatar?.bg || "from-gray-300 to-gray-400"} flex items-center justify-center text-xl shadow-md border-2 border-white hover:scale-110 transition-transform cursor-pointer`}>
              {avatar?.emoji || "😊"}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}