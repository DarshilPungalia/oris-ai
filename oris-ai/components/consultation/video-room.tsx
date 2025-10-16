"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Video, VideoOff, Phone, Share2, MessageSquare } from "lucide-react"

interface VideoRoomProps {
  roomName: string
  token?: string
  dentistName: string
  onToggleChat?: () => void
  showChat?: boolean
}

export function VideoRoom({ roomName, dentistName, onToggleChat, showChat }: VideoRoomProps) {
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 to-black">
      {/* Video Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Remote Video (Dentist) - Main Display */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center shadow-lg"
            >
              <span className="text-6xl font-bold text-white">{dentistName.charAt(0)}</span>
            </motion.div>
            <div>
              <h3 className="text-2xl font-semibold text-white">{dentistName}</h3>
              <p className="text-sm text-white/60">Dental Professional</p>
            </div>
          </div>
        </div>

        {/* Local Video (User) - Picture in Picture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-4 right-4 w-32 h-40 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg bg-black"
        >
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          {!isVideoOn && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-white/50" />
            </div>
          )}
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 glass-panel px-4 py-2"
        >
          <p className="text-white font-mono text-sm font-semibold">{formatTime(elapsedTime)}</p>
        </motion.div>

        {/* Room Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 glass-panel px-4 py-2"
        >
          <p className="text-white/70 text-xs">Room: {roomName}</p>
        </motion.div>

        {/* Speaking Indicator */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-2 glass-panel px-4 py-2"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white text-sm">{dentistName} is speaking</span>
        </motion.div>
      </div>

      {/* Controls Bar */}
      <div className="glass-panel m-4 mt-0 rounded-t-lg rounded-b-none px-6 py-4 flex items-center justify-center gap-4">
        {/* Mic Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMicOn(!isMicOn)}
          className={`p-3 rounded-full transition-all ${
            isMicOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500/20 hover:bg-red-500/30 text-red-400"
          }`}
          aria-label={isMicOn ? "Mute microphone" : "Unmute microphone"}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </motion.button>

        {/* Video Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3 rounded-full transition-all ${
            isVideoOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500/20 hover:bg-red-500/30 text-red-400"
          }`}
          aria-label={isVideoOn ? "Turn off camera" : "Turn on camera"}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </motion.button>

        {/* Screen Share */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`p-3 rounded-full transition-all ${
            isScreenSharing
              ? "bg-secondary/20 hover:bg-secondary/30 text-secondary"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          aria-label={isScreenSharing ? "Stop sharing screen" : "Share screen"}
        >
          <Share2 className="w-5 h-5" />
        </motion.button>

        {/* Chat Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleChat}
          className={`p-3 rounded-full transition-all ${
            showChat ? "bg-primary/20 hover:bg-primary/30 text-primary" : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          aria-label={showChat ? "Close chat" : "Open chat"}
        >
          <MessageSquare className="w-5 h-5" />
        </motion.button>

        {/* End Call */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
          aria-label="End call"
        >
          <Phone className="w-5 h-5 rotate-[135deg]" />
        </motion.button>
      </div>
    </div>
  )
}
