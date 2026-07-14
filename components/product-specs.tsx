'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface ProductSpecsProps {
  description: string
  specifications: Record<string, string>
  shipping: {
    domesticDays: number
    internationalDays: number
    cost: number
    freeOver: number
  }
}

export function ProductSpecs({
  description,
  specifications,
  shipping,
}: ProductSpecsProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check initial screen size
    setIsMobile(window.innerWidth < 1024)

    // Handle resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const specItems = specifications
    ? Object.entries(specifications).map(([key, value]) => ({
        label: key,
        value: value,
      }))
    : []

  // Desktop Tabs View
  if (!isMobile) {
    return (
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          <div className="space-y-3">
            {specItems.map((item, idx) => (
              <div key={idx} className="flex justify-between border-b pb-3">
                <span className="font-semibold text-sm">{item.label}</span>
                <span className="text-muted-foreground text-sm">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Domestic Shipping</h4>
              <p className="text-sm text-muted-foreground">
                {shipping.domesticDays} business days
              </p>
              <p className="text-sm mt-1">
                Shipping Cost: $
                {shipping.cost > 0
                  ? `${shipping.cost}`
                  : 'FREE (orders over $' + shipping.freeOver + ')'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">International Shipping</h4>
              <p className="text-sm text-muted-foreground">
                {shipping.internationalDays} business days
              </p>
              <p className="text-sm mt-1">Contact us for rates</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Returns</h4>
              <p className="text-sm text-muted-foreground">
                30-day hassle-free returns. Product must be in original condition.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    )
  }

  // Mobile Accordion View
  return (
    <Accordion className="w-full">
      <AccordionItem value="description">
        <AccordionTrigger>Description</AccordionTrigger>
        <AccordionContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="specifications">
        <AccordionTrigger>Specifications</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {specItems.map((item, idx) => (
              <div key={idx} className="flex justify-between border-b pb-3">
                <span className="font-semibold text-sm">{item.label}</span>
                <span className="text-muted-foreground text-sm">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping & Returns</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Domestic Shipping</h4>
              <p className="text-sm text-muted-foreground">
                {shipping.domesticDays} business days
              </p>
              <p className="text-sm mt-1">
                Shipping Cost: $
                {shipping.cost > 0
                  ? `${shipping.cost}`
                  : 'FREE (orders over $' + shipping.freeOver + ')'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">International Shipping</h4>
              <p className="text-sm text-muted-foreground">
                {shipping.internationalDays} business days
              </p>
              <p className="text-sm mt-1">Contact us for rates</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Returns</h4>
              <p className="text-sm text-muted-foreground">
                30-day hassle-free returns. Product must be in original condition.
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
