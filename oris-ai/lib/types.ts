// Data contracts and types for Oris AI platform

export interface ConsultationBooking {
  id: string
  userId: string
  dentistId: string
  name: string
  email: string
  phone: string
  scheduledDate: Date
  scheduledTime: string
  concerns: string
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  consultationId: string
  sender: "user" | "dentist"
  content: string
  attachments?: string[]
  timestamp: Date
}

export interface TranscriptionSegment {
  id: string
  consultationId: string
  speaker: "user" | "dentist"
  text: string
  timestamp: number
  duration: number
  confidence: number
}

export interface Dentist {
  id: string
  name: string
  specialization: string
  licenseNumber: string
  bio: string
  avatar?: string
  rating: number
  reviewCount: number
  isAvailable: boolean
  availableSlots: string[]
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  medicalHistory?: string
  createdAt: Date
  updatedAt: Date
}

export interface ConsultationSession {
  id: string
  bookingId: string
  startTime: Date
  endTime?: Date
  duration?: number
  recordingUrl?: string
  transcriptUrl?: string
  notes?: string
  status: "active" | "completed" | "cancelled"
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
