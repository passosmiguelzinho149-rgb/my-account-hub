import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/app/privacidade")({
  head: () => ({
    meta: [
      { title: "Gerenciar dados e privacidade — Conta Empresas (demo)" },
      {
        name: "description",
        content:
          "Controles de consentimento de uso de dados e opção de apagar os dados da demonstração.",
      },
      { property: "og:title", content: "Gerenciar dados e privacidade — Conta Empresas (demo)" },
      {
        property: "og:description",
        content: "Controles de consentimento de uso de dados e exclusão de dados da demonstração.",
      },
    ],
  }),
  component: PrivacidadeScreen,
});

const STORAGE_KEY = "bradesco-demo-privacy";

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  defaultValue: boolean;
}

const consents: ConsentItem[] = [
  {
    id: "open-finance",
    title: "Compartilhamento Open Finance",
    description: "Permitir o compartilhamento dos seus dados com outras instituições autorizadas.",
    defaultValue: false,
  },
  {
    id: "email-marketing",
    title: "Comunicações por e-mail",
    description: "Receber ofertas, novidades e avisos da conta por e-mail.",
    defaultValue: true,
  },
  {
    id: "push-notifications",
    title: "Notificações push",
    description: "Receber alertas de movimentação e lembretes no dispositivo.",
    defaultValue: true,
  },
  {
    id: "personalizacao",
    title: "Personalização de ofertas",
    description: "Usar seus dados para recomendar produtos e serviços relevantes.",
    defaultValue: false,
  },
  {
    id: "analytics",
    title: "Dados de uso e melhoria",
    description: "Compartilhar dados anônimos de uso para melhorar o aplicativo.",
    defaultValue: true,
  },
];

type ConsentMap = Record<string, boolean>;

function readConsents(): ConsentMap | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentMap;
  } catch {
    return null;
  }
}

function defaultConsents(): ConsentMap {
  return Object.fromEntries(consents.map((c) => [c.id, c.defaultValue]));
}

function PrivacidadeScreen() {
  const { signOut } = useSession();
  const navigate = useNavigate();
  const [values, setValues] = useState<ConsentMap>(defaultConsents);

  // Lê os consentimentos salvos apenas após a hidratação (localStorage indisponível no SSR).
  useEffect(() => {
    const stored = readConsents();
    if (stored) setValues({ ...defaultConsents(), ...stored });
  }, []);

  const toggle = (id: string, checked: boolean) => {
    setValues((prev) => {
      const next = { ...prev, [id]: checked };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* armazenamento indisponível: estado segue apenas em memória */
      }
      return next;
    });
  };

  const handleErase = () => {
    // Apaga todos os dados da demonstração e encerra a sessão.
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignora */
    }
    signOut();
    void navigate({ to: "/", replace: true });
  };

  return (
    <>
      <SubHeader title="Gerenciar dados e privacidade" fallbackTo="/app/perfil" />
      <main className="px-4 py-5">
        <p className="text-sm text-muted-foreground">
          Controle como seus dados são usados nesta demonstração. As alterações são salvas
          automaticamente neste dispositivo.
        </p>

        <section aria-label="Consentimentos">
          <h2 className="mt-6 mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Consentimentos
          </h2>
          <ul className="overflow-hidden rounded-xl bg-card shadow-card divide-y divide-border">
            {consents.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{c.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{c.description}</p>
                </div>
                <Switch
                  checked={values[c.id] ?? c.defaultValue}
                  onCheckedChange={(checked) => toggle(c.id, checked)}
                  aria-label={c.title}
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Excluir dados" className="mt-8">
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Exclusão de dados
          </h2>
          <div className="rounded-xl bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">
              Apaga todos os dados desta demonstração salvos no seu dispositivo, incluindo
              consentimentos e sessão. Esta ação não pode ser desfeita.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-brand-red/40 px-4 py-3 font-medium text-brand-red transition-colors hover:bg-brand-red/10 focus-visible:ring-2 focus-visible:ring-brand-red/50 focus-visible:outline-none"
                >
                  <Trash2 className="size-5" aria-hidden />
                  Apagar meus dados
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apagar todos os dados?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Todos os dados desta demonstração serão removidos deste dispositivo e você
                    voltará para a tela de login. Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleErase}
                    className="bg-brand-red text-primary-foreground hover:bg-brand-red/90"
                  >
                    Sim, apagar tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
      </main>
    </>
  );
}
