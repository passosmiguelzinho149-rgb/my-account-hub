import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { BrandHeader } from "@/components/app/BrandHeader";

export const Route = createFileRoute("/app/chat")({
  head: () => ({
    meta: [
      { title: "Chat — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Atendimento simulado da Agência Digital Empresas, das 8h às 20h em dias úteis.",
      },
      { property: "og:title", content: "Chat — Conta Empresas (demo)" },
      { property: "og:description", content: "Atendimento simulado da Agência Digital Empresas." },
    ],
  }),
  component: ChatScreen,
});

interface Message {
  id: number;
  from: "bot" | "me";
  text: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    from: "bot",
    text: "Olá! Sou o atendimento da Agência Digital Empresas. Como posso ajudar hoje?",
  },
  {
    id: 2,
    from: "bot",
    text: "Este é um chat de demonstração — nenhuma mensagem é enviada de verdade.",
  },
];

function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: "me", text },
      {
        id: prev.length + 2,
        from: "bot",
        text: "Recebemos sua mensagem. Um especialista responderá em até 1 dia útil.",
      },
    ]);
    setDraft("");
  };

  return (
    <>
      <BrandHeader />
      <main className="flex min-h-[60vh] flex-col px-4 py-5">
        <h1 className="text-2xl font-bold">Chat</h1>
        <ul className="mt-4 flex-1 space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={
                m.from === "me"
                  ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground"
                  : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-2.5 shadow-card"
              }
            >
              <p className="text-sm break-words">{m.text}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={send} className="mt-4 flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escreva sua mensagem"
            aria-label="Escreva sua mensagem"
            className="min-w-0 flex-1 rounded-full border border-border bg-card px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            aria-label="Enviar mensagem"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <Send className="size-5" aria-hidden />
          </button>
        </form>
      </main>
    </>
  );
}