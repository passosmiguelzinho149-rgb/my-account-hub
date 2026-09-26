/**
 * "Banco de dados" da demonstração.
 * Tudo vive no aparelho (localStorage) e persiste durante o uso do app.
 * Nenhuma operação movimenta dinheiro real.
 */
import { useSyncExternalStore } from "react";
import { account, formatBRL } from "./mock-data";
import {
  buildAuthentication,
  buildEndToEndId,
  ownParty,
  type PixKey,
  type PixKeyType,
  type PixParty,
} from "./pix";

export type TxCategory =
  | "pix"
  | "transferencia"
  | "pagamento"
  | "compra"
  | "saque"
  | "deposito"
  | "recarga"
  | "investimento"
  | "emprestimo";

export type TxStatus = "Concluído" | "Agendado" | "Aguardando pagamento" | "Cancelado";

export interface Receipt {
  /** Linhas exibidas no comprovante, na ordem. */
  rows: { label: string; value: string }[];
  e2e?: string;
  authentication: string;
}

export interface Tx {
  id: string;
  category: TxCategory;
  kind: "in" | "out";
  status: TxStatus;
  title: string;
  counterpart: string;
  amount: number;
  createdAt: string;
  scheduledFor?: string;
  description?: string;
  channel: string;
  receipt: Receipt;
}

export interface Card {
  id: string;
  label: string;
  type: "Físico" | "Virtual";
  brand: string;
  last4: string;
  expiry: string;
  cvv: string;
  limit: number;
  used: number;
  blocked: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  kind: "pix" | "transferencia" | "pagamento" | "compra" | "fatura" | "seguranca" | "oferta";
  read: boolean;
}

export interface Beneficiary {
  id: string;
  name: string;
  doc: string;
  bank: string;
  branch: string;
  account: string;
}

export interface BankState {
  transactions: Tx[];
  cards: Card[];
  notifications: AppNotification[];
  beneficiaries: Beneficiary[];
  pixKeys: PixKey[];
}

const STORAGE_KEY = "bradesco-demo-bank-v2";

/* --------------------------------------------------------------- utilidades */

function pad(n: number, size = 2) {
  return String(n).padStart(size, "0");
}

