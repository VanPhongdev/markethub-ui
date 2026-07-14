import { Category, Product, ProductVariant, ProductImage } from './types'

// Mock Categories with self-referencing hierarchy
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    parentCategoryId: null,
    productCount: 45,
    subCategories: [
      {
        id: 'cat-1-1',
        name: 'Smartphones',
        slug: 'smartphones',
        parentCategoryId: 'cat-1',
        productCount: 18,
      },
      {
        id: 'cat-1-2',
        name: 'Laptops',
        slug: 'laptops',
        parentCategoryId: 'cat-1',
        productCount: 12,
      },
      {
        id: 'cat-1-3',
        name: 'Accessories',
        slug: 'electronics-accessories',
        parentCategoryId: 'cat-1',
        productCount: 15,
      },
    ],
  },
  {
    id: 'cat-2',
    name: 'Fashion',
    slug: 'fashion',
    parentCategoryId: null,
    productCount: 87,
    subCategories: [
      {
        id: 'cat-2-1',
        name: 'Men',
        slug: 'mens-fashion',
        parentCategoryId: 'cat-2',
        productCount: 42,
      },
      {
        id: 'cat-2-2',
        name: 'Women',
        slug: 'womens-fashion',
        parentCategoryId: 'cat-2',
        productCount: 45,
      },
    ],
  },
  {
    id: 'cat-3',
    name: 'Home & Garden',
    slug: 'home-garden',
    parentCategoryId: null,
    productCount: 56,
    subCategories: [
      {
        id: 'cat-3-1',
        name: 'Furniture',
        slug: 'furniture',
        parentCategoryId: 'cat-3',
        productCount: 28,
      },
      {
        id: 'cat-3-2',
        name: 'Decor',
        slug: 'decor',
        parentCategoryId: 'cat-3',
        productCount: 28,
      },
    ],
  },
  {
    id: 'cat-4',
    name: 'Books & Media',
    slug: 'books-media',
    parentCategoryId: null,
    productCount: 34,
  },
  {
    id: 'cat-5',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    parentCategoryId: null,
    productCount: 52,
  },
]

// Helper function to generate mock products
const generateMockProducts = (): Product[] => {
  const products: Product[] = []
  const categoryIds = [
    'cat-1-1',
    'cat-1-2',
    'cat-1-3',
    'cat-2-1',
    'cat-2-2',
    'cat-3-1',
    'cat-3-2',
    'cat-4',
    'cat-5',
  ]

  const productNames = [
    'Wireless Headphones',
    'USB-C Cable',
    'Phone Case',
    'Screen Protector',
    'Portable Charger',
    'Laptop Stand',
    'USB Hub',
    'Keyboard',
    'Mouse Pad',
    'Cable Organizer',
    'T-Shirt',
    'Jeans',
    'Sneakers',
    'Hoodie',
    'Jacket',
    'Socks',
    'Dress',
    'Blouse',
    'Skirt',
    'Leggings',
    'Coffee Table',
    'Bookshelf',
    'Desk Lamp',
    'Throw Pillow',
    'Wall Art',
    'Plant Pot',
    'Mirror',
    'Rug',
    'Curtains',
    'Bedding Set',
    'Science Fiction Novel',
    'Mystery Book',
    'Self-Help Guide',
    'Cookbook',
    'Art Book',
    'Soccer Ball',
    'Tennis Racket',
    'Yoga Mat',
    'Water Bottle',
    'Backpack',
    'Running Shoes',
    'Fitness Tracker',
    'Bicycle',
    'Camping Tent',
    'LED Light Strip',
    'Smart Bulb',
    'Wireless Speaker',
    'Webcam',
    'Microphone',
    'Monitor',
  ]

  // Map product names to their real generated images
  const productImageMap: Record<string, string> = {
    'Wireless Headphones': '/products/wireless-headphones.png',
    'USB-C Cable': '/products/usb-c-cable.png',
    'Phone Case': '/products/phone-case.png',
    'Screen Protector': 'https://images.unsplash.com/photo-1520495497802-6b2f3330bed7?w=500&h=500&fit=crop',
    'Portable Charger': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop',
    'Laptop Stand': 'https://images.unsplash.com/photo-1586253408827-c8d1b2e0bba1?w=500&h=500&fit=crop',
    'USB Hub': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop',
    'Keyboard': 'https://images.unsplash.com/photo-1587829191301-4b544556f754?w=500&h=500&fit=crop',
    'Mouse Pad': '/products/mouse-pad.png',
    'Cable Organizer': '/products/cable-organizer.png',
    'T-Shirt': '/products/t-shirt.png',
    'Jeans': '/products/jeans.png',
    'Sneakers': '/products/sneakers.png',
    'Hoodie': '/products/hoodie.png',
    'Jacket': '/products/jacket.png',
    'Socks': '/products/socks.png',
    'Dress': 'https://images.unsplash.com/photo-1595777707802-e0e34ff8f0dc?w=500&h=500&fit=crop',
    'Blouse': 'https://images.unsplash.com/photo-1551986782-d244ca37c6df?w=500&h=500&fit=crop',
    'Skirt': 'https://images.unsplash.com/photo-1598880885913-b76ec4662873?w=500&h=500&fit=crop',
    'Leggings': 'https://images.unsplash.com/photo-1506215316996-2bda799c9237?w=500&h=500&fit=crop',
    'Coffee Table': 'https://images.unsplash.com/photo-1532372320572-cda402056212?w=500&h=500&fit=crop',
    'Bookshelf': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  }

  const findCategoryById = (categories: Category[], id: string): Category | undefined => {
    for (const cat of categories) {
      if (cat.id === id) return cat
      if (cat.subCategories) {
        const found = findCategoryById(cat.subCategories, id)
        if (found) return found
      }
    }
    return undefined
  }

  for (let i = 0; i < 120; i++) {
    const categoryId = categoryIds[i % categoryIds.length]
    const productName = productNames[i % productNames.length]
    const price = ((i * 17) % 490) + 10
    const stock = (i * 13) % 100
    const isActive = i % 10 !== 0
    const category = findCategoryById(mockCategories, categoryId)

    const colors1 = ['Black', 'White', 'Silver', 'Gold']
    const colors2 = ['Blue', 'Red', 'Green', 'Purple']
    const selectedColor1 = colors1[i % colors1.length]
    const selectedColor2 = colors2[(i + 3) % colors2.length]

    products.push({
      id: `prod-${i + 1}`,
      name: `${productName} ${i + 1}`,
      slug: `${productName.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: `High-quality ${productName.toLowerCase()} perfect for everyday use.`,
      categoryId,
      category,
      status: isActive ? 'ACTIVE' : 'INACTIVE',
      createdAt: new Date(1776278400000 - (i * 24 * 60 * 60 * 1000)),
      variants: [
        {
          id: `var-${i + 1}-1`,
          productId: `prod-${i + 1}`,
          sku: `SKU-${i + 1}-1`,
          name: `${productName} ${i + 1} - ${selectedColor1}`,
          price,
          stock,
          images: [
            {
              id: `img-${i + 1}-1`,
              productVariantId: `var-${i + 1}-1`,
              imageUrl: productImageMap[productName] || `https://images.unsplash.com/photo-${1500000000000 + i}?w=500&h=500&fit=crop`,
              sortOrder: 0,
              alt: productName,
            },
          ],
        },
        {
          id: `var-${i + 1}-2`,
          productId: `prod-${i + 1}`,
          sku: `SKU-${i + 1}-2`,
          name: `${productName} ${i + 1} - ${selectedColor2}`,
          price: Math.round(price * 1.1),
          stock: (i * 7) % 50,
          images: [
            {
              id: `img-${i + 1}-2`,
              productVariantId: `var-${i + 1}-2`,
              imageUrl: productImageMap[productName] || `https://images.unsplash.com/photo-${1500000000000 + i}?w=500&h=500&fit=crop`,
              sortOrder: 0,
              alt: productName,
            },
          ],
        },
      ],
    })
  }

  return products
}

