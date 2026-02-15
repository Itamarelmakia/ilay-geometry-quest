import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { WORLDS } from "../components/game/gameData";
import TopBar from "../components/game/TopBar";
import BottomNav from "../components/game/BottomNav";
import WorldCard from "../components/game/WorldCard";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function MapPage() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        navigate(createPageUrl("Auth"));
        return;
      }
      const user = await base44.auth.me();
      const records = await base44.entities.UserProgress.filter({ created_by: user.email });
      if (records.length === 0 || records[0].avatar_id === undefined || records[0].avatar_id === null) {
        navigate(createPageUrl("AvatarSelect"));
        return;
      }
      setProgress(records[0]);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Sparkles className="w-10 h-10 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  const completedLevels = progress?.completed_levels || [];

  // World unlock logic: first world always unlocked, rest unlock when all levels in previous world complete
  const isWorldUnlocked = (worldIndex) => {
    if (worldIndex === 0) return true;
    const prevWorld = WORLDS[worldIndex - 1];
    return prevWorld.levels.every(l => completedLevels.includes(l.id));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <TopBar progress={progress} />

      <div className="pt-20 pb-24 px-4 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-black text-gray-800">🗺️ מפת ההרפתקה</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">בחרו עולם והתחילו לשחק!</p>
        </motion.div>

        {/* World cards */}
        <div className="space-y-5">
          {WORLDS.map((world, i) => (
            <WorldCard
              key={world.id}
              world={world}
              levels={world.levels}
              completedLevels={completedLevels}
              isUnlocked={isWorldUnlocked(i)}
              index={i}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}