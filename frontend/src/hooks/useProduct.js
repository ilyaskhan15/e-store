import { useQuery } from '@tanstack/react-query'

import { productsApi } from '@/api'

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
    enabled: Boolean(id),
  })
}
