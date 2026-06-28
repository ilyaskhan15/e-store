import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, SlidersHorizontal, Search } from 'lucide-react'

import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'
import ProductCard from '@/components/ProductCard'
import SkeletonCard from '@/components/SkeletonCard'
import { useCategories } from '@/hooks/useCategories'
import { useDebounce } from '@/hooks/useDebounce'
import { useProducts } from '@/hooks/useProducts'
import { nationalTeams, sizeOptions } from '@/utils/constants'

const PRICE_MAX = 200

export default function ShopPage() {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX)
  const [sortBy, setSortBy] = useState('-created_at')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search, 300)
  const debouncedMinPrice = useDebounce(minPrice, 300)
  const debouncedMaxPrice = useDebounce(maxPrice, 300)
  const { data: categoriesData } = useCategories()
  const categories = categoriesData?.results || []

  const params = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      category: selectedCategories.join(',') || undefined,
      team: selectedTeams.join(',') || undefined,
      size: selectedSizes.join(',') || undefined,
      min_price: debouncedMinPrice || undefined,
      max_price: debouncedMaxPrice || undefined,
      ordering: sortBy,
      page,
    }),
    [debouncedSearch, selectedCategories, selectedTeams, selectedSizes, debouncedMinPrice, debouncedMaxPrice, sortBy, page]
  )

  const { data, isLoading } = useProducts(params)
  const products = data?.results || []
  const totalPages = Math.ceil((data?.count || 0) / 12) || 1

  const toggleValue = (value, setter) => {
    setter((current) => (current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value]))
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Shop</p>
          <h1 className="text-7xl text-navy">Browse All Kits</h1>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-3 text-sm text-muted shadow-sm md:flex">
          <SlidersHorizontal className="h-4 w-4 text-navy" /> Use filters to refine your selection
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[2rem] bg-white p-5 shadow-luxe">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.25em] text-muted">Search</label>
              <div className="mt-2 flex items-center rounded-2xl border border-navy/10 bg-surface px-3">
                <Search className="h-4 w-4 text-muted" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="w-full bg-transparent px-3 py-3 outline-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.25em] text-muted">Category</label>
              <div className="mt-3 space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-sm font-medium text-navy">
                    <input type="checkbox" checked={selectedCategories.includes(category.slug)} onChange={() => toggleValue(category.slug, setSelectedCategories)} className="h-4 w-4 rounded border-navy/20 text-navy focus:ring-navy" />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.25em] text-muted">National Team</label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {nationalTeams.map((team) => (
                  <button key={team} type="button" onClick={() => toggleValue(team, setSelectedTeams)} className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${selectedTeams.includes(team) ? 'bg-navy text-white' : 'bg-surface text-navy hover:bg-navy/5'}`}>
                    {team}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.25em] text-muted">Size</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button key={size} type="button" onClick={() => toggleValue(size, setSelectedSizes)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${selectedSizes.includes(size) ? 'bg-navy text-white' : 'bg-surface text-navy hover:bg-navy/5'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.25em] text-muted">Price Range</label>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-xs text-muted"><span>Min</span><span>{minPrice}</span></div>
                  <input type="range" min="0" max={PRICE_MAX} value={minPrice} onChange={(event) => setMinPrice(Number(event.target.value))} className="w-full accent-navy" />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-xs text-muted"><span>Max</span><span>{maxPrice}</span></div>
                  <input type="range" min="0" max={PRICE_MAX} value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="w-full accent-gold" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.25em] text-muted">Sort By</label>
              <select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1) }} className="mt-3 w-full rounded-2xl border border-navy/10 bg-surface px-4 py-3 outline-none">
                <option value="-created_at">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between text-sm text-muted">
            <span>{data?.count || 0} products found</span>
            <button type="button" onClick={() => { setSearch(''); setSelectedCategories([]); setSelectedTeams([]); setSelectedSizes([]); setMinPrice(0); setMaxPrice(PRICE_MAX); setSortBy('-created_at'); setPage(1) }} className="font-semibold text-navy transition hover:text-red">Reset filters</button>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <EmptyState title="No results" description="Try adjusting the filters to find more kits and fanwear." />
          )}

          <div className="mt-8 flex items-center justify-between rounded-3xl bg-white px-4 py-3 shadow-sm">
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-navy disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button>
            <div className="hidden items-center gap-2 md:flex">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                const nextPage = index + 1
                return (
                  <button key={nextPage} type="button" onClick={() => setPage(nextPage)} className={`h-10 w-10 rounded-full font-bold ${page === nextPage ? 'bg-navy text-white' : 'bg-surface text-navy'}`}>
                    {nextPage}
                  </button>
                )
              })}
            </div>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 font-semibold text-navy disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button>
          </div>
        </section>
      </div>
    </div>
  )
}
