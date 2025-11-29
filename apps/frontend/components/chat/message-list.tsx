"use client"

import { useEffect, useRef } from "react"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        <div className="text-center">
          <Bot className="mx-auto h-12 w-12 mb-4" />
          <p className="text-lg">No messages yet. Start a conversation!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-4",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600">
              <Bot className="h-5 w-5 text-white" />
            </div>
          )}

          <div
            className={cn(
              "max-w-[70%] rounded-2xl px-4 py-3",
              message.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900"
            )}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            <p
              className={cn(
                "mt-2 text-xs",
                message.role === "user" ? "text-blue-100" : "text-gray-500"
              )}
            >
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>

          {message.role === "user" && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-600">
              <User className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
