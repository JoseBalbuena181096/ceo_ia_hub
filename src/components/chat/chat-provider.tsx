'use client'

import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues
const ChatWidget = dynamic(
  () => import('./chat-widget').then(mod => ({ default: mod.ChatWidget })),
  { ssr: false }
)

export function ChatProvider() {
  return <ChatWidget />
}
