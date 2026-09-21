/**
 * Store local (localStorage) das operações Pix da demonstração.
 * Nenhuma transação real acontece: tudo é gerado e guardado no aparelho.
 */
import { useSyncExternalStore } from "react";
import { account } from "./mock-data";

export type PixKeyType = "CPF" | "CNPJ" | "E-mail" | "Celular" | "Aleatória";

export interface PixKey {
  id: string;
  type: PixKeyType;
  value: string;
}

export interface PixParty {
  name: string;
  doc: string;
  bank: string;
  branch: string;
  account: string;
  accountType: string;
  key?: string;
  keyType?: PixKeyType;
}

export type PixKind = "enviado" | "recebido" | "agendado" | "cobranca";

export interface PixRecord {
  id: string;
  e2e: string;
  kind: PixKind;
  status: "Concluído" | "Agendado" | "Aguardando pagamento";
  amount: number;
  createdAt: string;
  scheduledFor?: string;
  description?: string;
  channel: string;
  authentication: string;
  payer: PixParty;
  payee: PixParty;
}

const RECORDS_KEY = "bradesco-demo-pix-records";
const KEYS_KEY = "bradesco-demo-pix-keys";

const EMPTY_RECORDS: PixRecord[] = [];

const defaultKeys: PixKey[] = [
  { id: "k1", type: "CNPJ", value: account.cnpj },
  { id: "k2", type: "E-mail", value: "cleiton@empresa.com.br" },
  { id: "k3", type: "Celular", value: "+55 65 99999-9951" },
];

/* ---------------------------------------------------------------- utilidades */

const ISPB_BRADESCO = "60746948";

function randomAlnum(length: number): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

function pad(value: number, size = 2): string {
  return String(value).padStart(size, "0");
}

/** ID de ponta a ponta no formato usado pelo Pix: E + ISPB + data/hora + sufixo (32 caracteres). */
export function buildEndToEndId(date: Date): string {
  const stamp =
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `${pad(date.getHours())}${pad(date.getMinutes())}`;
  return `E${ISPB_BRADESCO}${stamp}${randomAlnum(11)}`;
}

