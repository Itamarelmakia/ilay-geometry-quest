import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Lock, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function WorldCard({ world, levels, completedLevels, isUnlocked, index }) {
  const completedInWorld = levels.filter(l => completedLevels.includes(l.id)).length;
  const allDone = completedInWorld === levels.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="w-full"
    >
      <div className={`rounded-3xl p-5 ${world.bgColor} ${world.borderColor} border-2 ${!isUnlocked ? "opacity-50 grayscale" : ""} transition-all`}>
        {/* World Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${world.color} flex items-center justify-center text-3xl shadow-lg`}>
              {world.emoji}
            </div>
            <div>
              <h3 className="font-extrabold text-gray-800 text-lg">{world.name}</h3>
              <p className="text-sm text-gray-500">{world.desc}</p>
            </div>
          </div>
          {allDone && (
            <div className="bg-green-100 text-green-600 rounded-full px-3 py-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-bold">הושלם!</span>
            </div>
          )}
        </div>

        {/* Levels */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {levels.map((level, li) => {
            const isDone = completedLevels.includes(level.id);
            const prevDone = li === 0 || completedLevels.includes(levels[li - 1].id);
            const canPlay = isUnlocked && (li === 0 || prevDone);

            return (
              <LevelNode
                key={level.id}
                level={level}
                isDone={isDone}
                canPlay={canPlay}
                worldColor={world.color}
              />
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-white/60 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-l ${world.color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${(completedInWorld / levels.length) * 100}%` }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center font-medium">
          {completedInWorld} / {levels.length} שלבים
        </p>
      </div>
    </motion.div>
  );
}

function LevelNode({ level, isDone, canPlay, worldColor }) {
  const content = (
    <motion.div
      whileHover={canPlay ? { scale: 1.1 } : {}}
      whileTap={canPlay ? { scale: 0.95 } : {}}
      className={`flex flex-col items-center gap-1.5 min-w-[80px] ${!canPlay && !isDone ? "opacity-40" : ""}`}
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 transition-all ${
          isDone
            ? "bg-gradient-to-br from-green-400 to-emerald-500 border-green-300"
            : canPlay
            ? `bg-gradient-to-br ${worldColor} border-white/50 animate-pulse`
            : "bg-gray-200 border-gray-300"
        }`}
      >
        {isDone ? (
          <Star className="w-7 h-7 text-white fill-white" />
        ) : canPlay ? (
          <span>{level.emoji}</span>
        ) : (
          <Lock className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <span className={`text-xs font-bold ${isDone ? "text-green-600" : canPlay ? "text-gray-700" : "text-gray-400"}`}>
        {level.name}
      </span>
      <span className="text-[10px] text-amber-600 font-medium">+{level.xpReward} XP</span>
    </motion.div>
  );

  if (canPlay && !isDone) {
    return (
      <Link to={createPageUrl(`Level?id=${level.id}`)}>
        {content}
      </Link>
    );
  }
  return content;
}