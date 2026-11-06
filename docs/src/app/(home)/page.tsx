import Image from "next/image";
import Link from "next/link";
import { CopyCommand } from "@/components/copy-command";

const tiers = [
  { name: "Static", example: "/health", note: "Exact match, direct lookup" },
  { name: "Parametric", example: "/users/:id", note: "Captured segments, no allocation" },
  { name: "Wildcard", example: "/assets/*", note: "Fallback for the remaining tail" },
];

const engines = ["Queue", "Pub/Sub", "Cache", "Graceful shutdown"];

const stats = [
  { label: "Routing", value: "Tiered" },
  { label: "Engine", value: "fasthttp" },
  { label: "Language", value: "Go" },
];

const card =
  "rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 md:p-8 transition hover:border-neutral-400 dark:hover:border-neutral-600";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[linear-gradient(to_right,rgb(0_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl pt-20 pb-24 md:pt-28">
        <section className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 mb-24">
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-8">
              <Image
                src="/images/ply-brand/png/ply-mascot-dark-1024.png"
                alt="Ply"
                width={140}
                height={140}
                priority
                className="h-20 w-20 dark:hidden"
              />
              <Image
                src="/images/ply-brand/png/ply-mascot-1024.png"
                alt="Ply"
                width={140}
                height={140}
                priority
                className="hidden h-20 w-20 dark:block"
              />
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70 backdrop-blur px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              A thin layer over fasthttp
            </span>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-5">
              One ply over{" "}
              <span className="text-neutral-400 dark:text-neutral-500">fasthttp.</span>
            </h1>

            <p className="mx-auto lg:mx-0 max-w-lg text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10 text-balance">
              A thin HTTP layer for Go. Routing, middleware and built-in
              engines, with the cost of the framework kept visible.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mb-8">
              <Link
                href="/docs"
                className="px-6 py-3 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-sm font-medium transition hover:opacity-90"
              >
                Get started
              </Link>
              <Link
                href="/docs"
                className="px-6 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                Documentation
              </Link>
            </div>

            <CopyCommand command="go get github.com/Dziqha/ply" />
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="ml-3 font-mono text-xs text-neutral-500">main.go</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300">
{`package main

import (
    "github.com/Dziqha/ply"
    "github.com/Dziqha/ply/core"
)

func main() {
    app := ply.New()

    app.Get("/users/:id", func(c *core.Context) {
        c.JSON(200, map[string]string{
            "id": c.Param("id"),
        })
    })

    app.RunServer(":8080")
}`}
            </pre>
          </div>
        </section>

        <section className="mx-auto max-w-3xl mb-24">
          <dl className="grid grid-cols-3 divide-x divide-neutral-200 dark:divide-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-6 text-center">
                <dd className="text-lg md:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {s.value}
                </dd>
                <dt className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-24">
          <div className="mb-10 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">
              Small surface, nothing hidden
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Ply stays close to fasthttp and adds only what a service needs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className={`${card} lg:col-span-2`}>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Tiered routing
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                Static, parametric and wildcard routes, compiled for
                allocation-free matching on the hot path.
              </p>
              <ol className="space-y-2">
                {tiers.map((t, i) => (
                  <li
                    key={t.name}
                    className="flex items-center gap-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-3"
                  >
                    <span className="font-mono text-xs text-neutral-400">0{i + 1}</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 w-24">
                      {t.name}
                    </span>
                    <code className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                      {t.example}
                    </code>
                    <span className="ml-auto hidden text-xs text-neutral-500 md:block">
                      {t.note}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={card}>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Built on fasthttp
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Ply uses the fasthttp request and response model directly,
                including its pooled request contexts. Routing, middleware and
                response helpers sit on top without replacing the engine, and
                handlers keep access to the underlying fasthttp context.
              </p>
            </div>

            <div className={card}>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Small core
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Explicit APIs and few abstractions between handler and request.
              </p>
            </div>

            <div className={`${card} lg:col-span-2`}>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Built-in engines
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-5">
                Queue, pub/sub and caching, plus graceful shutdown.
              </p>
              <div className="flex flex-wrap gap-2">
                {engines.map((e) => (
                  <span
                    key={e}
                    className="rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative grid grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white px-8 py-14 text-neutral-900 shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 md:px-14 lg:grid-cols-2">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-neutral-900/[0.03] blur-3xl dark:bg-white/[0.06]"
          />
        
          <div className="relative">
            <h2 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Start with a single route
            </h2>
            <p className="max-w-md text-neutral-600 dark:text-neutral-400">
              Install the module, register a handler, and read the docs when you
              need more.
            </p>
          </div>
        
          <div className="relative flex flex-col gap-4 lg:items-end">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/docs"
                className="rounded-lg bg-neutral-900 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
              >
                Read the docs
              </Link>
              <Link
                href="https://github.com/Dziqha/ply"
                className="rounded-lg border border-neutral-300 px-6 py-3 text-center text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-200 dark:hover:bg-white/10"
              >
                GitHub
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}