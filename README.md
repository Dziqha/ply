# Ply

**One ply over fasthttp** — a thin, zero-allocation HTTP layer for Go.

[![Go](https://img.shields.io/badge/Go-1.26-blue)](https://go.dev)
[![Benchmarks](https://img.shields.io/badge/Benchmarks-PASS-brightgreen)]()
[![Go Report Card](https://goreportcard.com/badge/github.com/Dziqha/ply)](https://goreportcard.com/report/github.com/Dziqha/ply)
[![Coverage](https://img.shields.io/badge/Coverage-51.9%25-yellow)](https://github.com/Dziqha/ply/actions)
[![Contributions](https://img.shields.io/badge/Contributions-welcome-blueviolet)](https://github.com/Dziqha/ply/discussions)
[![License](https://img.shields.io/github/license/Dziqha/ply)](./LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/Dziqha/ply)](https://github.com/Dziqha/ply/commits)
[![Issues](https://img.shields.io/github/issues/Dziqha/ply)](https://github.com/Dziqha/ply/issues)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/public/images/ply-brand/png/ply-lockup-dark-2000w.png">
  <img src="./docs/public/images/ply-brand/png/ply-lockup-2000w.png" alt="Ply — one ply over fasthttp" width="100%">
</picture>

**Ply** employs a `Tiered Zero-Copy Routing (TZCR)` system that categorizes routes into three levels—static, parametric, and wildcard—for optimal performance. Each route is precompiled and stored in a cache-aware structure, enabling fast, zero-allocation matching. Middleware is executed through efficient handler chaining, and route grouping allows modular design with custom prefixes and middlewares. This approach makes Ply ideal for high-performance applications without sacrificing flexibility.

**Ply Key Features are :**

- Middleware-first — use `.Use()`
- Ultra-fast router & context engine
- Built-in async engines (PubSub, Queue, Cache)
- Extensible and clean internal architecture
- Optional middleware: Auth, Logger, Recovery
- Test helpers: `app.Test(req)` runs requests in-process, no port needed
- CLI generator: `npx create-ply` for instant project scaffolding

---

## 🔐 Example: Auth Middleware

Use the built-in auth middleware with environment variable `AUTH_SECRET`:

```go
app.Use(middleware.Auth(os.Getenv("AUTH_SECRET")))
```

Set your secret in `.env`:

```bash
export AUTH_SECRET=supersecurekey123
```

---

## 🚀 Getting started

###  Manual Installation Ply

```bash
go get github.com/Dziqha/ply
```

### Ply CLI (`npx create-ply@latest`)

> Scaffold Ply apps instantly via CLI.

```bash
npx create-ply@latest myapp
```

Interactive prompts:

* ✅ Feature name (e.g. user, auth, order)

* 📁 Feature-based project structure generated automatically

* ⚙️ Ready-to-extend architecture out of the box

> ⚠️ We intentionally use Node.js to overcome limitations of Go's CLI tooling, especially for rich interactive workflows.

### Running Ply Example


```go
package main

import (
	"github.com/Dziqha/ply"
	"github.com/Dziqha/ply/core"
)

func main() {
	app := ply.New()

	app.Get("/", func(c *core.Context) {
		c.Text(200, "Hello from Ply!")
	})

	app.RunServer(":8080")
}
```
To run the code, use the `go run` command, like:

```bash
go run example.go
```

> Your Ply app will be available at http://localhost:8080
---

## 🧪 Benchmark Overview

Measured on a 6C/12T Ryzen 5 5600H with Go 1.26, `wrk` on the same host,
round-robin reps, median of 3. Method, spread and caveats:
[Benchmarks docs](docs/content/docs/benchmarks.mdx).

| Workload | Ply | fasthttp | Fiber v3 | Gin | Echo |
|---|---|---|---|---|---|
| `GET /user/42`, c=200, t=6 | 442,483 | 453,821 | 439,446 | 264,289 | 256,752 |
| `GET /user/42`, c=512, t=12 | 450,054 | 462,022 | 441,530 | 275,065 | 270,836 |
| In-process, per request | 180 ns | 173 ns (bare path+switch) | 305 ns | — | — |

Ply is a thin layer over fasthttp: within 3% of the engine and 1-2% of
Fiber in the thread-matched run, and inside the noise band at oversubscribed
concurrency. In-process it costs ~7 ns more than a bare path-plus-switch
handler. What the framework adds is zero-allocation routing and built-in
engines, not a different HTTP engine.

---

## 🤝 Contributing

Contributions are welcome — from fixing typos to suggesting ideas or building features. Ply grows through small steps, open discussions, and shared curiosity. Join the conversation on [Discussions](https://github.com/Dziqha/ply/discussions).

## ❤️ About

Ply is handcrafted with performance, simplicity, and extensibility in mind — empowering developers to build Go web backends without the bloat.

**Ready to go fast? Build with Ply.** 🌀
Give it a ⭐ on GitHub if you like it!

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE)


> Built with love by [@dziqha](https://github.com/dziqha)