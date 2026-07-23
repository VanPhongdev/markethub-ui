'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 1. Cart Drawer Slide Right Transition Template
interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function CartDrawerTemplate({ isOpen, onClose, children }: CartDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          />
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card shadow-2xl border-l border-border p-6 flex flex-col"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// 2. Checkout Step Slide Transition Template
interface StepTransitionProps {
  currentStep: number
  children: React.ReactNode
}

export function StepTransitionTemplate({ currentStep, children }: StepTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// 3. Modal Scale + Fade Transition Template
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function ModalTemplate({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl overflow-hidden"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// 4. Toast Slide Down Transition Template
interface ToastProps {
  isOpen: boolean
  message: string
  onClose: () => void
}

export function ToastTemplate({ isOpen, message, onClose }: ToastProps) {
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 15, stiffness: 150 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-3 shadow-lg border border-primary/20 max-w-sm w-full"
        >
          <div className="flex-1 text-sm font-medium">{message}</div>
          <button
            onClick={onClose}
            className="text-primary-foreground/75 hover:text-primary-foreground text-xs"
          >
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
