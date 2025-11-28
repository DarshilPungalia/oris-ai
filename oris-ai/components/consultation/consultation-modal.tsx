"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader } from "lucide-react";
import { FullConsultationRoom } from "@/components/livekit/full-consultation-room";
import { useConsultation } from "@/hooks/use-consultation";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [patientName, setPatientName] = useState("");
  const [showNameInput, setShowNameInput] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  const {
    isConnecting,
    isConnected,
    error,
    connect,
    disconnect,
    wsUrl,
    token,
  } = useConsultation({
    onConnected: () => {
      console.log("Connected to Oris AI consultation");
      setIsInitializing(false);
    },
    onError: (error) => {
      console.error("Consultation connection error:", error);
      setIsInitializing(false);
    },
  });

  const handleStartConsultation = async () => {
    if (!patientName.trim()) return;

    setIsInitializing(true);
    setShowNameInput(false);

    try {
      await connect(patientName);
    } catch (error) {
      console.error("Failed to start consultation:", error);
      setShowNameInput(true);
      setIsInitializing(false);
    }
  };

  const handleClose = () => {
    disconnect();
    setShowNameInput(true);
    setPatientName("");
    setIsInitializing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/20"
        >
          {/* Header */}
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
            <div className="relative flex items-center justify-between p-6">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  AI Dental Consultation
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Connect with Daela, your intelligent AI dental assistant
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="p-3 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 text-red-500"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/30">
            {showNameInput && (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center space-y-8 max-w-md w-full">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", damping: 15 }}
                    className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-300/20 to-purple-300/20 backdrop-blur-sm"></div>
                    <span className="relative text-white text-4xl font-bold tracking-wider">
                      D
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-3">
                      Welcome to Oris AI
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                      Please enter your name to start your personalized dental
                      consultation with our advanced AI assistant.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleStartConsultation();
                        }}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm focus:border-blue-500 focus:outline-none transition-all duration-200 text-lg font-medium placeholder:text-slate-400"
                        disabled={isInitializing}
                        autoFocus
                      />
                    </div>

                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleStartConsultation}
                      disabled={!patientName.trim() || isInitializing}
                      className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:cursor-not-allowed text-lg relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        {isInitializing ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>Connecting to Daela...</span>
                          </>
                        ) : (
                          "Start Consultation"
                        )}
                      </div>
                    </motion.button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span>Secure & Private</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span>AI-Powered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span>24/7 Available</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Your consultation is encrypted and confidential
                    </p>
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl text-red-700 dark:text-red-400 text-sm backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <X className="w-4 h-4" />
                        <span className="font-medium">Connection Failed</span>
                      </div>
                      <p>{error}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {(isConnecting || isInitializing) && !showNameInput && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-2xl"
                  >
                    <Loader className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-2">
                      Connecting to Daela AI...
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Setting up your secure, encrypted consultation room
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isConnected && wsUrl && token && (
              <FullConsultationRoom
                wsUrl={wsUrl}
                token={token}
                onClose={handleClose}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
