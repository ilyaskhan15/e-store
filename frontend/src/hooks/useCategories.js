import { useQuery } from '@tanstack/react-query'

import { productsApi } from '@/api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
  })
}
