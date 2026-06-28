import { useQuery } from '@tanstack/react-query'

import { productsApi } from '@/api'

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
    keepPreviousData: true,
  })
}
