import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Estado global do aplicativo.
 * - `signedIn`: sessão atual; não é persistida após fechar o app.
 * - `balanceHidden`: estado do "olho" do saldo, compartilhado por TODAS as telas.
 * Persistido em localStorage e lido apenas após a hidratação para evitar
 * divergência entre o HTML do servidor e o do cliente.
 */
interface SessionState {
  hydrated: boolean;
  signedIn: boolean;
  balanceHidden: boolean;
  signIn: () => void;
  signOut: () => void;
  toggleBalance: () => void;
}

const STORAGE_KEY = "conta-empresas-preferences";

const SessionContext = createContext<SessionState | null>(null);

interface StoredSession {
  balanceHidden: boolean;
}

function readStored(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    return {
      balanceHidden: Boolean(parsed.balanceHidden),
    };
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [balanceHidden, setBalanceHidden] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setBalanceHidden(stored.balanceHidden);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ balanceHidden }));
    } catch {
      /* armazenamento indisponível (modo privado): estado segue apenas em memória */
    }
  }, [hydrated, balanceHidden]);

  const signIn = useCallback(() => setSignedIn(true), []);
  const signOut = useCallback(() => setSignedIn(false), []);
  const toggleBalance = useCallback(() => setBalanceHidden((v) => !v), []);

  const value = useMemo<SessionState>(
    () => ({ hydrated, signedIn, balanceHidden, signIn, signOut, toggleBalance }),
    [hydrated, signedIn, balanceHidden, signIn, signOut, toggleBalance],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession precisa estar dentro de <SessionProvider>");
  return ctx;
}