"use client"

import React from 'react'
import type { ToastType } from '@/lib/types'

interface ToastProps {
  message: string
  type: ToastType
  onClose?: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  if (!message) return null

  const bgColor = 
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    type === 'warning' ? 'bg-yellow-500' :
    'bg-blue-500'

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg max-w-xs`}>
        <div className="flex justify-between items-center">
          <p>{message}</p>
          {onClose && (
            <button 
              onClick={onClose}
              className="ml-3 text-white hover:text-gray-200 focus:outline-none"
            >
              &times;
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
