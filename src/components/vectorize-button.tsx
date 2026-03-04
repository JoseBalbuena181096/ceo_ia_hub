'use client'

import { useState } from 'react'
import { Zap, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const API_URL = process.env.NEXT_PUBLIC_VIAD_BOT_API_URL || 'http://localhost:8000'

interface VectorizeButtonProps {
  type: 'prompt' | 'video'
  itemId: string
}

export function VectorizeButton({ type, itemId }: VectorizeButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleVectorize = async () => {
    setStatus('loading')
    setMessage('')

    try {
      const body = type === 'prompt'
        ? { prompt_id: itemId }
        : { video_id: itemId }

      const res = await fetch(`${API_URL}/api/v1/vectorize/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Error al vectorizar')
      }

      const data = await res.json()
      setStatus('success')
      setMessage(`Vectorizado: ${data.title}`)
      setTimeout(() => { setStatus('idle'); setMessage('') }, 3000)
    } catch (e: any) {
      setStatus('error')
      setMessage(e.message || 'Error desconocido')
      setTimeout(() => { setStatus('idle'); setMessage('') }, 5000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleVectorize}
        disabled={status === 'loading'}
        className={
          status === 'success' ? 'border-green-500 text-green-600' :
          status === 'error' ? 'border-red-500 text-red-600' :
          ''
        }
      >
        {status === 'loading' && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
        {status === 'success' && <Check className="h-4 w-4 mr-1" />}
        {status === 'error' && <AlertCircle className="h-4 w-4 mr-1" />}
        {status === 'idle' && <Zap className="h-4 w-4 mr-1" />}
        {status === 'loading' ? 'Vectorizando...' :
         status === 'success' ? 'Vectorizado' :
         status === 'error' ? 'Error' :
         'Vectorizar para IA'}
      </Button>
      {message && (
        <span className={`text-xs ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </span>
      )}
    </div>
  )
}
