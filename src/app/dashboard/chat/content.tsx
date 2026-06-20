"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import Markdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { TypingIndicator } from "@/components/ui/loading"
import { useLanguage } from "@/lib/i18n/context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

const AVAILABLE_MODELS = [
  { id: "qwen", name: "Qwen", supportsVision: true },
  { id: "deepseek", name: "DeepSeek", supportsVision: false },
]

export default function ChatPage() {
  const { data: session } = useSession()
  const { t, locale } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("qwen")
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [feedbackSent, setFeedbackSent] = useState<Record<string, string>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Get last assistant message ID for feedback button
  const lastAssistantMessageId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && m.content)?.id
  const searchParams = useSearchParams()

  // Load history or context on mount
  useEffect(() => {
    const historyId = searchParams.get("history")
    const contextMessage = searchParams.get("context")
    
    if (historyId) {
      loadHistory(historyId)
    } else if (contextMessage) {
      // Auto-send the context message
      sendContextMessage(contextMessage)
    }
  }, [searchParams])

  const sendContextMessage = async (context: string) => {
    setLoading(true)
    
    // Add empty assistant message for streaming (AI speaks first)
    const assistantMessageId = `assistant-${Date.now()}`
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    }
    setMessages([assistantMessage])
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: context,
          model: selectedModel,
          locale,
          isContextInit: true,
        }),
      })
      
      if (!response.ok) throw new Error("Failed")
      
      const newConversationId = response.headers.get("X-Conversation-Id")
      if (newConversationId) setConversationId(newConversationId)
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (reader) {
        let accumulatedContent = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          accumulatedContent += chunk
          setMessages([{ id: assistantMessageId, role: "assistant", content: accumulatedContent, createdAt: new Date().toISOString() }])
        }
      }
    } catch (err) {
      setMessages([{ id: assistantMessageId, role: "assistant", content: t.chat.failedToGetResponse, createdAt: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`)
      if (response.ok) {
        const data = await response.json()
        const conv = data.conversation
        setConversationId(conv.id)
        setSelectedModel(conv.model)
        setMessages(
          conv.messages.map((m: { id: string; role: string; content: string; createdAt: string }) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            createdAt: m.createdAt,
          }))
        )
      }
    } catch (error) {
      console.error("Failed to load history:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Add empty assistant message for streaming
    const assistantMessageId = `assistant-${Date.now()}`
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          model: selectedModel,
          conversationId,
          locale,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      // Get conversation ID from header
      const newConversationId = response.headers.get("X-Conversation-Id")
      if (newConversationId) {
        setConversationId(newConversationId)
      }

      // Stream the response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let accumulatedContent = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          accumulatedContent += chunk

          // Update the assistant message with accumulated content
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: accumulatedContent }
                : m
            )
          )
        }
      }
    } catch (err) {
      // Update the empty message with error
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? { ...m, content: t.chat.failedToGetResponse }
            : m
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFeedback = async (messageId: string, feedback: "thumbs_up" | "thumbs_down") => {
    try {
      await fetch("/api/chat/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, feedback, conversationId }),
      })
      setFeedbackSent((prev) => ({ ...prev, [messageId]: feedback }))
    } catch (error) {
      console.error("Failed to send feedback:", error)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-title font-bold text-ink">
            {t.chat.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted">{t.chat.model}:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1.5 border border-hairline rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {AVAILABLE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-white border border-hairline rounded-xl p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-muted">?</div>
            <h2 className="text-2xl font-semibold text-ink mb-2">
              {t.chat.greeting}
            </h2>
            <p className="text-lg text-muted max-w-md mx-auto">{t.chat.greetingDesc}</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-4 ${
                message.role === "user"
                  ? "bg-primary text-white"
                  : "bg-surface-soft text-ink"
              }`}
            >
              {message.role === "assistant" && (
                <div className="text-xs text-muted mb-1">
                  {t.chat.aiCoachLabel}
                </div>
              )}
              <div className="whitespace-pre-wrap">
                {message.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none">
                    <Markdown>{message.content}</Markdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
              {/* Thumbs up button inside assistant message */}
              {message.role === "assistant" && message.content && (
                <div className="mt-2 pt-2 border-t border-hairline/50 flex justify-end">
                  {!feedbackSent[message.id] ? (
                    <button
                      onClick={() => handleFeedback(message.id, "thumbs_up")}
                      className="p-1 rounded hover:bg-green-100 text-muted hover:text-green-600 transition-colors"
                      title={locale === "zh" ? "有帮助" : "Helpful"}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </button>
                  ) : (
                    <span className="text-xs text-muted">
                      {locale === "zh" ? "已标记" : "Marked"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-soft rounded-xl">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.chat.typeMessage}
          disabled={loading}
          className="flex-1 px-4 py-3 border border-hairline rounded-xl focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-base"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          size="lg"
        >
          {t.send}
        </Button>
      </div>
    </div>
  )
}
