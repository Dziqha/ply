import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Tiered routing",
    desc: "Static, parametric and wildcard routes, compiled for allocation-free matching.",
  },
  {
    title: "Built on fasthttp",
    desc: "Uses the fasthttp request and response model directly.",
  },
  {
    title: "Small core",
    desc: "Explicit APIs and few abstractions between handler and request.",
  },
  {
    title: "Built-in engines",
    desc: "Queue, pub/sub and caching, plus graceful shutdown.",
  },
];

const stats = [
  { label: "Routing", value: "Tiered" },
  { label: "Engine", value: "fasthttp" },
  { label: "Language", value: "Go" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6">
      <div className="mx-auto max-w-5xl pt-20 pb-24 md:pt-28">
        {/* Hero */}
        <section className="mx-auto max-w-2xl text-center mb-20">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/ply-brand/png/ply-mascot-dark-1024.png"
              alt="Ply"
              width={140}
              height={140}
              priority
              className="h-28 w-28 md:h-32 md:w-32 dark:hidden"
            />
            <Image
              src="/images/ply-brand/png/ply-mascot-1024.png"
              alt="Ply"
              width={140}
              height={140}
              priority
              className="hidden h-28 w-28 md:h-32 md:w-32 dark:block"
            />
          </div>

          <span className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-6">
            A thin layer over fasthttp
          </span>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-5">
            Ply
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10 text-balance">
            One ply over fasthttp. A thin HTTP layer for Go.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
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
        </section>

        {/* Install snippet */}
        <section className="mx-auto max-w-xl mb-20">
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-5 py-4 font-mono text-sm text-neutral-700 dark:text-neutral-300 overflow-x-auto">
            <span className="text-neutral-400 dark:text-neutral-500 select-none">$ </span>
            go get github.com/Dziqha/ply
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-3xl mb-24">
          <dl className="grid grid-cols-3 divide-x divide-neutral-200 dark:divide-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-800">
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

        {/* Description */}
        <section className="mx-auto max-w-3xl mb-24">
          <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed text-center text-balance">
            Ply adds routing, middleware and built-in engines on top of{" "}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              fasthttp
            </span>
            . It keeps the HTTP engine and focuses on predictable overhead, so
            the cost of the framework stays visible.
          </p>
        </section>

        {/* Features */}
        <section className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 transition hover:border-neutral-400 dark:hover:border-neutral-600"
              >
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}