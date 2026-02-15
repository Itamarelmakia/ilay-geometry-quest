import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles, LogIn } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const user = await base44.auth.me();
        // Check if they have a UserProgress record
        const progress = await base44.entities.UserProgress.filter({ created_by: user.email });
        if (progress.length > 0 && progress[0].avatar_id !== undefined && progress[0].avatar_id !== null) {
          navigate(createPageUrl("Map"));
        } else if (progress.length > 0) {
          navigate(createPageUrl("AvatarSelect"));
        } else {
          navigate(createPageUrl("AvatarSelect"));
        }
      }
      setLoading(false);
    };
    check();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Sparkles className="w-10 h-10 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-6">
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-20 right-10 text-5xl opacity-30">🔷</motion.div>
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-40 left-10 text-4xl opacity-30">🔺</motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-40 right-20 text-5xl opacity-30">⭕</motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 3.5 }} className="absolute bottom-20 left-16 text-4xl opacity-30">📐</motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl mb-4"
          >
            <span className="text-5xl">📐</span>
          </motion.div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-indigo-600 to-purple-600">
            GeoQuest
          </h1>
          <p className="text-gray-500 font-medium mt-2">הרפתקת גאומטריה לכיתה ו׳</p>
        </div>

        {/* Login Button */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
          <p className="text-center text-gray-600 font-medium mb-6">
            מוכנים להתחיל את ההרפתקה? 🚀
          </p>
          <Button
            onClick={() => base44.auth.redirectToLogin(createPageUrl("AvatarSelect"))}
            className="w-full h-14 rounded-2xl bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg shadow-xl flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            התחברו עכשיו
          </Button>
          <p className="text-center text-xs text-gray-400 mt-4">
            ההתחברות מאובטחת ובטוחה ✅
          </p>
        </div>
      </motion.div>
    </div>
  );
}