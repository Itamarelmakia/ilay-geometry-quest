import React from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function LevelComplete({ correctCount, totalCount, xpEarned, newBadges, levelName }) {
  const percentage = Math.round((correctCount / totalCount) * 100);
  const stars = percentage === 100 ? 3 : percentage >= 75 ? 2 : percentage >= 50 ? 1 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-8 px-4"
    >
      {/* Celebration */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-6xl mb-4"
      >
        {stars >= 2 ? "🎉" : stars === 1 ? "👏" : "💪"}
      </motion.div>

      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
        {stars >= 2 ? "מדהים!" : stars === 1 ? "כל הכבוד!" : "נסיון טוב!"}
      </h1>
      <p className="text-gray-500 font-medium mb-6">סיימת את שלב "{levelName}"</p>

      {/* Stars */}
      <div className="flex gap-3 mb-6">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + i * 0.2, type: "spring" }}
          >
            <Star
              className={`w-12 h-12 ${i < stars ? "text-amber-400 fill-amber-400 drop-shadow-lg" : "text-gray-200"}`}
            />
          </motion.div>
        ))}
      </div>

      {/* Score */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-purple-100 w-full max-w-sm mb-6">
        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-indigo-500 to-purple-600 mb-1">
          {percentage}%
        </div>
        <p className="text-gray-500 text-sm font-medium">
          {correctCount} תשובות נכונות מתוך {totalCount}
        </p>
      </div>

      {/* XP Earned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-2 bg-gradient-to-l from-amber-100 to-yellow-50 border border-amber-200 rounded-2xl px-6 py-3 mb-4"
      >
        <Sparkles className="w-6 h-6 text-amber-500" />
        <span className="font-extrabold text-amber-700 text-xl">+{xpEarned} XP</span>
      </motion.div>

      {/* New badges */}
      {newBadges && newBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-6"
        >
          <p className="text-sm font-bold text-purple-600 mb-2">🏅 תגים חדשים!</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {newBadges.map(b => (
              <div key={b.name} className="bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 flex items-center gap-1">
                <span className="text-lg">{b.emoji}</span>
                <span className="text-sm font-bold text-purple-700">{b.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Back to map */}
      <Link to={createPageUrl("Map")} className="w-full max-w-sm">
        <Button className="w-full h-14 rounded-2xl bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg shadow-xl">
          <ArrowRight className="w-5 h-5 ml-2" />
          חזרה למפה
        </Button>
      </Link>
    </motion.div>
  );
}