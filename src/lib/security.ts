/**
 * Segurança da conta de demonstração (senha/PIN, 2 etapas, dispositivos,
 * histórico de acessos e bloqueio). Tudo fica no aparelho; nenhuma
 * credencial real é pedida ou validada.
 */
import { useSyncExternalStore } from "react";

export interface Device {
  id: string;
  name: string;
  place: string;
  lastAccess: string;
  current: boolean;
}

export interface AccessEntry {
  id: string;
  at: string;
  method: "Senha" | "Biometria" | "Chave de segurança";
  result: "Sucesso" | "Senha incorreta" | "Bloqueado";
  device: string;
}

export interface SecurityState {
  pin: string;
  twoFactor: boolean;
  failedAttempts: number;
  locked: boolean;
  devices: Device[];
  history: AccessEntry[];
}

/** PIN inicial da demonstração (mostrado na tela de login). */
export const DEMO_PIN = "1234";
export const MAX_ATTEMPTS = 3;
const KEY = "bradesco-demo-security-v1";

function initial(): SecurityState {
  return {
    pin: DEMO_PIN,
    twoFactor: false,
    failedAttempts: 0,
    locked: false,
    devices: [
      { id: "d1", name: "Este aparelho", place: "Cuiabá, MT", lastAccess: new Date().toISOString(), current: true },
      { id: "d2", name: "Samsung Galaxy S23", place: "Cuiabá, MT", lastAccess: new Date(Date.now() - 5 * 86_400_000).toISOString(), current: false },
      { id: "d3", name: "Navegador Chrome — Windows", place: "Várzea Grande, MT", lastAccess: new Date(Date.now() - 20 * 86_400_000).toISOString(), current: false },
    ],
    history: [],
  };
}

let cache: SecurityState | null = null;
let server: SecurityState | null = null;
const listeners = new Set<() => void>();

function get(): SecurityState {
  if (typeof window === "undefined") return (server ??= initial());
  if (!cache) {
    try {
      const raw = window.localStorage.getItem(KEY);
      cache = raw ? (JSON.parse(raw) as SecurityState) : initial();
    } catch {
      cache = initial();
    }
  }
  return cache;
}

function set(fn: (s: SecurityState) => SecurityState) {
  cache = fn(get());
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* segue em memória */
  }
  listeners.forEach((l) => l());
}

export function useSecurity(): SecurityState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    get,
    get,
  );
}

function log(method: AccessEntry["method"], result: AccessEntry["result"]) {
  set((s) => ({
    ...s,
    history: [
      { id: `a_${Date.now().toString(36)}`, at: new Date().toISOString(), method, result, device: "Este aparelho" },
      ...s.history,
    ].slice(0, 50),
  }));
}

export type LoginResult = { ok: true } | { ok: false; reason: string };

/** Confere o PIN; após 3 erros a conta de demonstração é bloqueada. */
export function checkPin(pin: string): LoginResult {
  const s = get();
  if (s.locked) {
    log("Senha", "Bloqueado");
    return { ok: false, reason: "Conta bloqueada. Use “Desbloquear conta”." };
  }
  if (pin === s.pin) {
    set((x) => ({ ...x, failedAttempts: 0 }));
    return { ok: true };
  }
  const attempts = s.failedAttempts + 1;
  const locked = attempts >= MAX_ATTEMPTS;
  set((x) => ({ ...x, failedAttempts: attempts, locked }));
  log("Senha", locked ? "Bloqueado" : "Senha incorreta");
  return {
    ok: false,
    reason: locked
      ? "Senha incorreta 3 vezes. A conta foi bloqueada por segurança."
      : `Senha incorreta. Restam ${MAX_ATTEMPTS - attempts} tentativa(s).`,
  };
}

export function registerSuccess(method: AccessEntry["method"]) {
  set((s) => ({
    ...s,
    devices: s.devices.map((d) => (d.current ? { ...d, lastAccess: new Date().toISOString() } : d)),
  }));
  log(method, "Sucesso");
}

export function changePin(current: string, next: string): LoginResult {
  if (current !== get().pin) return { ok: false, reason: "Senha atual incorreta." };
  if (!/^\d{4,6}$/.test(next)) return { ok: false, reason: "A nova senha deve ter de 4 a 6 números." };
  set((s) => ({ ...s, pin: next }));
  return { ok: true };
}

/** Recuperação simulada: redefine a senha após validar o código exibido. */
export function resetPin(next: string): LoginResult {
  if (!/^\d{4,6}$/.test(next)) return { ok: false, reason: "A nova senha deve ter de 4 a 6 números." };
  set((s) => ({ ...s, pin: next, failedAttempts: 0, locked: false }));
  return { ok: true };
}

export function setTwoFactor(on: boolean) {
  set((s) => ({ ...s, twoFactor: on }));
}

export function lockAccount() {
  set((s) => ({ ...s, locked: true }));
}

export function unlockAccount() {
  set((s) => ({ ...s, locked: false, failedAttempts: 0 }));
}

export function removeDevice(id: string) {
  set((s) => ({ ...s, devices: s.devices.filter((d) => d.id !== id || d.current) }));
}

/** Código de verificação de 6 dígitos (exibido como "SMS simulado"). */
export function makeCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
