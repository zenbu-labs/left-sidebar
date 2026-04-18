import { useEffect, useMemo, useRef } from "react"
import {
  useCollection,
  useDb,
} from "@testbu/init/src/renderer/lib/kyju-react"

const searchParams = new URLSearchParams(window.location.search)
const agentId = searchParams.get("agentId") ?? ""
const isMinimap = searchParams.get("minimap") === "true"
const isSidebar = searchParams.get("sidebar") === "true"

const SIDEBAR_WIDTH = 220

export function ChatContentAdvice(Original: any, props: any) {
  if (isMinimap || isSidebar) return Original(props)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <UserMessagesSidebar />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {Original(props)}
      </div>
    </div>
  )
}

type UserEntry = { key: string; text: string; timestamp: number }

function UserMessagesSidebar() {
  const agents = useDb((root: any) => root.plugin.kernel.agents) as
    | Array<{ id: string; eventLog?: { collectionId: string } }>
    | undefined
  const agent = agents?.find((a) => a.id === agentId)
  const { items: events } = useCollection(agent?.eventLog) as {
    items: Array<{ timestamp: number; data: any }>
  }

  const userMessages: UserEntry[] = useMemo(() => {
    if (!events) return []
    const out: UserEntry[] = []
    for (let i = 0; i < events.length; i++) {
      const ev = events[i]
      if (ev?.data?.kind === "user_prompt") {
        const text: string = ev.data.text ?? ""
        out.push({
          key: `${ev.timestamp}-${i}`,
          text,
          timestamp: ev.timestamp,
        })
      }
    }
    return out
  }, [events])

  return (
    <div
      style={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: "#F4F4F4",
        borderRight: "1px solid #BDBDBD",
      }}
    >
      <MessagesList messages={userMessages} />
    </div>
  )
}

function MessagesList({ messages }: { messages: UserEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length])

  return (
    <div
      ref={scrollRef}
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.length === 0 ? (
        <div
          style={{
            marginTop: "auto",
            padding: "16px 8px",
            fontSize: 11,
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          No messages yet
        </div>
      ) : (
        <div style={{ marginTop: "auto" }}>
          {messages.map((m) => (
            <UserMessageCard key={m.key} text={m.text} />
          ))}
        </div>
      )}
    </div>
  )
}

function UserMessageCard({ text }: { text: string }) {
  return (
    <div
      className="group"
      style={{
        borderRadius: 8,
        border: "1px solid #D4D4D4",
        background: "#FFFFFF",
        padding: "6px 10px",
        marginTop: 6,
        color: "#171717",
        fontSize: 11,
        lineHeight: 1.45,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
        cursor: "default",
      }}
      title={text}
    >
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {text || <span style={{ color: "#d1d5db" }}>(empty)</span>}
      </div>
    </div>
  )
}
