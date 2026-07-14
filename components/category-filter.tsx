'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Category } from '@/lib/types'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategories: string[]
  onChange: (categories: string[]) => void
}

interface CategoryItemProps {
  category: Category
  selectedCategories: string[]
  onChange: (categories: string[]) => void
  level?: number
}

function CategoryItem({
  category,
  selectedCategories,
  onChange,
  level = 0,
}: CategoryItemProps) {
  const [expanded, setExpanded] = useState(false)
  const isSelected = selectedCategories.includes(category.id)
  const hasSubcategories = category.subCategories && category.subCategories.length > 0

  const handleCheck = (checked: boolean) => {
    if (checked) {
      onChange([...selectedCategories, category.id])
    } else {
      onChange(selectedCategories.filter((id) => id !== category.id))
    }
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <div>
      <div className="flex items-center gap-2 py-2">
        {hasSubcategories && (
          <button
            onClick={toggleExpand}
            className="p-0 hover:bg-muted rounded"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        {!hasSubcategories && <div className="w-4"></div>}

        <Checkbox
          id={`category-${category.id}`}
          checked={isSelected}
          onCheckedChange={handleCheck}
        />

        <Label
          htmlFor={`category-${category.id}`}
          className="flex-1 cursor-pointer text-sm font-medium"
        >
          {category.name}
          {category.productCount !== undefined && (
            <span className="text-muted-foreground ml-2">
              ({category.productCount})
            </span>
          )}
        </Label>
      </div>

      {hasSubcategories && expanded && (
        <div className="ml-2 border-l-2 border-border pl-2 space-y-1">
          {category.subCategories!.map((subCat) => (
            <CategoryItem
              key={subCat.id}
              category={subCat}
              selectedCategories={selectedCategories}
              onChange={onChange}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          selectedCategories={selectedCategories}
          onChange={onChange}
        />
      ))}
    </div>
  )
}
