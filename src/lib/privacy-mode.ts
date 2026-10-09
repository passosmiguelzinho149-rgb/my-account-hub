/**
 * Modo privacidade.
 *
 * Desligado por padrão: o aplicativo nunca bloqueia a tela sozinho.
 * Quando o usuário liga, sair do app (trocar de aplicativo, minimizar,
 * clicar fora da janela) bloqueia tudo e só libera com a senha.
 * O estado fica salvo no próprio aparelho.
 */
import { useSyncExternalStore } from "react";

const KEY = "bradesco-priv…-mode";

const listeners = new Set<() => void>();
let cache: boolean | null = null;

function read(): boolean {
  if (typeof window === "undefined") return false;
  if (cache === null) {
    try {
      cache = window.localStorage.getItem(KEY) === "on";
    } catch {
      cache = false;
    }
  }
  return cache;
}

function write(on: boolean) {
  try {
    if (on) window.localStorage.setItem(KEY, "on");
    else window.localStorage.removeItem(KEY);
  } catch {
    /* armazenamento indisponível: o estado segue apenas em memória */
  }
}

/** Lê o modo privacidade e re-renderiza quando ele muda. */
export function usePrivacyMode(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    read,
    () => false,
  );
}

export function setPrivacyMode(on: boolean) {
  cache = on;
  write(on);
  listeners.forEach((listener) => listener());
}
