import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message)
    return Promise.reject(error)
  }
)

export const menuAPI = {
  getAll: (params?: Record<string, string>) => api.get('/menu', { params }),
  getById: (id: string) => api.get(`/menu/${id}`),
  getPairing: (id: string) => api.get(`/pairing/${id}`)
}

export const reservationAPI = {
  create: (data: Record<string, unknown>) => api.post('/reservations', data),
  getAll: (params?: Record<string, string>) => api.get('/reservations', { params })
}

export const orderAPI = {
  create: (data: Record<string, unknown>) => api.post('/orders', data),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status })
}

export const reviewAPI = {
  getAll: () => api.get('/reviews'),
  create: (data: Record<string, unknown>) => api.post('/reviews', data)
}

export const eventAPI = {
  getAll: () => api.get('/events')
}

export const newsletterAPI = {
  subscribe: (email: string) => api.post('/newsletter', { email })
}

export const aiAPI = {
  getRecommendation: (data: Record<string, unknown>) => api.post('/ai-recommendation', data)
}

export default api