export const mockProducts = generateMockProducts()

// Helper function to get category name by ID
export const getCategoryName = (categoryId: string): string => {
  const findCategory = (categories: Category[]): string | null => {
    for (const cat of categories) {
      if (cat.id === categoryId) return cat.name
      if (cat.subCategories) {
        const found = findCategory(cat.subCategories)
        if (found) return found
      }
    }
    return null
  }
  return findCategory(mockCategories) || 'Unknown'
}

// Helper function to get all leaf categories (for filtering)
export const getLeafCategories = (categories: Category[] = mockCategories): Category[] => {
  const leaves: Category[] = []
  for (const cat of categories) {
    if (cat.subCategories && cat.subCategories.length > 0) {
      leaves.push(...getLeafCategories(cat.subCategories))
    } else {
      leaves.push(cat)
    }
  }
  return leaves
}

// Helper function to flatten category tree
export const flattenCategories = (categories: Category[] = mockCategories): Category[] => {
  const flattened: Category[] = []
  for (const cat of categories) {
    flattened.push(cat)
    if (cat.subCategories) {
      flattened.push(...flattenCategories(cat.subCategories))
    }
  }
  return flattened
}

// Mock Reviews
export interface Review {
  id: string
  productId: string
  authorName: string
  rating: number
  title: string
  text: string
  date: string
  helpfulCount: number
  verifiedPurchase: boolean
}

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    productId: mockProducts[0]?.id || 'prod-1',
    authorName: 'Sarah Johnson',
    rating: 5,
    title: 'Excellent product! Highly recommended',
    text: 'This product exceeded my expectations. The quality is amazing and it arrived faster than expected. Great value for money!',
    date: '2024-01-15',
    helpfulCount: 24,
    verifiedPurchase: true,
  },
  {
    id: 'review-2',
    productId: mockProducts[0]?.id || 'prod-1',
    authorName: 'Michael Chen',
    rating: 4,
    title: 'Very good, minor issues',
    text: 'Overall very satisfied with this purchase. Minor issues with packaging, but the product itself is solid.',
    date: '2024-01-10',
    helpfulCount: 12,
    verifiedPurchase: true,
  },
  {
    id: 'review-3',
    productId: mockProducts[0]?.id || 'prod-1',
    authorName: 'Emma Davis',
    rating: 5,
    title: 'Perfect!',
    text: 'Exactly what I was looking for. Fast shipping and great customer service.',
    date: '2024-01-05',
    helpfulCount: 18,
    verifiedPurchase: true,
  },
  {
    id: 'review-4',
    productId: mockProducts[0]?.id || 'prod-1',
    authorName: 'James Wilson',
    rating: 3,
    title: 'Average',
    text: 'It works as described, but nothing special. Could be better for the price.',
    date: '2023-12-28',
    helpfulCount: 5,
    verifiedPurchase: false,
  },
  {
    id: 'review-5',
    productId: mockProducts[0]?.id || 'prod-1',
    authorName: 'Lisa Brown',
    rating: 4,
    title: 'Good quality',
    text: 'Good quality product. Arrived on time. Would recommend to friends.',
    date: '2023-12-20',
    helpfulCount: 8,
    verifiedPurchase: true,
  },
]
