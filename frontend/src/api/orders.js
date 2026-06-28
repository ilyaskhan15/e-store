import client from './client'

export const ordersApi = {
  getOrders: () => client.get('/orders/').then((response) => response.data),
  getOrder: (id) => client.get(`/orders/${id}/`).then((response) => response.data),
  createOrder: (data) => client.post('/orders/', data).then((response) => response.data),
  validateDiscount: (data) => client.post('/orders/validate-discount/', data).then((response) => response.data),
}
