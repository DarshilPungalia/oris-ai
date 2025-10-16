"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { VideoRoom } from "./video-room"
import { ChatInterface } from "./chat-interface"
import { TranscriptionPanel, type TranscriptionSegment } from "./transcription-panel"
import { MessageSquare, FileText } from "lucide-react"

interface ConsultationRoomProps {
  consultationId: string
  dentistName: string
  onEnd?: () => void
}

export function ConsultationRoom({ consultationId, dentistName, onEnd }: ConsultationRoomProps) {
  const [activePanel, setActivePanel] = useState<"chat" | "transcription">("chat")
  const [transcriptionSegments, setTranscriptionSegments] = useState<TranscriptionSegment[]>([
    {
      id: "1",
      speaker: "dentist",
      text: "Hello! I'm Dr. Smith. How can I help you with your dental concerns today?",
      timestamp: 0,
      duration: 5,
    },
    {
      id: "2",
      speaker: "user",
      text: "I've been experiencing some sensitivity in my back teeth, especially when I drink hot beverages.",
      timestamp: 6,
      duration: 8,
    },
    {
      id: "3",
      speaker: "dentist",
      text: "I see. Tooth sensitivity can be caused by several factors. Let me ask you a few questions to better understand your situation.",
      timestamp: 15,
      duration: 6,
    },
  ])

  return (
    <div className="w-full h-screen bg-background flex gap-4 p-4">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 rounded-lg overflow-hidden border border-border">
          <VideoRoom consultationId={consultationId} dentistName={dentistName} onEnd={onEnd} />
        </div>
      </div>

      {/* Side Panel */}
      <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-96 flex flex-col gap-4">
        {/* Panel Tabs */}
        <div className="flex gap-2 bg-card p-2 rounded-lg border border-border">
          <button
            onClick={() => setActivePanel("chat")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors ${
              activePanel === "chat" ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Chat</span>
          </button>
          <button
            onClick={() => setActivePanel("transcription")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors ${
              activePanel === "transcription"
                ? "bg-primary text-primary-foreground"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Transcript</span>
          </button>
        </div>

        {/* Panel Content */}
        {activePanel === "chat" ? (
          <ChatInterface consultationId={consultationId} dentistName={dentistName} />
        ) : (
          <TranscriptionPanel segments={transcriptionSegments} isLive={true} />
        )}
      </motion.div>
    </div>
  )
}
