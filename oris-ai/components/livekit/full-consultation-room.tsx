"use client"

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  StartAudio,
  useVoiceAssistant,
  BarVisualizer,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useTracks,
  TrackToggle,
  VideoTrack
} from "@livekit/components-react";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  X, 
  MessageSquare,
  Phone,
  Settings,
  Minimize2,
  Maximize2
} from "lucide-react";
import { ConnectionState, Track, LocalParticipant } from "livekit-client";

interface ChatMessage {
  name: string;
  message: string;
  timestamp: number;
  isSelf: boolean;
}

interface FullConsultationRoomProps {
  wsUrl: string;
  token: string;
  onClose: () => void;
}

function ConsultationInterface({ onClose }: { onClose: () => void }) {
  const { state, audioTrack, agentTranscriptions, agentAttributes } = useVoiceAssistant();
  const [transcripts, setTranscripts] = useState<ChatMessage[]>([]);
  const [showTranscripts, setShowTranscripts] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const { localParticipant } = useLocalParticipant();
  const roomState = useConnectionState();
  const tracks = useTracks();

  // Find agent and local tracks
  const agentVideoTrack = tracks.find(
    (trackRef) =>
      trackRef.publication.kind === Track.Kind.Video &&
      trackRef.participant.isAgent
  );

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );
  
  const localVideoTrack = localTracks.find(
    ({ source }) => source === Track.Source.Camera
  );

  // Handle data channel messages for transcriptions using new API
  const { message: latestMessage, send } = useDataChannel("transcription", (msg) => {
    try {
      const decoded = JSON.parse(
        new TextDecoder("utf-8").decode(msg.payload)
      );
      let timestamp = new Date().getTime();
      if ("timestamp" in decoded && decoded.timestamp > 0) {
        timestamp = decoded.timestamp;
      }
      setTranscripts(prev => [
        ...prev,
        {
          name: "You",
          message: decoded.text,
          timestamp: timestamp,
          isSelf: true,
        },
      ]);
    } catch (error) {
      console.error("Error parsing transcription:", error);
    }
  });

  // Combine user transcripts and agent transcriptions
  const allTranscripts = useMemo(() => {
    const combined = [...transcripts];
    
    // Add agent transcriptions if available
    if (agentTranscriptions && agentTranscriptions.length > 0) {
      agentTranscriptions.forEach((agentMsg) => {
        combined.push({
          name: "Daela AI",
          message: agentMsg.text || "",
          timestamp: Date.now(),
          isSelf: false,
        });
      });
    }
    
    // Sort by timestamp
    return combined.sort((a, b) => a.timestamp - b.timestamp);
  }, [transcripts, agentTranscriptions]);

  // Set initial camera/mic state
  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setCameraEnabled(false); // Start with camera off
      localParticipant.setMicrophoneEnabled(true); // Mic on for voice
    }
  }, [localParticipant, roomState]);

  const getConnectionStatusColor = () => {
    switch (roomState) {
      case ConnectionState.Connected:
        return "bg-emerald-500";
      case ConnectionState.Connecting:
        return "bg-amber-500";
      case ConnectionState.Reconnecting:
        return "bg-orange-500";
      default:
        return "bg-red-500";
    }
  };

  const getConnectionStatusText = () => {
    switch (roomState) {
      case ConnectionState.Connected:
        return "Connected";
      case ConnectionState.Connecting:
        return "Connecting...";
      case ConnectionState.Reconnecting:
        return "Reconnecting...";
      default:
        return "Disconnected";
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/30 flex relative overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Elegant Header */}
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          <div className="relative flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${getConnectionStatusColor()} shadow-lg`}></div>
                <div className={`absolute inset-0 w-4 h-4 rounded-full ${getConnectionStatusColor()} animate-ping opacity-30`}></div>
              </div>
              <div>
                <h3 className="font-semibold text-xl bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  AI Dental Consultation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {getConnectionStatusText()} • Daela AI Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTranscripts(!showTranscripts)}
                className="p-3 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10"
                title="Toggle chat transcript"
              >
                <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-3 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <Minimize2 className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-3 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 text-red-500"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Video Area */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex-1 relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] opacity-20"></div>
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:20px_20px]"></div>
              </div>

              {/* Agent Video (if available) */}
              {agentVideoTrack && (
                <div className="absolute inset-0 z-10">
                  <VideoTrack
                    trackRef={agentVideoTrack}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Local Video (Picture-in-Picture) */}
              {localVideoTrack && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-6 right-6 w-48 h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl backdrop-blur-sm z-20"
                >
                  <VideoTrack
                    trackRef={localVideoTrack}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl"></div>
                </motion.div>
              )}

              {/* AI Avatar (when no video) */}
              {!agentVideoTrack && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center space-y-8">
                    <motion.div
                      animate={{ 
                        scale: state === "speaking" ? [1, 1.05, 1] : 1,
                        rotate: state === "thinking" ? [0, 360] : 0,
                        boxShadow: state === "speaking" ? [
                          "0 0 60px rgba(59, 130, 246, 0.5)",
                          "0 0 100px rgba(139, 92, 246, 0.8)",
                          "0 0 60px rgba(59, 130, 246, 0.5)"
                        ] : "0 0 60px rgba(59, 130, 246, 0.3)"
                      }}
                      transition={{ 
                        repeat: state === "speaking" || state === "thinking" ? Infinity : 0, 
                        duration: state === "thinking" ? 3 : 2,
                        ease: "easeInOut"
                      }}
                      className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden"
                    >
                      {/* Inner Glow */}
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-300/20 to-purple-300/20 backdrop-blur-sm"></div>
                      
                      {/* Avatar */}
                      <div className="relative text-white text-7xl font-bold tracking-wider">D</div>
                      
                      {/* Pulse Effect */}
                      {state === "listening" && (
                        <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse"></div>
                      )}
                    </motion.div>
                    
                    <div className="space-y-4">
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white drop-shadow-lg"
                      >
                        Daela AI Assistant
                      </motion.p>
                      <motion.div
                        key={state}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <p className="text-blue-100 text-lg font-medium">
                          {state === "listening" && "👂 Listening to your question..."}
                          {state === "thinking" && "🧠 Processing and analyzing..."}
                          {state === "speaking" && "💬 Speaking response..."}
                          {!state && "✨ Ready to help with dental concerns"}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-blue-200/80">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                          <span>AI-powered dental consultation</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Audio Visualizer */}
                    {audioTrack && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md mx-auto"
                      >
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                          <BarVisualizer 
                            state={state} 
                            trackRef={audioTrack} 
                            barCount={12}
                            style={{ opacity: 0.9 }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Elegant Controls */}
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-center gap-6">
              <TrackToggle
                source={Track.Source.Microphone}
                className="group relative p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <Mic className="w-6 h-6" />
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </TrackToggle>

              <TrackToggle
                source={Track.Source.Camera}
                className="group relative p-4 rounded-2xl bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <Video className="w-6 h-6" />
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </TrackToggle>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="group relative p-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Phone className="w-6 h-6 rotate-[135deg]" />
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6 space-y-2"
            >
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Speak naturally about your dental concerns
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  Pain Assessment
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  Treatment Guidance
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  Emergency Help
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Elegant Transcript Sidebar */}
      <AnimatePresence>
        {showTranscripts && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: 100 }}
            animate={{ width: 380, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-l border-white/20 shadow-2xl flex flex-col relative"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            
            <div className="relative p-6 border-b border-white/10">
              <h3 className="font-semibold text-lg bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Live Conversation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Real-time transcription</p>
            </div>
            
            <div className="relative flex-1 overflow-y-auto p-6 space-y-4">
              {allTranscripts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-slate-500 dark:text-slate-400 py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="font-medium">Start speaking</p>
                  <p className="text-sm mt-1">Your conversation will appear here</p>
                </motion.div>
              ) : (
                allTranscripts.map((transcript, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-2xl backdrop-blur-sm border transition-all duration-200 ${
                      transcript.isSelf
                        ? "bg-blue-50/80 dark:bg-blue-900/20 border-blue-200/30 dark:border-blue-700/30 ml-4"
                        : "bg-slate-50/80 dark:bg-slate-800/20 border-slate-200/30 dark:border-slate-700/30 mr-4"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        transcript.isSelf
                          ? "bg-blue-500 text-white"
                          : "bg-slate-500 text-white"
                      }`}>
                        {transcript.name.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {transcript.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                        {new Date(transcript.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {transcript.message}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FullConsultationRoom({ wsUrl, token, onClose }: FullConsultationRoomProps) {
  return (
    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect={true}
      className="w-full h-full"
    >
      <ConsultationInterface onClose={onClose} />
      <RoomAudioRenderer />
      <StartAudio label="Click to enable audio playback" />
    </LiveKitRoom>
  );
}