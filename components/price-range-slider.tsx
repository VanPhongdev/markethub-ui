'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 10,
}: PriceRangeSliderProps) {
  const [localMin, setLocalMin] = useState(value[0])
  const [localMax, setLocalMax] = useState(value[1])

  useEffect(() => {
    setLocalMin(value[0])
    setLocalMax(value[1])
  }, [value])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value)
    if (newMin <= localMax) {
      setLocalMin(newMin)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value)
    if (newMax >= localMin) {
      setLocalMax(newMax)
    }
  }

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value) || min
    if (newMin <= localMax) {
      setLocalMin(newMin)
    }
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value) || max
    if (newMax >= localMin) {
      setLocalMax(newMax)
    }
  }

  const handleCommit = () => {
    onChange([localMin, localMax])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommit()
    }
  }

  const getPercent = (value: number) => {
    return ((value - min) / (max - min)) * 100
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="min-price" className="text-xs text-muted-foreground">
              Min
            </Label>
            <Input
              id="min-price"
              type="number"
              value={localMin}
              onChange={handleMinInputChange}
              onBlur={handleCommit}
              onKeyDown={handleKeyDown}
              min={min}
              max={localMax}
              step={step}
              className="text-sm"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="max-price" className="text-xs text-muted-foreground">
              Max
            </Label>
            <Input
              id="max-price"
              type="number"
              value={localMax}
              onChange={handleMaxInputChange}
              onBlur={handleCommit}
              onKeyDown={handleKeyDown}
              min={localMin}
              max={max}
              step={step}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <div className="relative pt-2">
        {/* Range slider track */}
        <div className="absolute top-5 h-1 w-full rounded-full bg-border"></div>

        {/* Active range highlight */}
        <div
          className="absolute top-5 h-1 rounded-full bg-accent"
          style={{
            left: `${getPercent(localMin)}%`,
            right: `${100 - getPercent(localMax)}%`,
          }}
        ></div>

        {/* Min input slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={handleMinChange}
          onMouseUp={handleCommit}
          onKeyUp={handleCommit}
          onTouchEnd={handleCommit}
          step={step}
          className="pointer-events-none absolute top-3 -z-10 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-0"
        />

        {/* Max input slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={handleMaxChange}
          onMouseUp={handleCommit}
          onKeyUp={handleCommit}
          onTouchEnd={handleCommit}
          step={step}
          className="pointer-events-none absolute top-3 -z-10 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-0"
        />
      </div>

      <div className="text-sm font-medium text-foreground">
        ${localMin} - ${localMax}
      </div>
    </div>
  )
}
