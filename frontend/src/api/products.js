import client from './client'

export const productsApi = {
  getProducts: (params) => client.get('/products/', { params }).then((response) => response.data),
  getProduct: (id) => client.get(`/products/${id}/`).then((response) => response.data),
  getCategories: () => client.get('/categories/').then((response) => response.data),
  createReview: (id, data) => client.post(`/products/${id}/reviews/`, data).then((response) => response.data),
}
