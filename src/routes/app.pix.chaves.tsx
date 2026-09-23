import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { addPixKey, removePixKey, useBank } from "@/lib/bank";
import { detectKeyType, type PixKeyType } from "@/lib/pix";

export const Route = createFileRoute("/app/pix/chaves")({
  head: () => ({
    meta: [
      { title: "Minhas chaves Pix — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Cadastre, consulte e exclua chaves Pix da conta empresarial nesta demonstração.",
      },
      { property: "og:title", content: "Minhas chaves Pix — Conta Empresas (demo)" },
      { property: "og:description", content: "Cadastre, consulte e exclua chaves Pix." },
    ],
  }),
  component: ChavesPix,
});

const types: PixKeyType[] = ["CPF", "CNPJ", "E-mail", "Celular", "Aleatória"];

function ChavesPix() {
  const { pixKeys } = useBank();
  const [type, setType] = useState<PixKeyType>("E-mail");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const create = () => {
    setError(null);
    if (type === "Aleatória") {
      addPixKey("Aleatória", crypto.randomUUID());
      return;
    }
    const clean = value.trim();
    if (!clean) {
      setError("Informe o valor da chave.");
      return;
    }
    if (pixKeys.some((k) => k.value === clean)) {
      setError("Esta chave já está cadastrada.");
      return;
    }
    const detected = detectKeyType(clean);
    if (detected && detected !== type) {
      setError(`Este valor parece ser do tipo ${detected}. Ajuste o tipo ou o valor.`);
      return;
    }
    addPixKey(type, clean);
    setValue("");
  };

  return (
    <>
      <SubHeader title="Minhas chaves" fallbackTo="/app/pix" compactActions />
      <main className="px-4 py-5">
        <h2 className="text-lg font-semibold">Chaves cadastradas</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card shadow-card">
          {pixKeys.map((k) => (
            <li key={k.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">{k.type}</span>
                <span className="block break-all font-medium">{k.value}</span>
              </span>
              <button
                type="button"
                onClick={() => removePixKey(k.id)}
                aria-label={`Excluir chave ${k.value}`}
                className="shrink-0 rounded-full p-2 text-brand-red transition-colors hover:bg-secondary"
              >
                <Trash2 className="size-5" aria-hidden />
              </button>
            </li>
          ))}
          {pixKeys.length === 0 && (
            <li className="p-4 text-sm text-muted-foreground">Nenhuma chave cadastrada.</li>
          )}
        </ul>

        <h2 className="mt-6 text-lg font-semibold">Cadastrar nova chave</h2>
        <label className="mt-3 block">
          <span className="text-sm font-medium">Tipo</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PixKeyType)}
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        {type !== "Aleatória" && (
          <label className="mt-4 block">
            <span className="text-sm font-medium">Valor da chave</span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === "E-mail" ? "nome@empresa.com.br" : "Somente números"}
              className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-secondary px-3 py-2 text-sm text-brand-red">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={create}
          className="mt-6 w-full rounded-full bg-primary py-3.5 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          {type === "Aleatória" ? "Gerar chave aleatória" : "Cadastrar chave"}
        </button>
      </main>
    </>
  );
}
