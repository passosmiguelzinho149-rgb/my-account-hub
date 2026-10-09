import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Lock, LogOut } from "lucide-react";
import { checkPin } from "@/lib/security";
import { useSession } from "@/lib/session";

/**
 * Tela de bloqueio do modo privacidade.
 *
 * Cobre o aplicativo inteiro, não mostra nenhum dado e só libera com a
 * senha da demonstração. "Sair" encerra a sessão e volta para o login.
 */
export function PrivacyLock({ onUnlock }: { onUnlock: () => void }) {
  const { signOut } = useSession();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (pin.length < 4) {
      setError("Digite a senha completa.");
      return;
    }
    const result = checkPin(pin);
    if (!result.ok) {
      setError(result.reason);
      setPin("");
      return;
    }
    setError(null);
    setPin("");
    onUnlock();
  };

  const leave = () => {
    signOut();
    void navigate({ to: "/", replace: true });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tela bloqueada"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5 bg-background px-6 text-center"
    >
      <span className="grid size-14 place-items-center rounded-full bg-secondary text-primary">
        <Lock className="size-6" aria-hidden />
      </span>
      <div>
        <h2 className="text-lg font-bold">Tela bloqueada</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          O modo privacidade está ligado. Digite sua senha para voltar.
        </p>
      </div>

      <form onSubmit={submit} className="w-full max-w-[300px]">
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Senha"
          aria-label="Senha para desbloquear"
          className="w-full rounded-lg border border-border bg-card px-3 py-3 text-center text-lg tracking-[0.35em] outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        {error && (
          <p role="alert" className="mt-3 text-sm text-brand-red">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          Desbloquear
        </button>
      </form>

      <button
        type="button"
        onClick={leave}
        className="flex items-center gap-2 text-sm text-muted-foreground underline underline-offset-4"
      >
        <LogOut className="size-4" aria-hidden />
        Sair e voltar ao login
      </button>
    </div>
  );
}
