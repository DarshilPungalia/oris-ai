"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AudioConsultationRoom } from "@/components/consultation/audio-consultation-room";
import { useConsultation } from "@/hooks/use-consultation";

export default function ConsultationPage() {
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

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-md w-full border border-white/20"
        >
          <div className="text-center space-y-6">
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto"
                >
                  <motion.span 
                    animate={{ 
                      color: ["#ffffff", "#e0f2fe", "#ffffff"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-3xl font-bold text-white"
                  >
                    D
                  </motion.span>
                </motion.div>
                
                {/* Floating particles around logo */}
                <motion.div
                  animate={{
                    y: [-10, 10, -10],
                    x: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-primary/30 rounded-full"
                />
                <motion.div
                  animate={{
                    y: [10, -10, 10],
                    x: [5, -5, 5],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400/40 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <h1 className="text-2xl font-bold text-foreground">
                Start Your Consultation
              </h1>
              <p className="text-muted-foreground">
                Enter your name to begin your dental consultation with Daela
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => {
                    if (
                      e.key === "Enter" &&
                      !isInitializing &&
                      patientName.trim()
                    ) {
                      handleStartConsultation();
                    }
                  }}
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartConsultation}
                disabled={!patientName.trim() || isInitializing}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isInitializing
                  ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                  ) : null}
                {isInitializing
                  ? "Starting Consultation..."
                  : "Start Consultation"}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isInitializing || isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          {/* Animated Logo During Loading */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto"
          >
            <motion.span 
              animate={{ 
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-3xl font-bold text-white"
            >
              D
            </motion.span>
          </motion.div>
          
          {/* Animated connecting text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <motion.p 
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-lg font-medium text-foreground"
            >
              Connecting to Daela...
            </motion.p>
            <p className="text-muted-foreground">
              Please wait while we establish your consultation
            </p>
          </motion.div>
          
          {/* Loading dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-5, 5, -5],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-primary rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-200"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Connection Failed
            </h2>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={() => {
                setShowNameInput(true);
                setIsInitializing(false);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (wsUrl && token) {
    return <AudioConsultationRoom wsUrl={wsUrl} token={token} />;
  }

  return null;
}
