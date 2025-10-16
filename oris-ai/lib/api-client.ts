// API client utilities for frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }))
    throw new Error(error.message || `API error: ${response.status}`)
  }

  return response.json()
}

export const consultationApi = {
  bookConsultation: (data: any) =>
    apiCall("/consultations/book", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getConsultation: (id: string) =>
    apiCall(`/consultations/${id}`, {
      method: "GET",
    }),

  listConsultations: (userId: string) =>
    apiCall(`/consultations?userId=${userId}`, {
      method: "GET",
    }),

  updateConsultation: (id: string, data: any) =>
    apiCall(`/consultations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  cancelConsultation: (id: string) =>
    apiCall(`/consultations/${id}/cancel`, {
      method: "POST",
    }),
}

export const chatApi = {
  sendMessage: (consultationId: string, message: string) =>
    apiCall("/chat/send", {
      method: "POST",
      body: JSON.stringify({ consultationId, message }),
    }),

  getMessages: (consultationId: string) =>
    apiCall(`/chat/messages?consultationId=${consultationId}`, {
      method: "GET",
    }),
}

export const dentistApi = {
  listDentists: () =>
    apiCall("/dentists", {
      method: "GET",
    }),

  getDentist: (id: string) =>
    apiCall(`/dentists/${id}`, {
      method: "GET",
    }),

  getAvailableSlots: (dentistId: string, date: string) =>
    apiCall(`/dentists/${dentistId}/available-slots?date=${date}`, {
      method: "GET",
    }),
}
