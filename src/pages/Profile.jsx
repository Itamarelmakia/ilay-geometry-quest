import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { AVATARS, BADGES, WORLDS, calculatePlayerLevel, xpForNextLevel } from "../components/game/gameData";
import TopBar from "../components/game/TopBar";
import BottomNav from "../components/game/BottomNav";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Star, Target, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) { navigate(createPageUrl("Auth")); return; }
      const user = await base44.auth.me();
      const records = await base44.entities.UserProgress.filter({ created_by: user.email });
      if (records.length === 0) { navigate(createPageUrl("AvatarSelect")); return; }
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

  const avatar = AVATARS[progress?.avatar_id ?? 0];
  const xp = progress?.xp || 0;
  const level = calculatePlayerLevel(xp);
  const nextXp = xpForNextLevel(xp);
  const xpProgress = (xp / nextXp) * 100;
  const completedLevels = progress?.completed_levels || [];
  const badges = progress?.badges || [];
  const totalLevels = WORLDS.reduce((sum, w) => sum + w.levels.length, 0);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <TopBar progress={progress} />

      <div className="pt-20 pb-24 px-4 max-w-lg mx-auto">
        {/* Avatar & Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${avatar?.bg} flex items-center justify-center text-5xl shadow-xl border-4 border-white`}>
            {avatar?.emoji}
          </div>
          <h1 className="text-2xl font-black text-gray-800 mt-3">{progress?.username || "שחקן"}</h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-amber-600">רמה {level}</span>
          </div>
        </motion.div>

        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-5 shadow-lg border border-purple-100 mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-600">נקודות ניסיון</span>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-extrabold text-amber-600">{xp} XP</span>
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(xpProgress, 100)}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-l from-amber-400 to-yellow-400 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-center">{xp} / {nextXp} XP לרמה הבאה</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-5"
        >
          <StatCard icon={<Target className="w-5 h-5 text-indigo-500" />} value={completedLevels.length} label="שלבים" bgColor="bg-indigo-50" />
          <StatCard icon={<Trophy className="w-5 h-5 text-amber-500" />} value={badges.length} label="תגים" bgColor="bg-amber-50" />
          <StatCard icon={<Star className="w-5 h-5 text-green-500" />} value={`${Math.round((completedLevels.length / totalLevels) * 100)}%`} label="השלמה" bgColor="bg-green-50" />
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-5 shadow-lg border border-purple-100 mb-5"
        >
          <h2 className="font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            התגים שלי
          </h2>
          {badges.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">עדיין אין תגים - שחקו כדי לזכות! 🎮</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {badges.map(id => {
                const badge = BADGES[id];
                if (!badge) return null;
                return (
                  <motion.div
                    key={id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-3 text-center"
                  >
                    <div className="text-3xl mb-1">{badge.emoji}</div>
                    <p className="font-bold text-gray-700 text-sm">{badge.name}</p>
                    <p className="text-xs text-gray-400">{badge.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Locked badges preview */}
          {badges.length < Object.keys(BADGES).length && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2 font-medium">תגים נעולים:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(BADGES)
                  .filter(([id]) => !badges.includes(id))
                  .map(([id, badge]) => (
                    <div key={id} className="bg-gray-100 rounded-xl px-3 py-1.5 flex items-center gap-1 opacity-50">
                      <span className="text-sm grayscale">🔒</span>
                      <span className="text-xs text-gray-500 font-medium">{badge.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={() => base44.auth.logout(createPageUrl("Auth"))}
          className="w-full rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 font-medium"
        >
          <LogOut className="w-4 h-4 ml-2" />
          התנתקות
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}

function StatCard({ icon, value, label, bgColor }) {
  return (
    <div className={`${bgColor} rounded-2xl p-4 text-center border border-white`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="font-black text-gray-800 text-xl">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </div>
  );
}