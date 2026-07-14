import { Product, FilterState, PaginatedProducts } from './types'
import { mockProducts, getLeafCategories } from './mock-data'

export const filterAndSortProducts = (
  products: Product[],
  filters: FilterState
): Product[] => {
  let filtered = [...products]

  // Filter by categories
  if (filters.categories.length > 0) {
    filtered = filtered.filter((product) =>
      filters.categories.includes(product.categoryId)
    )
  }

  // Filter by price range
  filtered = filtered.filter((product) => {
    const minPrice = Math.min(...product.variants.map((v) => v.price))
    const maxPrice = Math.max(...product.variants.map((v) => v.price))
    return (
      minPrice >= filters.priceRange[0] &&
      maxPrice <= filters.priceRange[1]
    )
  })

  // Filter by stock availability
  if (filters.inStockOnly) {
    filtered = filtered.filter((product) =>
      product.variants.some((v) => v.stock > 0)
    )
  }

  // Sort products
  switch (filters.sortBy) {
    case 'newest':
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      break
    case 'priceLow':
      filtered.sort((a, b) => {
        const priceA = Math.min(...a.variants.map((v) => v.price))
        const priceB = Math.min(...b.variants.map((v) => v.price))
        return priceA - priceB
      })
      break
    case 'priceHigh':
      filtered.sort((a, b) => {
        const priceA = Math.max(...a.variants.map((v) => v.price))
        const priceB = Math.max(...b.variants.map((v) => v.price))
        return priceB - priceA
      })
      break
    case 'nameAZ':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  return filtered
}

export const getPaginatedProducts = (
  products: Product[],
  page: number,
  pageSize: number = 24
): PaginatedProducts => {
  const total = products.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    products: products.slice(start, end),
    total,
    page,
    pageSize,
    totalPages,
  }
}

export const getMaxPrice = (): number => {
  let max = 0
  mockProducts.forEach((product) => {
    product.variants.forEach((variant) => {
      if (variant.price > max) max = variant.price
    })
  })
  return Math.ceil(max / 10) * 10
}

export const getMinPrice = (): number => {
  let min = Infinity
  mockProducts.forEach((product) => {
    product.variants.forEach((variant) => {
      if (variant.price < min) min = variant.price
    })
  })
  return Math.floor(min / 10) * 10
}

export const createFilterUrl = (filters: FilterState): string => {
  const params = new URLSearchParams()

  if (filters.categories.length > 0) {
    params.set('categories', filters.categories.join(','))
  }

  params.set('minPrice', filters.priceRange[0].toString())
  params.set('maxPrice', filters.priceRange[1].toString())

  if (filters.inStockOnly) {
    params.set('inStock', 'true')
  }

  if (filters.sortBy !== 'newest') {
    params.set('sort', filters.sortBy)
  }

  if (filters.viewMode !== 'grid') {
    params.set('view', filters.viewMode)
  }

  if (filters.currentPage > 1) {
    params.set('page', filters.currentPage.toString())
  }

  return params.toString()
}

export const parseFilterUrl = (searchParams: URLSearchParams): Partial<FilterState> => {
  const minPrice = getMinPrice()
  const maxPrice = getMaxPrice()

  return {
    categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
    priceRange: [
      parseInt(searchParams.get('minPrice') ?? minPrice.toString()),
      parseInt(searchParams.get('maxPrice') ?? maxPrice.toString()),
    ] as [number, number],
    inStockOnly: searchParams.get('inStock') === 'true',
    sortBy: (searchParams.get('sort') as any) || 'newest',
    viewMode: (searchParams.get('view') as any) || 'grid',
    currentPage: parseInt(searchParams.get('page') ?? '1'),
  }
}
