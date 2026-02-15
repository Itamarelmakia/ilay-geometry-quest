import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { getLevelById, BADGES, calculatePlayerLevel } from "../components/game/gameData";
import QuestionCard from "../components/game/QuestionCard";
import LevelComplete from "../components/game/LevelComplete";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LevelPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const levelId = urlParams.get("id");
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [newBadges, setNewBadges] = useState([]);

  const level = getLevelById(levelId);

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

  if (!level) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-6">
        <p className="text-gray-500 font-bold mb-4">שלב לא נמצא 😕</p>
        <Link to={createPageUrl("Map")}>
          <Button className="rounded-2xl">חזרה למפה</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Sparkles className="w-10 h-10 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  const handleAnswer = async (isCorrect) => {
    const newCorrect = isCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(newCorrect);

    if (currentQ + 1 >= level.questions.length) {
      // Level complete - calculate rewards
      const percentage = newCorrect / level.questions.length;
      const earned = Math.round(level.xpReward * percentage);
      setXpEarned(earned);

      // Update progress
      const newXp = (progress.xp || 0) + earned;
      const newCompleted = [...(progress.completed_levels || [])];
      if (!newCompleted.includes(levelId)) {
        newCompleted.push(levelId);
      }

      // Check for new badges
      const currentBadges = progress.badges || [];
      const earnedBadges = [];

      if (!currentBadges.includes("first_step")) {
        earnedBadges.push("first_step");
      }
      if (percentage === 1 && !currentBadges.includes("perfect")) {
        earnedBadges.push("perfect");
      }
      if (newXp >= 100 && !currentBadges.includes("xp_100")) {
        earnedBadges.push("xp_100");
      }
      if (newXp >= 500 && !currentBadges.includes("xp_500")) {
        earnedBadges.push("xp_500");
      }

      // World completion badges
      const worldBadgeMap = { w1: "world_1_done", w2: "world_2_done", w3: "world_3_done", w4: "world_4_done" };
      const worldId = level.worldId;
      const badgeKey = worldBadgeMap[worldId];
      if (badgeKey && !currentBadges.includes(badgeKey)) {
        // Check if all levels in this world are now done
        const { WORLDS } = await import("../components/game/gameData");
        const world = WORLDS.find(w => w.id === worldId);
        if (world && world.levels.every(l => newCompleted.includes(l.id))) {
          earnedBadges.push(badgeKey);
        }
      }

      const allBadges = [...currentBadges, ...earnedBadges];

      setNewBadges(earnedBadges.map(id => BADGES[id]).filter(Boolean));

      await base44.entities.UserProgress.update(progress.id, {
        xp: newXp,
        current_level: calculatePlayerLevel(newXp),
        completed_levels: newCompleted,
        badges: allBadges,
        last_played: new Date().toISOString().split("T")[0],
      });

      setFinished(true);
    } else {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-purple-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{level.emoji}</span>
            <div>
              <h2 className="font-extrabold text-gray-800">{level.name}</h2>
              <p className="text-xs text-gray-400 font-medium">{level.worldName}</p>
            </div>
          </div>
          <Link to={createPageUrl("Map")}>
            <Button variant="ghost" size="sm" className="rounded-xl text-gray-400">
              <ArrowRight className="w-4 h-4 ml-1" />
              יציאה
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 pt-6">
        <AnimatePresence mode="wait">
          {finished ? (
            <LevelComplete
              key="complete"
              correctCount={correctCount}
              totalCount={level.questions.length}
              xpEarned={xpEarned}
              newBadges={newBadges}
              levelName={level.name}
            />
          ) : (
            <QuestionCard
              key={currentQ}
              question={level.questions[currentQ]}
              index={currentQ}
              total={level.questions.length}
              onAnswer={handleAnswer}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}