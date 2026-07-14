'use client'

import { useState } from 'react'
import { Mail, Share2, Heart, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      {/* Newsletter Section */}
      <div className="border-b border-primary/20 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-primary-foreground/80">
                Get the latest updates on new products and upcoming sales
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder-primary-foreground/60 border border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-semibold transition-colors"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-green-300 text-sm">Thanks for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-secondary rounded flex items-center justify-center text-primary text-sm font-bold">M</div>
                MarketHub
              </h4>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Your trusted marketplace for quality products from verified sellers worldwide.
              </p>
            </div>

            {/* Links */}
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>
                  <Link href="/" className="hover:text-primary-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-primary-foreground transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>
                  <Link href="/faq" className="hover:text-primary-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-primary-foreground transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-primary-foreground transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-primary-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>
                  <Link href="/terms" className="hover:text-primary-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-primary-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="hover:text-primary-foreground transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-primary-foreground/20 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-primary-foreground/80">
                © 2024 MarketHub. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors" aria-label="Share">
                  <Share2 className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors" aria-label="Like">
                  <Heart className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors" aria-label="Location">
                  <MapPin className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors" aria-label="Contact">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
