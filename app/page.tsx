// app/page.tsx
"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 text-gray-700 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow">
              OCR
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">
                OCR Docs
              </span>
              <span className="text-xs text-gray-500">
                Extração de texto de documentos
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500 transition"
            >
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 lg:flex-row lg:items-center">
          {/* Texto */}
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              Plataforma de OCR para seus documentos
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              Transforme imagens em texto editável em poucos segundos.
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-gray-600">
              Envie contratos, notas fiscais e fotos de documentos. Acompanhe o
              status do OCR e visualize o texto extraído em um painel simples,
              pensado para o seu dia a dia.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-500 transition"
              >
                Começar agora
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Já tenho conta
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Upload de imagens
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Status em tempo real do OCR
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Histórico com texto extraído
              </div>
            </div>
          </div>

          {/* Card de preview do dashboard */}
          <div className="flex-1">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Meus documentos
                  </h2>
                  <p className="text-xs text-gray-500">
                    Visão geral dos uploads e status de OCR.
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Preview
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Documento 1 */}
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-gray-900">
                      contrato-cliente.img
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                      ✅ Concluído
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                    <span>📅 05/12/2025 12:40</span>
                    <span>💾 1.2 MB</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[11px] text-gray-600">
                    Texto extraído pronto para copiar, buscar e analisar dentro
                    da plataforma.
                  </p>
                </div>

                {/* Documento 2 */}
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-gray-900">
                      nota-fiscal-123.png
                    </span>
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
                      🔄 Processando
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                    <span>📅 05/12/2025 12:38</span>
                    <span>💾 540 KB</span>
                  </div>
                  <p className="mt-2 text-[11px] text-gray-500">
                    OCR em andamento. Atualize a lista para ver o resultado.
                  </p>
                </div>

                {/* Documento 3 */}
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-gray-900">
                      foto-documento.jpg
                    </span>
                    <span className="rounded-full bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-700">
                      ❌ Falhou
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-gray-500">
                    Erro ao ler o texto. Tente reenviar com melhor qualidade ou
                    iluminação.
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-[11px] text-gray-500">
                  Crie sua conta para ver essa tela com seus próprios uploads.
                </span>
                <Link
                  href="/login"
                  className="text-[11px] font-semibold text-blue-700 hover:text-blue-600"
                >
                  Ir para login →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-xs text-gray-500">
          <span>
            © {new Date().getFullYear()} OCR Docs. Todos os direitos
            reservados.
          </span>
          <div className="flex gap-4">
            <button className="hover:text-gray-700 transition">
              Privacidade
            </button>
            <button className="hover:text-gray-700 transition">
              Termos
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