export function buildAuthentication(): string {
  return randomAlnum(32).toUpperCase().replace(/(.{8})(?=.)/g, "$1.");
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} às ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function maskDoc(doc: string): string {
  const digits = doc.replace(/\D/g, "");
  if (digits.length === 14) {
    return `${digits.slice(0, 2)}.***.***/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }
  if (digits.length === 11) {
    return `***.${digits.slice(3, 6)}.***-${digits.slice(9)}`;
  }
  return doc;
}

/** Converte um valor digitado ("1.250,90" ou "1250.90") em número. */
export function parseAmount(input: string): number {
  const normalized = input
    .replace(/\s|R\$/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : NaN;
}

export function detectKeyType(raw: string): PixKeyType | null {
  const value = raw.trim();
  if (!value) return null;
  if (value.includes("@") && /\.[a-z]{2,}$/i.test(value)) return "E-mail";
  const digits = value.replace(/\D/g, "");
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    return "Aleatória";
  }
  if (digits.length === 14) return "CNPJ";
  if (digits.length === 11 && /^\D*\+?55/.test(value)) return "Celular";
  if (digits.length === 11) return "CPF";
  if (digits.length === 12 || digits.length === 13) return "Celular";
  return null;
}

/* ------------------------------------------------------- diretório fictício */

export const ownParty: PixParty = {
  name: account.holder,
  doc: account.cnpj,
  bank: "237 — Banco Bradesco S.A.",
  branch: account.branch,
  account: account.number,
  accountType: "Conta corrente",
};

interface DirectoryEntry extends Omit<PixParty, "key" | "keyType"> {
  keys: string[];
}

const directory: DirectoryEntry[] = [
  {
    name: "MARIA EDUARDA SOUZA LIMA",
    doc: "045.871.220-31",
    bank: "260 — Nu Pagamentos S.A.",
    branch: "0001",
    account: "88213470-6",
    accountType: "Conta de pagamento",
    keys: ["04587122031", "maria.lima@email.com", "+5565991230045"],
  },
  {
    name: "TRANSPORTES ARARIBOIA LTDA",
    doc: "18.402.663/0001-09",
    bank: "341 — Itaú Unibanco S.A.",
    branch: "7420",
    account: "31908-5",
    accountType: "Conta corrente",
    keys: ["18402663000109", "financeiro@araribóia.com.br"],
  },
  {
    name: "JOSÉ CARLOS MENDES",
    doc: "731.229.480-17",
    bank: "001 — Banco do Brasil S.A.",
    branch: "3155",
    account: "20044-8",
    accountType: "Conta corrente",
    keys: ["73122948017", "+5565984410022"],
  },
  {
    name: "DISTRIBUIDORA VALE VERDE ME",
    doc: "29.117.508/0001-44",
    bank: "033 — Banco Santander (Brasil) S.A.",
    branch: "0442",
    account: "13007742-1",
    accountType: "Conta corrente",
    keys: ["29117508000144", "b1f4c0de-9e2a-4c77-9c6f-0f19a53e77aa"],
  },
];

export const favorites = directory.map((entry) => ({
  name: entry.name,
  key: entry.keys[0]!,
  bank: entry.bank,
}));

/** Resolve a chave informada em um destinatário plausível (sempre encontra alguém). */
export function resolvePayee(rawKey: string): PixParty {
  const key = rawKey.trim();
  const digits = key.replace(/\D/g, "");
  const found = directory.find((entry) =>
    entry.keys.some((k) => k === key || (digits.length > 0 && k.replace(/\D/g, "") === digits)),
  );
  const keyType = detectKeyType(key) ?? "Aleatória";

  if (found) {
    const { keys: _keys, ...party } = found;
    return { ...party, key, keyType };
  }

  const seed = Array.from(key).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const base = directory[seed % directory.length]!;
  const { keys: _ignored, ...party } = base;
  return {
    ...party,
    name: keyType === "CNPJ" ? "EMPRESA TITULAR DA CHAVE LTDA" : "TITULAR DA CHAVE PIX",
    doc: keyType === "CNPJ" ? "12.345.678/0001-95" : "123.456.789-00",
    key,
    keyType,
  };
}

/** Gera um "Pix Copia e Cola" com estrutura semelhante ao BR Code (EMV). */
export function buildBrCode(key: string, amount: number, name: string): string {
  const gui = "br.gov.bcb.pix";
  const field = (id: string, value: string) => `${id}${pad(value.length)}${value}`;
  const merchant = field("00", gui) + field("01", key);
  const amountStr = amount > 0 ? field("54", amount.toFixed(2)) : "";
  const payload =
    field("00", "01") +
    field("26", merchant) +
    field("52", "0000") +
    field("53", "986") +
    amountStr +
    field("58", "BR") +
    field("59", name.slice(0, 25)) +
    field("60", "SAO PAULO") +
    field("62", field("05", randomAlnum(10).toUpperCase())) +
    "6304";
  let crc = 0xffff;
  for (const ch of payload) {
    crc ^= ch.charCodeAt(0) << 8;
    for (let i = 0; i < 8; i += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return payload + crc.toString(16).toUpperCase().padStart(4, "0");
}

/** Extrai chave e valor de um BR Code colado pelo usuário (tolerante a formatos). */
export function parseBrCode(code: string): { key: string; amount: number } | null {
  const clean = code.trim();
  if (clean.length < 20) return null;
  const keyMatch = /br\.gov\.bcb\.pix01(\d{2})([\s\S]*)/i.exec(clean);
  let key = "";
  if (keyMatch) {
    const len = Number(keyMatch[1]);
    key = (keyMatch[2] ?? "").slice(0, len);
  }
  const amountMatch = /54(\d{2})(\d+\.\d{2})/.exec(clean);
  const amount = amountMatch ? Number(amountMatch[2]) : 0;
  if (!key) return null;
  return { key, amount };
}

/* ------------------------------------------------------------------- store */

function read<T>(storageKey: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(storageKey: string, value: unknown): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    /* armazenamento indisponível: segue apenas em memória */
  }
}

let recordsCache: PixRecord[] | null = null;
let keysCache: PixKey[] | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function listRecords(): PixRecord[] {
  if (typeof window === "undefined") return EMPTY_RECORDS;
  if (!recordsCache) recordsCache = read<PixRecord[]>(RECORDS_KEY, []);
  return recordsCache;
}

export function listKeys(): PixKey[] {
  if (typeof window === "undefined") return defaultKeys;
  if (!keysCache) keysCache = read<PixKey[]>(KEYS_KEY, defaultKeys);
  return keysCache;
}

export function getRecord(id: string): PixRecord | undefined {
  return listRecords().find((r) => r.id === id);
}

export interface NewPixInput {
  kind: PixKind;
  amount: number;
  payee: PixParty;
  payer?: PixParty;
  description?: string;
  channel: string;
  scheduledFor?: string;
}

export function createRecord(input: NewPixInput): PixRecord {
  const now = new Date();
  const record: PixRecord = {
    id: `px_${now.getTime().toString(36)}${randomAlnum(4)}`,
    e2e: buildEndToEndId(now),
    kind: input.kind,
    status:
      input.kind === "agendado"
        ? "Agendado"
        : input.kind === "cobranca"
          ? "Aguardando pagamento"
          : "Concluído",
    amount: input.amount,
    createdAt: now.toISOString(),
    channel: input.channel,
    authentication: buildAuthentication(),
    payer: input.payer ?? ownParty,
    payee: input.payee,
    ...(input.description ? { description: input.description } : {}),
    ...(input.scheduledFor ? { scheduledFor: input.scheduledFor } : {}),
  };
  recordsCache = [record, ...listRecords()];
  write(RECORDS_KEY, recordsCache);
  emit();
  return record;
}

export function removeRecord(id: string): void {
  recordsCache = listRecords().filter((r) => r.id !== id);
  write(RECORDS_KEY, recordsCache);
  emit();
}

export function addKey(type: PixKeyType, value: string): void {
  keysCache = [...listKeys(), { id: `k_${Date.now().toString(36)}`, type, value }];
  write(KEYS_KEY, keysCache);
  emit();
}

export function removeKey(id: string): void {
  keysCache = listKeys().filter((k) => k.id !== id);
  write(KEYS_KEY, keysCache);
  emit();
}

export function usePixRecords(): PixRecord[] {
  return useSyncExternalStore(subscribe, listRecords, () => EMPTY_RECORDS);
}

export function usePixKeys(): PixKey[] {
  return useSyncExternalStore(subscribe, listKeys, () => defaultKeys);
}

/** Saldo disponível considerando os Pix da demonstração já efetivados. */
export function usePixBalance(): number {
  const records = usePixRecords();
  return records.reduce((total, r) => {
    if (r.status !== "Concluído") return total;
    return r.kind === "enviado" ? total - r.amount : total + r.amount;
  }, account.balance);
}

/** Limites diários fictícios do Pix. */
export const pixLimits = [
  { label: "Pix por transação (dia)", value: 50_000_000 },
  { label: "Pix diário (6h às 20h)", value: 150_000_000 },
  { label: "Pix noturno (20h às 6h)", value: 10_000_000 },
];
