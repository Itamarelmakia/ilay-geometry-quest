import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuestionCard({ question, index, total, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSelect = (optIndex) => {
    if (showResult) return;
    setSelected(optIndex);
    setShowResult(true);
    setTimeout(() => {
      onAnswer(optIndex === question.correct);
    }, 1200);
  };

  const isCorrect = selected === question.correct;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full"
    >
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index
                ? "w-8 bg-gradient-to-l from-indigo-500 to-purple-500"
                : i < index
                ? "w-2 bg-green-400"
                : "w-2 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Question number */}
      <div className="text-center mb-2">
        <span className="text-sm font-bold text-indigo-400">שאלה {index + 1} מתוך {total}</span>
      </div>

      {/* Question text */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-purple-100 mb-6">
        <h2 className="text-xl font-extrabold text-gray-800 text-center leading-relaxed">
          {question.q}
        </h2>
        {question.hint && !showHint && !showResult && (
          <button
            onClick={() => setShowHint(true)}
            className="flex items-center gap-1 mx-auto mt-3 text-amber-500 text-sm font-medium hover:text-amber-600 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            רמז
          </button>
        )}
        {showHint && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-3 text-amber-600 bg-amber-50 rounded-xl px-4 py-2 text-sm font-medium"
          >
            💡 {question.hint}
          </motion.p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((opt, i) => {
          let style = "bg-white border-2 border-gray-100 hover:border-indigo-300 hover:bg-indigo-50";
          if (showResult) {
            if (i === question.correct) {
              style = "bg-green-50 border-2 border-green-400 ring-2 ring-green-200";
            } else if (i === selected && !isCorrect) {
              style = "bg-red-50 border-2 border-red-400 ring-2 ring-red-200";
            } else {
              style = "bg-gray-50 border-2 border-gray-100 opacity-50";
            }
          } else if (selected === i) {
            style = "bg-indigo-50 border-2 border-indigo-400";
          }

          return (
            <motion.button
              key={i}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className={`w-full rounded-2xl p-4 text-right font-bold text-gray-700 shadow-sm transition-all duration-200 flex items-center justify-between ${style}`}
            >
              <span className="text-lg">{opt}</span>
              {showResult && i === question.correct && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              {showResult && i === selected && !isCorrect && (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-center p-4 rounded-2xl font-bold text-lg ${
              isCorrect
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isCorrect ? "🎉 מעולה! תשובה נכונה!" : "❌ אופס! לא נכון..."}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}