function rid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} às ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function formatDay(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function partyLines(party: PixParty): { label: string; value: string }[] {
  return [
    { label: "Nome", value: party.name },
    { label: "CPF/CNPJ", value: party.doc },
    { label: "Instituição", value: party.bank },
    { label: "Agência / Conta", value: `${party.branch} / ${party.account}` },
    { label: "Tipo de conta", value: party.accountType },
    ...(party.key ? [{ label: "Chave Pix", value: party.key }] : []),
  ];
}

/* ------------------------------------------------------------ estado inicial */

function seedTx(
  daysAgo: number,
  partial: Omit<Tx, "id" | "createdAt" | "receipt" | "channel" | "status"> &
    Partial<Pick<Tx, "status" | "channel">>,
): Tx {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const iso = d.toISOString();
  return {
    id: rid("tx"),
    createdAt: iso,
    status: partial.status ?? "Concluído",
    channel: partial.channel ?? "App Empresas",
    ...partial,
    receipt: {
      authentication: buildAuthentication(),
      ...(partial.category === "pix" ? { e2e: buildEndToEndId(d) } : {}),
      rows: [
        { label: "Data e hora", value: formatDateTime(iso) },
        { label: "Valor", value: formatBRL(partial.amount) },
        { label: "Descrição", value: partial.title },
        { label: "Origem/Destino", value: partial.counterpart },
      ],
    },
  };
}

function seedTxAt(
  date: string,
  partial: Omit<Tx, "id" | "createdAt" | "receipt" | "channel" | "status"> &
    Partial<Pick<Tx, "status" | "channel">>,
): Tx {
  const d = new Date(date);
  const iso = d.toISOString();
  return {
    id: rid("tx"),
    createdAt: iso,
    status: partial.status ?? "Concluído",
    channel: partial.channel ?? "App Empresas",
    ...partial,
    receipt: {
      authentication: buildAuthentication(),
      ...(partial.category === "pix" ? { e2e: buildEndToEndId(d) } : {}),
      rows: [
        { label: "Data e hora", value: formatDateTime(iso) },
        { label: "Valor", value: formatBRL(partial.amount) },
        { label: "Descrição", value: partial.title },
        { label: "Origem/Destino", value: partial.counterpart },
      ],
    },
  };
}

function initialState(): BankState {
  return {
    transactions: [
      seedTxAt("2026-06-18T10:32:00-04:00", {
        category: "pix",
        kind: "in",
        title: "PIX QR CODE STATIC",
        counterpart: "REM: MARCOS NUNES DE MIRANDA",
        amount: 52_625_000,
      }),
      seedTxAt("2026-06-16T10:32:00-04:00", {
        category: "pix",
        kind: "in",
        title: "PIX QR CODE STATIC",
        counterpart: "REM: MARCOS NUNES DE MIRANDA",
        amount: 52_625_000,
      }),
      seedTx(5, {
        category: "pagamento",
        kind: "out",
        title: "PAGAMENTO DE BOLETO",
        counterpart: "ENERGISA MATO GROSSO",
        amount: 4_280.55,
      }),
      seedTx(7, {
        category: "compra",
        kind: "out",
        title: "COMPRA CARTÃO EMPRESARIAL",
        counterpart: "POSTO SANTA CRUZ",
        amount: 912.4,
      }),
      seedTxAt("2026-06-11T10:32:00-04:00", {
        category: "pix",
        kind: "in",
        title: "PIX QR CODE STATIC",
        counterpart: "REM: MARCOS NUNES DE MIRANDA",
        amount: 26_750_000,
      }),
    ],
    cards: [
      {
        id: "card1",
        label: "Cartão Empresarial",
        type: "Físico",
        brand: "Elo Empresas",
        last4: "4417",
        expiry: "09/2030",
        cvv: "318",
        limit: 250_000,
        used: 38_912.4,
        blocked: false,
      },
      {
        id: "card2",
        label: "Cartão Virtual",
        type: "Virtual",
        brand: "Visa Business",
        last4: "9082",
        expiry: "04/2029",
        cvv: "774",
        limit: 60_000,
        used: 5_140,
        blocked: false,
      },
    ],
    notifications: [
      {
        id: "n1",
        kind: "pix",
        title: "Pix recebido",
        body: `Você recebeu ${formatBRL(52_625_000)} de MARCOS NUNES DE MIRANDA.`,
        createdAt: new Date().toISOString(),
        read: false,
      },
      {
        id: "n2",
        kind: "seguranca",
        title: "Aviso de segurança",
        body: "Nunca compartilhe sua senha ou token. Este é um ambiente de demonstração.",
        createdAt: new Date(Date.now() - 86_400_000).toISOString(),
        read: false,
      },
      {
        id: "n3",
        kind: "oferta",
        title: "Oferta de crédito",
        body: "Capital de giro pré-aprovado disponível para simulação.",
        createdAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
        read: true,
      },
    ],
    beneficiaries: [
      { id: "pix-demo-1", name: "TATIANE DE OLIVEIRA", doc: "000.000.000-00", bank: "237 — Banco DEMO", branch: "1249", account: "DEMO-01" },
      { id: "pix-demo-2", name: "CLEBER OLIVEIRA PASSOS", doc: "000.000.000-00", bank: "237 — Banco DEMO", branch: "1249", account: "DEMO-02" },
      { id: "pix-demo-3", name: "VIVIANI DE OLIVEIRA SOUZA", doc: "000.000.000-00", bank: "237 — Banco DEMO", branch: "1249", account: "DEMO-03" },
      { id: "pix-demo-4", name: "RODRIGO DE OLIVEIRA PEGO", doc: "000.000.000-00", bank: "104 — Banco DEMO", branch: "2086", account: "DEMO-04" },
      { id: "pix-demo-5", name: "CLEIDIANE DOS PASSOS OLIVEIRA", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-05" },
      { id: "pix-demo-6", name: "KATIANE DE OLIVEIRA", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-06" },
      { id: "pix-demo-7", name: "JOSÉ MARIA GOMES PEIXOTO", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-07" },
      { id: "pix-demo-8", name: "MARIA JOSE GOMES DE OLIVEIRA", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-08" },
      { id: "pix-demo-9", name: "ELIANE PEGO DE OLIVEIRA", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-09" },
      { id: "pix-demo-10", name: "JOSIANE DE SOUSA PARANHOS SILVA", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-10" },
      { id: "pix-demo-11", name: "ADRIANO DE SOUZA PARANHOS", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-11" },
      { id: "pix-demo-12", name: "MOACIR GOMES DE OLIVEIRA", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-12" },
      { id: "pix-demo-13", name: "JUSTINIANO DE SOUZA PARANHOS", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-13" },
      { id: "pix-demo-14", name: "VILSON VILMAR DE OLIVEIRA", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-14" },
      { id: "pix-demo-15", name: "ROGÉRIO DE OLIVEIRA", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-15" },
      { id: "pix-demo-16", name: "WILLIAM PARANHOS DE OLIVEIRA", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-16" },
      { id: "pix-demo-17", name: "SOLANGE OLIVEIRA", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-17" },
      { id: "pix-demo-18", name: "YURI GABRYEL OLIVEIRA CARDOSO", doc: "000.000.000-00", bank: "748 — Banco DEMO", branch: "0804", account: "DEMO-18" },
      { id: "pix-demo-19", name: "JOSINE PARANHOS DE OLIVEIRA", doc: "000.000.000-00", bank: "208 — Banco DEMO", branch: "0020", account: "DEMO-19" },
      { id: "pix-demo-20", name: "YARA GABRIELLY OLIVEIRA CARDOSO", doc: "000.000.000-00", bank: "336 — Banco DEMO", branch: "0001", account: "DEMO-20" },
      { id: "pix-demo-21", name: "REGINALDO DE OLIVEIRA PEGO", doc: "000.000.000-00", bank: "341 — Banco DEMO", branch: "1360", account: "DEMO-21" },
      { id: "pix-demo-22", name: "GUILHERME DE OLIVEIRA PEGO", doc: "000.000.000-00", bank: "237 — Banco DEMO", branch: "1249", account: "DEMO-22" },
    ],
    pixKeys: [
      { id: "k1", type: "CNPJ", value: account.cnpj },
      { id: "k2", type: "E-mail", value: "cleiton@empresa.com.br" },
      { id: "k3", type: "Celular", value: "+55 65 99999-9951" },
    ],
  };
}

/* ------------------------------------------------------------------- store */

let cache: BankState | null = null;
let serverSnapshot: BankState | null = null;
const listeners = new Set<() => void>();

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    /* armazenamento indisponível: segue em memória */
  }
}

export function getState(): BankState {
  if (typeof window === "undefined") {
    if (!serverSnapshot) serverSnapshot = initialState();
    return serverSnapshot;
  }
  if (!cache) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      cache = raw ? (JSON.parse(raw) as BankState) : initialState();
    } catch {
      cache = initialState();
    }
    if (!raw_ok(cache)) cache = initialState();

    // Migração dos dados de demonstração: garante que os três recebimentos
    // fictícios estejam presentes mesmo quando o navegador já tinha dados antigos.
    const demoReceipts = [
      { amount: 26_750_000, date: "2026-06-11" },
      { amount: 52_625_000, date: "2026-06-16" },
      { amount: 52_625_000, date: "2026-06-18" },
    ];
    const hasAllDemoReceipts = demoReceipts.every(({ amount, date }) =>
      cache!.transactions.some(
        (t) =>
          t.kind === "in" &&
          t.category === "pix" &&
          t.amount === amount &&
          t.counterpart === "REM: MARCOS NUNES DE MIRANDA" &&
          t.createdAt.startsWith(date),
      ),
    );

    if (!hasAllDemoReceipts) {
      cache = initialState();
      persist();
    }
  }
  return cache;
}

function raw_ok(state: BankState | null): boolean {
  return Boolean(state && Array.isArray(state.transactions) && Array.isArray(state.cards));
}

function update(fn: (state: BankState) => BankState): void {
  cache = fn(getState());
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBank(): BankState {
  return useSyncExternalStore(subscribe, getState, getState);
}

/** Saldo disponível considerando as operações já efetivadas. */
export function computeBalance(state: BankState): number {
  return state.transactions.reduce((total, t) => {
    if (t.status !== "Concluído") return total;
    return t.kind === "in" ? total + t.amount : total - t.amount;
  }, 0);
}

export function useBalance(): number {
  return computeBalance(useBank());
}

export function resetDemo(): void {
  cache = initialState();
  persist();
  listeners.forEach((l) => l());
}

/* -------------------------------------------------------------- operações */

export interface PostTxInput {
  category: TxCategory;
  kind: "in" | "out";
  title: string;
  counterpart: string;
  amount: number;
  channel: string;
  status?: TxStatus;
  scheduledFor?: string;
  description?: string;
  /** Linhas extras específicas da operação (destinatário, boleto, etc.). */
  extraRows?: { label: string; value: string }[];
  pix?: boolean;
  notify?: { title: string; body: string; kind: AppNotification["kind"] };
}

/** Registra uma operação e devolve o comprovante gerado. */
export function postTx(input: PostTxInput): Tx {
  const now = new Date();
  const status = input.status ?? "Concluído";
  const tx: Tx = {
    id: rid("tx"),
    category: input.category,
    kind: input.kind,
    status,
    title: input.title,
    counterpart: input.counterpart,
    amount: input.amount,
    createdAt: now.toISOString(),
    channel: input.channel,
    ...(input.scheduledFor ? { scheduledFor: input.scheduledFor } : {}),
    ...(input.description ? { description: input.description } : {}),
    receipt: {
      authentication: buildAuthentication(),
      ...(input.pix ? { e2e: buildEndToEndId(now) } : {}),
      rows: [
        { label: "Situação", value: status },
        { label: "Data e hora", value: formatDateTime(now.toISOString()) },
        ...(input.scheduledFor
          ? [{ label: "Agendado para", value: formatDay(input.scheduledFor) }]
          : []),
        { label: "Valor", value: formatBRL(input.amount) },
        ...(input.extraRows ?? []),
        ...(input.description ? [{ label: "Descrição", value: input.description }] : []),
        { label: "Canal", value: input.channel },
      ],
    },
  };

  update((s) => ({
    ...s,
    transactions: [tx, ...s.transactions],
    notifications: input.notify
      ? [
          {
            id: rid("n"),
            createdAt: now.toISOString(),
            read: false,
            ...input.notify,
          },
          ...s.notifications,
        ]
      : s.notifications,
  }));
  return tx;
}

export function getTx(id: string): Tx | undefined {
  return getState().transactions.find((t) => t.id === id);
}

export function cancelTx(id: string): void {
  update((s) => ({
    ...s,
    transactions: s.transactions.map((t) =>
      t.id === id
        ? {
            ...t,
            status: "Cancelado",
            receipt: {
              ...t.receipt,
              rows: t.receipt.rows.map((r) =>
                r.label === "Situação" ? { ...r, value: "Cancelado" } : r,
              ),
            },
          }
        : t,
    ),
  }));
}

/** Comprovante de Pix com origem e destino detalhados. */
export function pixReceiptRows(payee: PixParty, payer: PixParty = ownParty) {
  return [
    { label: "— Quem recebeu —", value: "" },
    ...partyLines(payee),
    { label: "— Quem pagou —", value: "" },
    ...partyLines(payer),
  ];
}

/* ------------------------------------------------------------- chaves Pix */

export function addPixKey(type: PixKeyType, value: string): void {
  update((s) => ({ ...s, pixKeys: [...s.pixKeys, { id: rid("k"), type, value }] }));
}

export function removePixKey(id: string): void {
  update((s) => ({ ...s, pixKeys: s.pixKeys.filter((k) => k.id !== id) }));
}

/* ------------------------------------------------------------ favorecidos */

export function addBeneficiary(b: Omit<Beneficiary, "id">): void {
  update((s) => ({ ...s, beneficiaries: [...s.beneficiaries, { id: rid("b"), ...b }] }));
}

export function removeBeneficiary(id: string): void {
  update((s) => ({ ...s, beneficiaries: s.beneficiaries.filter((b) => b.id !== id) }));
}

/* ---------------------------------------------------------------- cartões */

export function toggleCardBlock(id: string): void {
  update((s) => ({
    ...s,
    cards: s.cards.map((c) => (c.id === id ? { ...c, blocked: !c.blocked } : c)),
  }));
}

export function setCardLimit(id: string, limit: number): void {
  update((s) => ({ ...s, cards: s.cards.map((c) => (c.id === id ? { ...c, limit } : c)) }));
}

/* ----------------------------------------------------------- notificações */

export function markNotificationRead(id: string): void {
  update((s) => ({
    ...s,
    notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
  }));
}

export function markAllNotificationsRead(): void {
  update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
}

export function removeNotification(id: string): void {
  update((s) => ({ ...s, notifications: s.notifications.filter((n) => n.id !== id) }));
}

export function useUnreadCount(): number {
  return useBank().notifications.filter((n) => !n.read).length;
}
