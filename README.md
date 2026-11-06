# Ply

**One ply over fasthttp.** A thin, zero-allocation HTTP layer for Go.

[![Go](https://img.shields.io/badge/Go-1.26-blue)](https://go.dev)
[![Benchmarks](https://img.shields.io/badge/Benchmarks-PASS-brightgreen)]()
[![Go Report Card](https://goreportcard.com/badge/github.com/Dziqha/ply)](https://goreportcard.com/report/github.com/Dziqha/ply)
[![Coverage](https://img.shields.io/badge/Coverage-51.9%25-yellow)](https://github.com/Dziqha/ply/actions)
[![Contributions](https://img.shields.io/badge/Contributions-welcome-blueviolet)](https://github.com/Dziqha/ply/discussions)
[![License](https://img.shields.io/github/license/Dziqha/ply)](./LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/Dziqha/ply?style=flat)](https://github.com/Dziqha/ply/commits)
[![Issues](https://img.shields.io/github/issues/Dziqha/ply?style=flat)](https://github.com/Dziqha/ply/issues)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/public/images/ply-brand/png/ply-lockup-dark-2000w.png">
  <img src="./docs/public/images/ply-brand/png/ply-lockup-2000w.png" alt="Ply: one ply over fasthttp" width="100%">
</picture>

**Ply** uses `Tiered Zero-Copy Routing (TZCR)` to split routes into three levels: static, parametric, and wildcard. Routes are precompiled and kept in a cache-aware structure for fast, allocation-free matching. Middleware runs through chained handlers, and route groups support custom prefixes and middleware. This keeps Ply fast without giving up flexibility.

**Key features**

- Middleware-first via `.Use()`
- Fast router and context engine
- Built-in async engines (PubSub, Queue, Cache)
- Extensible and clean internal architecture
- Optional middleware: Auth, Logger, Recovery
- Test helpers: `app.Test(req)` runs requests in-process, no port needed
- CLI generator: `npx create-ply` for instant project scaffolding

---

## Authentication

Ply ships a JWT middleware for protecting routes. Within your app setup,
after `app := ply.New()`:

```go
app.Use(middleware.AuthJWT(os.Getenv("JWT_SECRET")))
```

Import `os` and `github.com/Dziqha/ply/middleware`.

Protected requests must send an `Authorization: Bearer <token>` header.
Missing or invalid tokens are rejected with `401`. See the
[Auth middleware docs](docs/content/docs/middleware/auth.mdx) for details.

Set the secret before starting the server:

```bash
export JWT_SECRET=supersecurekey123
```

---

## Getting started

### Install

```bash
go get github.com/Dziqha/ply
```

### Scaffold a project

```bash
npx create-ply@latest myapp
```

The generator prompts for a feature name and produces a feature-based
project layout that is ready to extend. Node.js is required only for the
scaffolding CLI. Ply itself has no Node.js dependency.

### Minimal application

```go
package main

import (
	"github.com/Dziqha/ply"
	"github.com/Dziqha/ply/core"
)

func main() {
	app := ply.New()

	app.Get("/", func(c *core.Context) {
		c.Text(200, "Hello from Ply")
	})

	app.RunServer(":8080")
}
```

Run it with:

```bash
go run main.go
```

The server listens on `http://localhost:8080`.

---

## Benchmarks

Measured on a 6C/12T Ryzen 5 5600H with Go 1.26, `wrk` on the same host,
round-robin reps, median of 3. Method, spread and caveats are documented
in [Benchmarks](docs/content/docs/benchmarks.mdx).

| Workload | Ply | fasthttp | Fiber v3 | Gin | Echo |
|---|---|---|---|---|---|
| `GET /user/42`, c=200, t=6 | 442,483 | 453,821 | 439,446 | 264,289 | 256,752 |
| `GET /user/42`, c=512, t=12 | 450,054 | 462,022 | 441,530 | 275,065 | 270,836 |
| In-process, per request | 180 ns | 173 ns (bare path+switch) | 305 ns | n/a | n/a |

Ply is a thin layer over fasthttp: within 3% of the engine and 1-2% of
Fiber in the thread-matched run, and inside the noise band at
oversubscribed concurrency. In-process it costs about 7 ns more than a
bare path-plus-switch handler. The value Ply adds is zero-allocation
routing and built-in engines, not a different HTTP engine.

---

## Contributing

Bug reports, feature requests and pull requests are welcome. Use
[Issues](https://github.com/Dziqha/ply/issues) for bugs and
[Discussions](https://github.com/Dziqha/ply/discussions) for questions
and design proposals.

## License

This project is licensed under the [MIT License](./LICENSE).
