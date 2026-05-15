"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "@/lib/icons";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  businessId: string;
  businessName: string;
}

export function ChatInterface({ businessId, businessName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setError(null);
    const userMessage: Message = { role: "user", content: trimmed };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          businessId,
          history: messages,
          message: trimmed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Onbekende fout");
        setSending(false);
        return;
      }

      setMessages([...newHistory, { role: "assistant", content: data.reply }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "onbekende fout";
      setError("Network fout: " + msg);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleReset() {
    setMessages([]);
    setError(null);
  }

  return (
    <div className="bg-paper border border-line rounded-2xl flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 border-b border-line flex items-center justify-between flex-shrink-0">
        <div>
          <div className="text-xs text-slate mb-0.5" style={{ letterSpacing: "0.02em" }}>
            Test chat
          </div>
          <div className="font-medium text-ink text-sm">
            Praat met de AI assistent van {businessName}
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-slate hover:text-ink transition"
            style={{ letterSpacing: "-0.2px" }}
          >
            Reset gesprek
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 min-h-0">
        {messages.length === 0 && !sending && (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-lime mx-auto mb-4 flex items-center justify-center">
              <span className="font-display font-semibold text-2xl text-ink" style={{ letterSpacing: "-0.8px" }}>
                AI
              </span>
            </div>
            <p className="text-sm text-ink-soft max-w-sm mx-auto" style={{ lineHeight: "1.55" }}>
              Stuur een bericht alsof je een klant bent. De AI antwoordt zoals hij dat zal doen op WhatsApp.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-cream border border-line rounded-2xl px-4 py-3 max-w-md">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-slate rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-slate rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mx-6 mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 flex-shrink-0">
          {error}
        </div>
      )}

      <div className="px-6 py-3 border-t border-line flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bijvoorbeeld: Ik wil een afspraak inplannen voor vrijdag..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl border border-line bg-paper focus:outline-none focus:border-ink text-ink text-sm resize-none"
            style={{ minHeight: "46px", maxHeight: "120px" }}
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="px-4 py-3 rounded-xl bg-ink text-cream font-medium hover:bg-ink-soft disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-2 text-sm"
            style={{ letterSpacing: "-0.2px" }}
          >
            Stuur
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-2xl px-4 py-3 max-w-md ${
          isUser ? "bg-ink text-cream" : "bg-cream border border-line text-ink"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap" style={{ lineHeight: "1.55" }}>
          {message.content}
        </p>
      </div>
    </div>
  );
}
