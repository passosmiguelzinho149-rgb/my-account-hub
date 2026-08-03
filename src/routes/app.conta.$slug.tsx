import { createFileRoute, notFound } from "@tanstack/react-router";
import { SubHeader } from "@/components/app/SubHeader";
import { findAccountPage } from "@/lib/mock-data";

export const Route = createFileRoute("/app/conta/$slug")({
  loader: ({ params }) => {
    const page = findAccountPage(params.slug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Indisponível — Conta Empresas (demo)" }, { name: "robots", content: "noindex" }],
      };
    }
    const { title, intro } = loaderData.page;
    return {
      meta: [
        { title: `${title} — Conta Empresas (demo)` },
        { name: "description", content: intro },
        { property: "og:title", content: `${title} — Conta Empresas (demo)` },
        { property: "og:description", content: intro },
      ],
    };
  },
  component: ContaDetailScreen,
});

function ContaDetailScreen() {
  const { page } = Route.useLoaderData();

  return (
    <>
      <SubHeader title={page.title} fallbackTo="/app/perfil" />
      <main className="px-4 py-5">
        <p className="text-sm text-muted-foreground">{page.intro}</p>
        <dl className="mt-5 overflow-hidden rounded-xl bg-card shadow-card">
          {page.rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 border-b border-border px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center"
            >
              <dt className="text-sm text-muted-foreground">{row.label}</dt>
              <dd className="font-medium break-words sm:text-right">{row.value}</dd>
            </div>
          ))}
        </dl>
      </main>
    </>
  );
}