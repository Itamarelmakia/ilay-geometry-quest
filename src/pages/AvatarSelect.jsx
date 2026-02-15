import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { AVATARS } from "../components/game/gameData";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

export default function AvatarSelect() {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        navigate(createPageUrl("Auth"));
        return;
      }
      const user = await base44.auth.me();
      setUsername(user.full_name || "");
      // Check if already has progress with avatar
      const progress = await base44.entities.UserProgress.filter({ created_by: user.email });
      if (progress.length > 0 && progress[0].avatar_id !== undefined && progress[0].avatar_id !== null) {
        navigate(createPageUrl("Map"));
      }
    };
    init();
  }, []);

  const handleConfirm = async () => {
    if (selected === null) return;
    setSaving(true);
    const user = await base44.auth.me();
    const existing = await base44.entities.UserProgress.filter({ created_by: user.email });
    if (existing.length > 0) {
      await base44.entities.UserProgress.update(existing[0].id, {
        avatar_id: selected,
        username: username || user.full_name || "שחקן",
      });
    } else {
      await base44.entities.UserProgress.create({
        avatar_id: selected,
        username: username || user.full_name || "שחקן",
        xp: 0,
        current_level: 1,
        completed_levels: [],
        badges: [],
        streak_days: 0,
      });
    }
    navigate(createPageUrl("Map"));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center p-6 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-800 mb-2">בחרו דמות! 🎮</h1>
          <p className="text-gray-500 font-medium">מי תהיו בהרפתקה?</p>
        </div>

        {/* Username */}
        <div className="mb-6">
          <label className="text-sm font-bold text-gray-600 block mb-2">שם המשתמש שלכם</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="הכניסו שם..."
            className="w-full h-12 rounded-2xl bg-white/70 backdrop-blur border-2 border-purple-100 px-4 font-bold text-gray-700 focus:outline-none focus:border-indigo-400 transition-colors text-right"
          />
        </div>

        {/* Avatar grid */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {AVATARS.map((av) => (
            <motion.button
              key={av.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelected(av.id)}
              className={`relative aspect-square rounded-2xl bg-gradient-to-br ${av.bg} flex items-center justify-center text-3xl shadow-md transition-all duration-200 ${
                selected === av.id
                  ? "ring-4 ring-indigo-500 ring-offset-2 scale-105"
                  : "hover:shadow-lg"
              }`}
            >
              {av.emoji}
              {selected === av.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -left-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Preview */}
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${AVATARS[selected].bg} flex items-center justify-center text-4xl shadow-xl border-4 border-white`}>
              {AVATARS[selected].emoji}
            </div>
            <p className="font-bold text-gray-700 mt-2">{username || "שחקן"}</p>
          </motion.div>
        )}

        {/* Confirm */}
        <Button
          onClick={handleConfirm}
          disabled={selected === null || saving}
          className="w-full h-14 rounded-2xl bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg shadow-xl disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {saving ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Sparkles className="w-5 h-5" />
            </motion.div>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              יאללה, מתחילים!
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}