import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Map, User } from "lucide-react";

const tabs = [
  { name: "Map", label: "מפה", icon: Map },
  { name: "Profile", label: "פרופיל", icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <div dir="rtl" className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto bg-white/90 backdrop-blur-xl border-t border-purple-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-around h-16 px-4">
        {tabs.map((tab) => {
          const isActive = location.pathname.includes(tab.name);
          return (
            <Link
              key={tab.name}
              to={createPageUrl(tab.name)}
              className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-b from-indigo-50 to-purple-50 text-indigo-600 scale-105"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <tab.icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className={`text-xs font-bold ${isActive ? "text-indigo-600" : ""}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}