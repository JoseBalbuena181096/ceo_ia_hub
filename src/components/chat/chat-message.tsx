'use client'

import { memo } from 'react'
import { User, Bot, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

function MessageContent({ content }: { content: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Simple markdown-like rendering without external dependencies
  // Handles: bold, code blocks, inline code, links, lists
  const renderContent = (text: string) => {
    if (!text) return null

    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeContent = ''
    let codeBlockIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          const idx = codeBlockIndex
          const code = codeContent
          elements.push(
            <div key={`code-${i}`} className="relative group my-2">
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
                <code>{code}</code>
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code)
                  setCopiedIndex(idx)
                  setTimeout(() => setCopiedIndex(null), 2000)
                }}
                className="absolute top-2 right-2 p-1 rounded bg-gray-700 text-gray-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copiar"
              >
                {copiedIndex === idx ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          )
          codeContent = ''
          inCodeBlock = false
        } else {
          inCodeBlock = true
          codeBlockIndex = i
          codeContent = ''
        }
        continue
      }

      if (inCodeBlock) {
        codeContent += (codeContent ? '\n' : '') + line
        continue
      }

      // Empty lines
      if (!line.trim()) {
        elements.push(<br key={`br-${i}`} />)
        continue
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(<h4 key={i} className="font-bold text-sm mt-2 mb-1">{processInline(line.slice(4))}</h4>)
        continue
      }
      if (line.startsWith('## ')) {
        elements.push(<h3 key={i} className="font-bold text-sm mt-2 mb-1">{processInline(line.slice(3))}</h3>)
        continue
      }

      // List items
      if (line.match(/^[-*] /)) {
        elements.push(
          <div key={i} className="flex gap-1.5 ml-2">
            <span className="text-gray-400 flex-shrink-0">•</span>
            <span>{processInline(line.slice(2))}</span>
          </div>
        )
        continue
      }

      // Numbered lists
      if (line.match(/^\d+\. /)) {
        const match = line.match(/^(\d+)\. (.*)/)
        if (match) {
          elements.push(
            <div key={i} className="flex gap-1.5 ml-2">
              <span className="text-gray-400 flex-shrink-0">{match[1]}.</span>
              <span>{processInline(match[2])}</span>
            </div>
          )
          continue
        }
      }

      // Regular paragraph
      elements.push(<p key={i}>{processInline(line)}</p>)
    }

    return <>{elements}</>
  }

  // Process inline markdown: bold, italic, inline code, links
  const processInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let remaining = text
    let key = 0

    while (remaining.length > 0) {
      // Bold **text**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
      // Inline code `text`
      const codeMatch = remaining.match(/`([^`]+)`/)
      // Links [text](url)
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
      // Italic *text*
      const italicMatch = remaining.match(/\*([^*]+)\*/)

      // Find the earliest match
      const matches = [
        boldMatch ? { type: 'bold', match: boldMatch } : null,
        codeMatch ? { type: 'code', match: codeMatch } : null,
        linkMatch ? { type: 'link', match: linkMatch } : null,
        italicMatch ? { type: 'italic', match: italicMatch } : null,
      ].filter(Boolean).sort((a, b) => (a!.match.index || 0) - (b!.match.index || 0))

      if (matches.length === 0) {
        parts.push(remaining)
        break
      }

      const first = matches[0]!
      const idx = first.match.index || 0

      // Add text before match
      if (idx > 0) {
        parts.push(remaining.slice(0, idx))
      }

      switch (first.type) {
        case 'bold':
          parts.push(<strong key={key++}>{first.match[1]}</strong>)
          break
        case 'code':
          parts.push(
            <code key={key++} className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
              {first.match[1]}
            </code>
          )
          break
        case 'link':
          parts.push(
            <a key={key++} href={first.match[2]} target="_blank" rel="noopener noreferrer"
               className="text-viad-blue hover:underline">
              {first.match[1]}
            </a>
          )
          break
        case 'italic':
          parts.push(<em key={key++}>{first.match[1]}</em>)
          break
      }

      remaining = remaining.slice(idx + first.match[0].length)
    }

    return <>{parts}</>
  }

  return (
    <div className="text-sm leading-relaxed space-y-1 [overflow-wrap:anywhere]">
      {renderContent(content)}
    </div>
  )
}

export const ChatMessage = memo(function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
        isUser
          ? 'bg-viad-blue/20 text-viad-blue'
          : 'bg-viad-navy text-white'
      }`}>
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div className={`max-w-[85%] rounded-xl px-3 py-2 break-words overflow-hidden ${
        isUser
          ? 'bg-viad-navy text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
      }`}>
        <MessageContent content={content} />
      </div>
    </div>
  )
})
