import { useEffect, useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { BotIcon, SendIcon, UserRoundIcon, XIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { base } from "@/services/base"

function sendTutorMessage({ message, sessionId, lessonId }) {
  return base("ai/tutor", {
    method: "POST",
    data: { message, sessionId, lessonId: Number(lessonId) },
  })
}

function ChatMessage({ role, text }) {
  const isUser = role === "user"
  return (
    <div
      className={cn(
        "flex items-start gap-2.5",
        isUser && "flex-row-reverse"
      )}
    >
      <Avatar className="size-7 shrink-0">
        <AvatarFallback
          className={cn(
            isUser
              ? "bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          {isUser ? (
            <UserRoundIcon className="size-3.5" aria-hidden="true" />
          ) : (
            <BotIcon className="size-3.5" aria-hidden="true" />
          )}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6",
          isUser
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm bg-muted"
        )}
      >
        {text}
      </div>
    </div>
  )
}

/**
 * AI Coach chat for the study environment. Talks to the real tutor endpoint
 * (POST /api/ai/tutor) with a per-lesson session id.
 */
export default function AiCoachPanel({ lessonId, lessonName, onClose }) {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState("")
  const [sessionId] = useState(() => crypto.randomUUID())
  const scrollRef = useRef(null)

  useEffect(() => {
    // Reset the conversation when the learner moves to another lesson.
    setMessages([])
  }, [lessonId])

  useEffect(() => {
    const viewport = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    )
    if (viewport) viewport.scrollTop = viewport.scrollHeight
  }, [messages])

  const chatMutation = useMutation({
    mutationFn: (message) =>
      sendTutorMessage({ message, sessionId, lessonId }),
    onSuccess: (response) => {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: response?.reply ?? "" },
      ])
    },
    onError: () => {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "I couldn't answer that right now. Please try again in a moment.",
        },
      ])
    },
  })

  const handleSend = (event) => {
    event.preventDefault()
    const message = draft.trim()
    if (!message || chatMutation.isPending) return
    setMessages((current) => [...current, { role: "user", text: message }])
    setDraft("")
    chatMutation.mutate(message)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <BotIcon className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">AI Coach</p>
            <p className="truncate text-xs text-muted-foreground">
              {lessonName ?? "This lesson"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close AI Coach"
        >
          <XIcon />
        </Button>
      </header>

      <ScrollArea ref={scrollRef} className="min-h-0 flex-1 px-4 py-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="rounded-2xl bg-muted/60 p-4 text-sm leading-6 text-muted-foreground">
              Ask me anything about this lesson — I can explain concepts,
              give examples, or quiz your understanding.
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={index} role={message.role} text={message.text} />
            ))
          )}
          {chatMutation.isPending ? (
            <div className="flex items-start gap-2.5">
              <Avatar className="size-7 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <BotIcon className="size-3.5" aria-hidden="true" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-3">
                <Skeleton className="h-2.5 w-32" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
          ) : null}
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-3">
        <label className="sr-only" htmlFor="ai-coach-input">
          Message the AI Coach
        </label>
        <Input
          id="ai-coach-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about this lesson..."
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!draft.trim() || chatMutation.isPending}
          aria-label="Send message"
        >
          <SendIcon />
        </Button>
      </form>
    </div>
  )
}
