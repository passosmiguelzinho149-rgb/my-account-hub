/** Dados fictícios da conta de demonstração. Nenhuma operação real acontece. */
export const account = {
  holder: "CLEITON OLIVEIRA DOS PASSOS",
  company: "63.031.988 CLEITON OLIVEIRA DOS PASSOS",
  cnpj: "45.755.070/0001-98",
  branch: "2700",
  number: "3574-2",
  balance: 132_000_000,
  inflow: 132_000_000,
  outflow: 0,
  summaryDate: "18/06/2026",
} as const;

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export interface Transaction {
  id: string;
  day: string;
  month: string;
  title: string;
  counterpart: string;
  date: string;
  document: string;
  amount: number;
  kind: "in" | "out";
}

export const transactions: Transaction[] = [
  {
    id: "t1",
    day: "18",
    month: "Jun",
    title: "PIX QR CODE STATIC",
    counterpart: "REM: CLEITON OLIVEIRA DOS",
    date: "18/06",
    document: "2254545",
    amount: 52_625_000,
    kind: "in",
  },
  {
    id: "t2",
    day: "16",
    month: "Jun",
    title: "PIX QR CODE STATIC",
    counterpart: "REM: CLEITON OLIVEIRA DOS",
    date: "16/06",
    document: "2254545",
    amount: 52_625_000,
    kind: "in",
  },
  {
    id: "t3",
    day: "11",
    month: "Jun",
    title: "PIX QR CODE STATIC",
    counterpart: "REM: CLEITON OLIVEIRA DOS",
    date: "11/06",
    document: "2254545",
    amount: 26_750_000,
    kind: "in",
  },
];

export interface ServiceItem {
  slug: string;
  label: string;
  icon: string;
  /** Rota dedicada quando existe; caso contrário abre a tela genérica. */
  route?:
    | "/app/extrato"
    | "/app/cartoes"
    | "/app/credito"
    | "/app/pix"
    | "/app/comprovantes"
    | "/app/pix/limites";
}

export const services: ServiceItem[] = [
  { slug: "pix", label: "Pix", icon: "Zap", route: "/app/pix" },
  { slug: "saldo", label: "Saldo", icon: "FileText" },
  { slug: "extrato", label: "Extrato", icon: "ReceiptText", route: "/app/extrato" },
  { slug: "linhas-de-credito", label: "Linhas de Crédito", icon: "HandCoins", route: "/app/credito" },
  { slug: "cartoes", label: "Cartões", icon: "CreditCard", route: "/app/cartoes" },
  { slug: "pagamentos", label: "Pagamentos", icon: "Barcode", route: "/app/pagamentos" },
  { slug: "transferencias", label: "Transferências", icon: "ArrowLeftRight", route: "/app/transferencias" },
  { slug: "open-finance", label: "Open Finance", icon: "PieChart" },
  { slug: "whatsapp", label: "WhatsApp", icon: "MessageCircle" },
  { slug: "agendamentos", label: "Agendamentos", icon: "Calendar" },
  { slug: "limites", label: "Limites", icon: "SlidersHorizontal", route: "/app/pix/limites" },
  { slug: "comprovantes", label: "Comprovantes", icon: "FileCheck", route: "/app/comprovantes" },
  { slug: "solucoes", label: "Soluções", icon: "Calculator" },
  { slug: "informe-rendimentos", label: "Informe Rendimentos", icon: "FileBarChart" },
  { slug: "debitos", label: "Débitos", icon: "Car" },
  { slug: "buscador", label: "Buscador", icon: "Scan" },
  { slug: "recebiveis", label: "Recebíveis", icon: "RefreshCw" },
  { slug: "investimentos", label: "Investimentos", icon: "TrendingUp" },
  { slug: "debito-automatico", label: "Débito Automático", icon: "FilePen" },
  { slug: "recargas", label: "Recargas", icon: "Smartphone", route: "/app/recargas" },
  { slug: "saques", label: "Saques", icon: "Banknote", route: "/app/saques" },
];

export function findService(slug: string): ServiceItem | undefined {
  return services.find((s) => s.slug === slug);
}

export const creditLines = [
  {
    title: "Capital de giro",
    body: "Recursos para o dia a dia da empresa, com prazos e carência ajustáveis ao seu fluxo de caixa.",
  },
  {
    title: "Cheque empresarial",
    body: "Limite pré-aprovado na conta para cobrir eventuais faltas de saldo, com juros por dia de uso.",
  },
  {
    title: "Microcrédito",
    body: "Crédito orientado para pequenos negócios, com acompanhamento de um agente de crédito.",
  },
];

export interface AccountPage {
  slug: string;
  title: string;
  intro: string;
  rows: { label: string; value: string }[];
}

export const accountPages: AccountPage[] = [
  {
    slug: "dados-pessoais",
    title: "Dados pessoais",
    intro: "Informações do titular cadastradas nesta demonstração.",
    rows: [
      { label: "Nome", value: account.holder },
      { label: "CPF", value: "•••.•••.151-••" },
      { label: "E-mail", value: "cleiton@empresa.com.br" },
      { label: "Celular", value: "(65) 9••••-••51" },
    ],
  },
  {
    slug: "dados-da-empresa",
    title: "Dados da empresa",
    intro: "Cadastro da pessoa jurídica vinculada à conta.",
    rows: [
      { label: "Razão social", value: account.company },
      { label: "CNPJ", value: account.cnpj },
      { label: "Segmento", value: "Empresas e Negócios" },
      { label: "Início de relacionamento", value: "12/03/2019" },
    ],
  },
  {
    slug: "dados-da-conta",
    title: "Dados da conta",
    intro: "Identificação bancária para receber transferências.",
    rows: [
      { label: "Agência", value: account.branch },
      { label: "Conta corrente", value: account.number },
      { label: "Banco", value: "237 — Bradesco" },
      { label: "Chave Pix", value: account.cnpj },
    ],
  },
  {
    slug: "falar-com-o-gerente",
    title: "Falar com o Gerente",
    intro: "Atendimento da Agência Digital das 8h às 20h, em dias úteis (horário de Brasília).",
    rows: [
      { label: "Gerente", value: "Agência Digital Empresas" },
      { label: "Telefone", value: "0800 000 0000" },
      { label: "Tempo médio de resposta", value: "até 1 dia útil" },
    ],
  },
  {
    slug: "sobre-o-app",
    title: "Sobre o App",
    intro: "Protótipo visual de demonstração. Nenhuma operação bancária real é realizada.",
    rows: [
      { label: "Versão", value: "1.0.0 (demo)" },
      { label: "Ambiente", value: "Demonstração" },
      { label: "Última atualização", value: "18/06/2026" },
    ],
  },
  {
    slug: "propostas-da-empresa",
    title: "Propostas da empresa",
    intro: "Você não possui propostas em andamento nesta demonstração.",
    rows: [
      { label: "Em análise", value: "0" },
      { label: "Aprovadas", value: "0" },
      { label: "Recusadas", value: "0" },
    ],
  },
];

export function findAccountPage(slug: string): AccountPage | undefined {
  return accountPages.find((p) => p.slug === slug);
}