import client from './client'

export const authApi = {
  login: (data) => client.post('/auth/login/', data).then((response) => response.data),
  register: (data) => client.post('/auth/register/', data).then((response) => response.data),
  me: () => client.get('/auth/me/').then((response) => response.data),
  updateMe: (data) => client.put('/auth/me/', data).then((response) => response.data),
  refresh: (data) => client.post('/auth/token/refresh/', data).then((response) => response.data),
}
