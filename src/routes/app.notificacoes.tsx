import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import {
  formatDateTime,
  markAllNotificationsRead,
  markNotificationRead,
  removeNotification,
  useBank,
} from "@/lib/bank";
import { formatBRL } from "@/lib/mock-data";

export const Route = createFileRoute("/app/notificacoes")({
  head: () => ({
    meta: [
      { title: "Notificações — Conta Empresas" },
      { name: "description", content: "Central de notificações: Pix recebido, pagamentos, faturas, segurança e ofertas." },
      { property: "og:title", content: "Notificações — Conta Empresas" },
      { property: "og:description", content: "Avisos de Pix, pagamentos, faturas e segurança." },
    ],
  }),
  component: NotificationsScreen,
});

function NotificationsScreen() {
  const { notifications } = useBank();
  const [patriciaVisible, setPatriciaVisible] = useState(true);
  const [patriciaRead, setPatriciaRead] = useState(false);

  const markAll = () => {
    setPatriciaRead(true);
    markAllNotificationsRead();
  };

  return (
    <>
      <SubHeader title="Notificações" fallbackTo="/app" />
      <main className="px-4 py-5">
        <button type="button" onClick={markAll} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <CheckCheck className="size-4" aria-hidden />
          Marcar todas como lidas
        </button>

        {patriciaVisible && (
          <section className={`mt-4 rounded-xl border bg-card p-4 shadow-card ${patriciaRead ? "border-border" : "border-primary/40"}`}>
            <div className="flex items-start gap-3">
              <Bell className={`mt-0.5 size-5 shrink-0 ${patriciaRead ? "text-muted-foreground" : "text-brand-red"}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Pix recebido</p>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Simulado</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Você recebeu {formatBRL(7_018_585)} de PATRICIA RODRIGUES.</p>
                <p className="mt-2 text-xs text-muted-foreground">19/09/2026 às 11:35:00</p>
                <div className="mt-3 flex items-center gap-4">
                  {!patriciaRead && <button type="button" onClick={() => setPatriciaRead(true)} className="text-sm font-medium text-primary">Marcar como lida</button>}
                  <button type="button" onClick={() => setPatriciaVisible(false)} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-red">
                    <Trash2 className="size-4" aria-hidden />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {notifications.length === 0 && !patriciaVisible ? (
          <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-card">Nenhuma notificação por aqui.</p>
        ) : (
          <ul className={`${patriciaVisible ? "mt-3" : "mt-4"} space-y-3`}>
            {notifications.map((n) => (
              <li key={n.id} className={`rounded-xl border bg-card p-4 shadow-card ${n.read ? "border-border" : "border-primary/40"}`}>
                <div className="flex items-start gap-3">
                  <Bell className={`mt-0.5 size-5 shrink-0 ${n.read ? "text-muted-foreground" : "text-brand-red"}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</p>
                    <div className="mt-3 flex items-center gap-4">
                      {!n.read && <button type="button" onClick={() => markNotificationRead(n.id)} className="text-sm font-medium text-primary">Marcar como lida</button>}
                      <button type="button" onClick={() => removeNotification(n.id)} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-red">
                        <Trash2 className="size-4" aria-hidden />
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
