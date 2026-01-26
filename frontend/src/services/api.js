import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const menuAPI = {
  getAll: (params) => api.get('/menu', { params }),
  getById: (id) => api.get(`/menu/${id}`),
  getPairing: (id) => api.get(`/pairing/${id}`)
}

export const reservationAPI = {
  create: (data) => api.post('/reservations', data),
  getAll: (params) => api.get('/reservations', { params })
}

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status })
}

export const reviewAPI = {
  getAll: () => api.get('/reviews'),
  create: (data) => api.post('/reviews', data)
}

export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter', { email })
}

export const eventAPI = {
  getAll: () => api.get('/events')
}

export const aiAPI = {
  getRecommendation: (data) => api.post('/ai-recommendation', data)
}

export default api
