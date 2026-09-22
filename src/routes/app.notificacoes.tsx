import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import {
  formatDateTime,
  markAllNotificationsRead,
  markNotificationRead,
  removeNotification,
  useBank,
} from "@/lib/bank";

export const Route = createFileRoute("/app/notificacoes")({
  head: () => ({
    meta: [
      { title: "Notificações — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Central de notificações: Pix recebido, pagamentos, faturas, segurança e ofertas.",
      },
      { property: "og:title", content: "Notificações — Conta Empresas (demo)" },
      { property: "og:description", content: "Avisos de Pix, pagamentos, faturas e segurança." },
    ],
  }),
  component: NotificationsScreen,
});

function NotificationsScreen() {
  const { notifications } = useBank();

  return (
    <>
      <SubHeader title="Notificações" fallbackTo="/app" />
      <main className="px-4 py-5">
        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          <CheckCheck className="size-4" aria-hidden />
          Marcar todas como lidas
        </button>

        {notifications.length === 0 ? (
          <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-card">
            Nenhuma notificação por aqui.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`rounded-xl border bg-card p-4 shadow-card ${n.read ? "border-border" : "border-primary/40"}`}
              >
                <div className="flex items-start gap-3">
                  <Bell
                    className={`mt-0.5 size-5 shrink-0 ${n.read ? "text-muted-foreground" : "text-brand-red"}`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDateTime(n.createdAt)}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => markNotificationRead(n.id)}
                          className="text-sm font-medium text-primary"
                        >
                          Marcar como lida
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeNotification(n.id)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-red"
                      >
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
