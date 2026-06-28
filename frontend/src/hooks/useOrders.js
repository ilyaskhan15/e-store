import { useQuery, useMutation } from '@tanstack/react-query'

import { ordersApi } from '@/api'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getOrders(),
  })
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (data) => ordersApi.createOrder(data),
  })
}
