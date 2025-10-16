"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Download, Volume2 } from "lucide-react"

export interface TranscriptionSegment {
  id: string
  speaker: "user" | "dentist"
  text: string
  timestamp: number
  duration: number
}

interface TranscriptionPanelProps {
  segments: TranscriptionSegment[]
  isLive?: boolean
  onSegmentClick?: (timestamp: number) => void
}

export function TranscriptionPanel({ segments, isLive = false, onSegmentClick }: TranscriptionPanelProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [expandedSegment, setExpandedSegment] = useState<string | null>(null)

  const handleCopy = () => {
    const fullText = segments.map((s) => `${s.speaker === "user" ? "You" : "Dr."}: ${s.text}`).join("\n\n")
    navigator.clipboard.writeText(fullText)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleDownload = () => {
    const fullText = segments
      .map((s) => `[${formatTime(s.timestamp)}] ${s.speaker === "user" ? "You" : "Dr."}: ${s.text}`)
      .join("\n\n")
    const element = document.createElement("a")
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(fullText)}`)
    element.setAttribute("download", "consultation-transcript.txt")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Live Transcription</h3>
          {isLive && <p className="text-xs text-secondary">Recording in progress</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title={isCopied ? "Copied!" : "Copy transcript"}
          >
            <Copy className="w-4 h-4 text-foreground/60" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Download transcript"
          >
            <Download className="w-4 h-4 text-foreground/60" />
          </button>
        </div>
      </div>

      {/* Transcription Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {segments.length === 0 ? (
          <div className="flex items-center justify-center h-full text-foreground/50">
            <p className="text-sm">Waiting for transcription...</p>
          </div>
        ) : (
          segments.map((segment) => (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                segment.speaker === "user" ? "bg-primary/10 border border-primary/20" : "bg-muted border border-border"
              } hover:bg-muted/80`}
              onClick={() => onSegmentClick?.(segment.timestamp)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <span className="text-xs font-semibold text-foreground/60 bg-background px-2 py-1 rounded">
                    {formatTime(segment.timestamp)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground/70 mb-1">
                    {segment.speaker === "user" ? "You" : "Dr."}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{segment.text}</p>
                </div>
                <button
                  className="flex-shrink-0 p-1 hover:bg-background rounded transition-colors"
                  aria-label="Play segment"
                >
                  <Volume2 className="w-4 h-4 text-foreground/60" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      {isLive && (
        <div className="p-4 border-t border-border bg-card flex items-center gap-2 text-xs text-foreground/60">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Recording and transcribing in real-time</span>
        </div>
      )}
    </div>
  )
}
