'use client'

import { useState } from 'react'
import { Search, ShoppingCart, User, ChevronDown, LogOut, Home } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(3)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)

  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Garden', slug: 'home-garden' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Books', slug: 'books' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="hidden sm:inline">MarketHub</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 mx-4 md:mx-8 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-foreground hover:text-accent transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-foreground hover:text-accent transition-colors">
            Products
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="flex items-center gap-1 text-foreground hover:text-accent transition-colors"
            >
              Categories
              <ChevronDown className="w-4 h-4" />
            </button>
            {showCategoryMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    className="block px-4 py-2 text-foreground hover:bg-muted hover:text-accent transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/products"
                  className="block px-4 py-2 text-accent font-medium border-t border-border hover:bg-muted transition-colors"
                >
                  View all categories
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Cart Icon */}
          <button className="relative p-2 text-foreground hover:text-accent transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 text-foreground hover:text-accent transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-foreground hover:bg-muted hover:text-accent transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-foreground hover:bg-muted hover:text-accent transition-colors"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false)
                        setShowUserMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-foreground hover:bg-muted hover:text-accent transition-colors flex items-center gap-2 border-t border-border"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-foreground hover:bg-muted hover:text-accent transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 text-foreground hover:bg-muted hover:text-accent transition-colors border-t border-border"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
