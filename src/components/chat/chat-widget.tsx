'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageCircle, X, Plus, Trash2, Paperclip, Send, Loader2, ChevronLeft, Search, Maximize2, Minimize2 } from 'lucide-react'
import { ChatMessage } from './chat-message'

interface Message {
  id?: string
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  updated_at: string
  last_message?: string | null
}

interface FilePreview {
  file: File
  name: string
  type: string
  dataUrl?: string
}

const API_URL = process.env.NEXT_PUBLIC_VIAD_BOT_API_URL || 'http://localhost:8000'

export function ChatWidget({ serverUserId }: { serverUserId?: string | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [userId, setUserId] = useState<string | null>(serverUserId ?? null)

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  // Messages
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toolStatus, setToolStatus] = useState<string | null>(null)

  // Files
  const [files, setFiles] = useState<FilePreview[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auth check — poll session until available (covers login redirect timing)
  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    const checkAuth = async () => {
      // Try getSession first (reads local cookie, fast)
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserId(session.user.id)
        return
      }
      // If no session yet, retry a few times (login redirect timing)
      for (let i = 0; i < 5; i++) {
        if (cancelled) return
        await new Promise(r => setTimeout(r, 500))
        const { data: { session: s } } = await supabase.auth.getSession()
        if (s?.user) {
          setUserId(s.user.id)
          return
        }
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  // Load conversations when sidebar opens
  useEffect(() => {
    if (showSidebar && userId) {
      loadConversations()
    }
  }, [showSidebar, userId])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    if (!userId) return
    try {
      const res = await fetch(`${API_URL}/api/v1/conversations?user_id=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
      }
    } catch (e) {
      console.error('Error loading conversations:', e)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/conversations/${conversationId}/messages`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.map((m: any) => ({ id: m.id, role: m.role, content: m.content })))
      }
    } catch (e) {
      console.error('Error loading messages:', e)
    }
  }

  const selectConversation = async (conv: Conversation) => {
    setActiveConversationId(conv.id)
    await loadMessages(conv.id)
    setShowSidebar(false)
  }

  const startNewConversation = () => {
    setActiveConversationId(null)
    setMessages([])
    setShowSidebar(false)
  }

  const deleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await fetch(`${API_URL}/api/v1/conversations/${convId}`, { method: 'DELETE' })
      setConversations(prev => prev.filter(c => c.id !== convId))
      if (activeConversationId === convId) {
        setActiveConversationId(null)
        setMessages([])
      }
    } catch (e) {
      console.error('Error deleting conversation:', e)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const previews: FilePreview[] = selectedFiles.map(file => {
      const preview: FilePreview = { file, name: file.name, type: file.type }
      if (file.type.startsWith('image/')) {
        preview.dataUrl = URL.createObjectURL(file)
      }
      return preview
    })
    setFiles(prev => [...prev, ...previews])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index: number) => {
    setFiles(prev => {
      const removed = prev[index]
      if (removed.dataUrl) URL.revokeObjectURL(removed.dataUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1]) // Remove data:...;base64, prefix
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const sendMessage = async () => {
    if ((!input.trim() && files.length === 0) || !userId || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)
    setToolStatus(null)

    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    // Prepare files
    const fileAttachments = await Promise.all(
      files.map(async (f) => ({
        filename: f.name,
        mime_type: f.type,
        data: await fileToBase64(f.file),
      }))
    )

    // Clean up file previews
    files.forEach(f => { if (f.dataUrl) URL.revokeObjectURL(f.dataUrl) })
    setFiles([])

    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch(`${API_URL}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage,
          user_id: userId,
          conversation_id: activeConversationId,
          files: fileAttachments.length > 0 ? fileAttachments : undefined,
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      // Parse SSE stream
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      if (!reader) throw new Error('No response body')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            const eventType = line.slice(7).trim()
            continue
          }

          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6)
            try {
              const data = JSON.parse(dataStr)

              // We need to track the event type from the previous line
              // SSE format: event: <type>\ndata: <json>\n\n
              // Let's parse differently
            } catch {
              // ignore parse errors
            }
          }
        }
      }

    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => {
        const updated = [...prev]
        const lastIdx = updated.length - 1
        if (updated[lastIdx]?.role === 'assistant' && !updated[lastIdx].content) {
          updated[lastIdx] = {
            role: 'assistant',
            content: 'Lo siento, hubo un error al procesar tu mensaje. Intenta de nuevo.',
          }
        }
        return updated
      })
    } finally {
      setIsLoading(false)
      setToolStatus(null)
    }
  }

  // Better SSE parsing
  const sendMessageSSE = useCallback(async () => {
    if ((!input.trim() && files.length === 0) || !userId || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)
    setToolStatus(null)

    // Build display content with file indicators (UI only, not sent to backend)
    let displayContent = userMessage
    if (files.length > 0) {
      const fileLabels = files.map(f =>
        f.type.startsWith('image/') ? `[Imagen: ${f.name}]` : `[Archivo: ${f.name}]`
      )
      displayContent = displayContent
        ? `${displayContent}\n${fileLabels.join('\n')}`
        : fileLabels.join('\n')
    }

    setMessages(prev => [...prev, { role: 'user', content: displayContent }])

    const fileAttachments = await Promise.all(
      files.map(async (f) => ({
        filename: f.name,
        mime_type: f.type,
        data: await fileToBase64(f.file),
      }))
    )

    files.forEach(f => { if (f.dataUrl) URL.revokeObjectURL(f.dataUrl) })
    setFiles([])

    // Add empty assistant message
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch(`${API_URL}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage,
          user_id: userId,
          conversation_id: activeConversationId,
          files: fileAttachments.length > 0 ? fileAttachments : undefined,
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response body')

      let buffer = ''
      let currentEvent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete SSE messages (handle both \r\n and \n line endings)
        const normalized = buffer.replace(/\r\n/g, '\n')
        buffer = normalized

        while (buffer.includes('\n\n')) {
          const idx = buffer.indexOf('\n\n')
          const block = buffer.slice(0, idx)
          buffer = buffer.slice(idx + 2)

          let eventType = ''
          let eventData = ''

          for (const rawLine of block.split('\n')) {
            const line = rawLine.trim()
            if (line.startsWith('event:')) {
              eventType = line.slice(6).trim()
            } else if (line.startsWith('data:')) {
              eventData = line.slice(5).trim()
            }
          }

          if (!eventData) continue

          try {
            const data = JSON.parse(eventData)

            switch (eventType) {
              case 'token':
                // Append token to the last assistant message
                setMessages(prev => {
                  const updated = [...prev]
                  const lastIdx = updated.length - 1
                  if (updated[lastIdx]?.role === 'assistant') {
                    updated[lastIdx] = {
                      ...updated[lastIdx],
                      content: updated[lastIdx].content + (data.content || ''),
                    }
                  }
                  return updated
                })
                break

              case 'tool_call':
                const toolNames: Record<string, string> = {
                  search_library: 'Buscando en biblioteca de prompts...',
                  search_videos: 'Buscando videos...',
                  generate_prompt: 'Generando prompt personalizado...',
                }
                setToolStatus(toolNames[data.tool] || `Usando ${data.tool}...`)
                break

              case 'tool_result':
                setToolStatus(null)
                break

              case 'metadata':
                if (data.conversation_id && !activeConversationId) {
                  setActiveConversationId(data.conversation_id)
                }
                break

              case 'error':
                setMessages(prev => {
                  const updated = [...prev]
                  const lastIdx = updated.length - 1
                  if (updated[lastIdx]?.role === 'assistant') {
                    updated[lastIdx] = {
                      ...updated[lastIdx],
                      content: `Error: ${data.message || 'Error desconocido'}`,
                    }
                  }
                  return updated
                })
                break

              case 'done':
                break
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => {
        const updated = [...prev]
        const lastIdx = updated.length - 1
        if (updated[lastIdx]?.role === 'assistant' && !updated[lastIdx].content) {
          updated[lastIdx] = {
            role: 'assistant',
            content: 'Lo siento, hubo un error de conexión. Intenta de nuevo.',
          }
        }
        return updated
      })
    } finally {
      setIsLoading(false)
      setToolStatus(null)
    }
  }, [input, files, userId, isLoading, activeConversationId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessageSSE()
    }
  }

  // Don't render if not authenticated
  if (!userId) return null

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-viad-navy text-white shadow-lg hover:bg-viad-navy-light transition-colors"
          aria-label="Abrir VIAD Bot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className={`fixed z-50 flex flex-col rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 transition-all duration-300 ${
            isExpanded
              ? 'bottom-4 right-4 w-[700px] h-[85vh] max-w-[calc(100vw-2rem)]'
              : 'bottom-6 right-6 w-[420px] h-[600px] max-h-[80vh] max-w-[calc(100vw-2rem)]'
          }`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-viad-navy rounded-t-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="text-white/80 hover:text-white transition-colors"
                title="Conversaciones"
              >
                <ChevronLeft className={`h-5 w-5 transition-transform ${showSidebar ? 'rotate-0' : 'rotate-180'}`} />
              </button>
              <div>
                <h3 className="font-semibold text-white text-sm">VIAD Bot</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-white/70">En línea</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white/80 hover:text-white transition-colors p-1"
                title={isExpanded ? 'Reducir' : 'Ampliar'}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            {showSidebar && (
              <div className="w-full border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={startNewConversation}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-viad-navy rounded-lg hover:bg-viad-navy-light transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Nueva conversación
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {conversations.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500 text-center">No hay conversaciones</p>
                  ) : (
                    conversations.map(conv => (
                      <button
                        key={conv.id}
                        onClick={() => selectConversation(conv)}
                        className={`w-full text-left px-3 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group ${
                          activeConversationId === conv.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {conv.title}
                            </p>
                            {conv.last_message && (
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {conv.last_message}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => deleteConversation(conv.id, e)}
                            className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Chat area */}
            {!showSidebar && (
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle className="h-12 w-12 text-viad-blue/30 mb-3" />
                      <p className="text-sm text-gray-500">
                        Hola, soy <strong>VIAD Bot</strong>. Tu asistente de IA Generativa del CEO.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Pregúntame sobre prompts, herramientas de IA o busca videos de microaprendizaje.
                      </p>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <ChatMessage key={i} role={msg.role} content={msg.content} />
                  ))}

                  {/* Tool status indicator */}
                  {toolStatus && (
                    <div className="flex items-center gap-2 text-xs text-viad-blue">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      {toolStatus}
                    </div>
                  )}

                  {/* Loading indicator */}
                  {isLoading && !toolStatus && messages[messages.length - 1]?.content === '' && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Pensando...
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* File previews */}
                {files.length > 0 && (
                  <div className="px-4 pb-2 flex gap-2 flex-wrap">
                    {files.map((f, i) => (
                      <div key={i} className="relative group">
                        {f.dataUrl ? (
                          <img
                            src={f.dataUrl}
                            alt={f.name}
                            className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="h-16 w-16 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800">
                            <Paperclip className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(i)}
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <p className="text-[10px] text-gray-500 truncate w-16 text-center mt-0.5">
                          {f.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input area */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-end gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*,.pdf,.txt,.py,.js,.ts,.json,.csv,.md"
                      onChange={handleFileChange}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                      title="Adjuntar archivo"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Escribe tu mensaje..."
                      rows={1}
                      className="flex-1 resize-none rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-viad-navy dark:text-gray-100"
                      style={{ maxHeight: '120px' }}
                    />
                    <button
                      onClick={sendMessageSSE}
                      disabled={isLoading || (!input.trim() && files.length === 0)}
                      className="flex-shrink-0 p-2 rounded-lg bg-viad-navy text-white hover:bg-viad-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
