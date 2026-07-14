export interface ProductImage {
  id: string
  productVariantId: string
  imageUrl: string
  sortOrder: number
  alt?: string
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  name: string
  price: number
  stock: number
  images: ProductImage[]
}

export interface Category {
  id: string
  name: string
  slug: string
  parentCategoryId: string | null
  productCount?: number
  subCategories?: Category[]
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  category?: Category
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: Date
  variants: ProductVariant[]
  rating?: number
  reviewCount?: number
  specifications?: Record<string, string>
}

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  inStockOnly: boolean
  sortBy: 'newest' | 'priceLow' | 'priceHigh' | 'nameAZ'
  viewMode: 'grid' | 'list'
  currentPage: number
}

export interface PaginatedProducts {
  products: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
