# Node Template

Production-ready Node.js + Express + TypeScript backend template with Sequelize, Zod validation, JWT authentication, and Swagger/OpenAPI documentation.

[![CI](https://img.shields.io/github/actions/workflow/status/diegocrzlugo/node-template/node.js.yml?branch=main&label=CI)](https://github.com/diegocrzlugo/node-template/actions)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.4-blue.svg)](https://www.typescriptlang.org)

## Features

- **Express 4** with TypeScript (`ts-node` for dev, compiled output for production)
- **Sequelize 6** with decorator-based models (`sequelize-typescript`)
- **Zod 3** for schema validation at every entry point (config, routes, models)
- **JWT RS256** authentication with refresh tokens stored in DB sessions
- **Swagger/OpenAPI** documentation served at `/api-docs`
- **Security**: Helmet, dynamic CORS, Express-rate-limit, custom XSS sanitizer
- **Winston** logging with request tracing via `x-request-id` header
- **Jest + Supertest** for unit and integration tests
- **ESLint + Prettier** with pre-commit/pre-push hooks via Husky
- **GitHub Actions** CI pipeline (lint, typecheck, coverage)
- **Docker** support via `docker-compose` (MySQL + API)
- **Semantic-release** for automated versioning and changelog
- **Hungarian notation** convention enforced on DB columns and class properties

## Quick Start

### Prerequisites

- Node.js 18 or higher
- MySQL 8.0 (or Docker)
- npm 9+

### Installation

```bash
git clone https://github.com/diegocrzlugo/node-template.git
cd node-template
npm install
```

### Environment Setup

Copy the example environment file and fill in the values:

```bash
cp .env.example .env
```

Edit `.env` and replace the JWT placeholders with real RSA keys. You can generate a key pair with:

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

### Run Development Server

```bash
npm run dev
```

The server starts on `http://localhost:3000` (configurable via `PORT`). Swagger UI is available at `http://localhost:3000/api-docs`.

### Run Tests

```bash
npm test                 # run all tests
npm run test:watch       # watch mode
npm run test:coverage    # generate coverage report
```

## Project Structure

```
.
├── src/
│   ├── app.ts                # Express application entry point
│   ├── config/               # Environment configuration (Zod-validated)
│   ├── controllers/          # Route definitions + HTTP handlers
│   ├── core/                 # Foundation: ApiError, ApiResponse, JWT helpers
│   ├── loaders/              # Initialization: Express, Sequelize, Swagger, Logger
│   ├── middlewares/          # Auth, Error, Sanitizer, Request Logger, 404
│   ├── models/               # Sequelize entities + Zod schemas
│   ├── repositories/         # Pure DB operations (agnostic of business logic)
│   ├── services/             # Business logic (never imports Express)
│   ├── types/                # TypeScript ambient declarations
│   └── utils/                # Helpers (asyncErrorHandler, etc.)
├── tests/
│   ├── testSetup.ts          # Jest global setup (loads .env.test)
│   ├── unit/
│   │   ├── controllers/      # HTTP handler tests with mocked services
│   │   ├── services/         # Business logic tests with mocked repositories
│   │   └── utils/            # Utility unit tests
├── dbscripts/                # Initial MySQL schema scripts
├── config/                   # Build/lint/test configuration files
├── docs/                     # Project documentation and plans
└── docker-compose.yml        # MySQL + API container stack
```

## Architecture

The application follows a layered architecture with strict separation of concerns:

```
HTTP Request
     |
     v
+---------+       +-------------+       +---------+       +-------------+       +-------+
| Routes  | ----> | Controllers | ----> | Services| ----> | Repositories| ----> | Models|
+---------+       +-------------+       +---------+       +-------------+       +-------+
   (HTTP)            (parse,                (business              (DB ops)          (DB)
                     validate,              rules,
                     respond)               errors)
```

### Layers

| Layer           | Path                | Responsibility                                                                            |
| --------------- | ------------------- | ----------------------------------------------------------------------------------------- |
| Routes/Handlers | `src/controllers/`  | HTTP concerns: parse request, call validation middleware, invoke service, format response |
| Services        | `src/services/`     | Business rules. **Must never** import `express`, `req`, or `res`                          |
| Repositories    | `src/repositories/` | Pure CRUD against the database. Throws `NoEntryError` when a record is missing            |
| Models          | `src/models/`       | Sequelize entities + Zod schemas for input validation                                     |
| Core            | `src/core/`         | Cross-cutting primitives: `ApiError`, `ApiResponse`, JWT helpers                          |
| Loaders         | `src/loaders/`      | One module per concern, run sequentially at startup                                       |

### Hungarian Notation Convention

Property names and database columns use type prefixes:

- `n` for Numbers (`nIdUsuario`, `nRol`, `nEstatus`)
- `c` for Strings/Chars (`cNombre`, `cEmail`, `cPassword`)
- `b` for Booleans (`bActivo`, `bValidado`)
- `d` for Dates (`dNacimiento`)
- `t` for Timestamps (`tCreacion`)

**Exception**: Sequelize-managed columns (`createdAt`, `updatedAt`, `deletedAt`) keep standard camelCase.

### Error Handling

Errors flow from repositories to services to a centralized middleware:

1. **Repositories** throw `NoEntryError` when an `update`/`delete`/`findByPk` targets a non-existent record.
2. **Services** throw domain errors from `ApiError.ts` (`NotFoundError`, `AuthFailureError`, `BadRequestError`, etc.).
3. The global `errorMiddleware` catches everything, maps it to an `ApiResponse`, and writes a consistent JSON envelope.

### Validation Strategy

- **Configuration** is validated at startup via Zod (`src/config/index.ts`). The process exits if env vars are missing.
- **HTTP input** is validated at the route boundary using `validateRequest(schema)` middleware.
- **Internal boundaries** validate with Zod before crossing layer boundaries when needed.

## Available Scripts

| Script                  | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `npm run dev`           | Start the development server with hot reload via nodemon |
| `npm start`             | Run the TypeScript source directly with ts-node          |
| `npm run production`    | Clean, build, and run the compiled JavaScript            |
| `npm run build`         | Compile TypeScript to JavaScript in `dist/`              |
| `npm run clean`         | Remove the `dist/` directory                             |
| `npm test`              | Run the Jest test suite                                  |
| `npm run test:watch`    | Run Jest in watch mode                                   |
| `npm run test:coverage` | Run Jest with coverage report                            |
| `npm run lint`          | Lint `src/` and `tests/` with ESLint                     |
| `npm run lint:fix`      | Lint and auto-fix issues                                 |
| `npm run format`        | Check formatting with Prettier                           |
| `npm run format:fix`    | Apply Prettier formatting                                |
| `npm run typecheck`     | Run TypeScript compiler in no-emit mode                  |
| `npm run dupcheck`      | Detect duplicate code with jscpd                         |
| `npm run release`       | Publish a new release with semantic-release              |

## Environment Variables

All variables are validated at startup. See [`.env.example`](.env.example) for a template.

| Variable          | Required | Default                 | Description                                |
| ----------------- | -------- | ----------------------- | ------------------------------------------ |
| `NODE_ENV`        | No       | `development`           | One of `development`, `test`, `production` |
| `PORT`            | No       | `3000`                  | HTTP port the server listens on            |
| `CORS_ORIGIN`     | No       | `http://localhost:5173` | Allowed origin for CORS                    |
| `MYSQL_HOST`      | Yes      | -                       | MySQL server hostname                      |
| `MYSQL_USER`      | Yes      | -                       | MySQL username                             |
| `MYSQL_PASSWORD`  | Yes      | -                       | MySQL password                             |
| `MYSQL_DATABASE`  | Yes      | -                       | MySQL database name                        |
| `MYSQL_PORT`      | No       | `3306`                  | MySQL server port                          |
| `JWT_PUBLIC_KEY`  | Yes      | -                       | RSA public key (PEM, single-line escaped)  |
| `JWT_PRIVATE_KEY` | Yes      | -                       | RSA private key (PEM, single-line escaped) |
| `JWT_EXPIRY_TIME` | No       | `3600`                  | Access token lifetime in seconds           |
| `JWT_ISSUER`      | No       | `issuer`                | JWT `iss` claim                            |
| `JWT_AUDIENCE`    | No       | `audience`              | JWT `aud` claim                            |

> **Never commit real secrets.** `.env` is gitignored; `.env.example` only contains placeholders.

## Creating a New Module

The project ships with a documented master guide in [`AI_CONTEXT.md`](AI_CONTEXT.md#master-guide-creating-a-new-crud-module-step-by-step). Here is the condensed version for a module called `Producto`:

### 1. Model (`src/models/producto.ts`)

Define interfaces (`IDataProducto`, `IProductoFull`), a Zod schema (`productoSchema`), and a Sequelize class with decorators. Register the model in `src/loaders/sequelize.ts`.

### 2. Repository (`src/repositories/productoRepository.ts`)

Pure DB operations: `create`, `findByPk`, `update`, `destroy`. Throw `NoEntryError` when a row is missing. No business rules here.

### 3. Service (`src/services/productoService.ts`)

Business logic only. **Do not import `express` or use `req`/`res`.** Call the repository, throw `NotFoundError` (or other `ApiError` subclasses) when appropriate.

### 4. Route + Handler (`src/controllers/producto.ts`)

Wire up endpoints, apply `authMiddleware` and `validateRequest`, call the service, and respond using `ApiResponse` classes. Add `@openapi` JSDoc blocks for Swagger. Register the router in `src/controllers/index.ts`.

### 5. Swagger Component (`src/loaders/swagger.ts`)

Add the new object definition under `components/schemas`.

For the complete walkthrough with code samples, see [`AI_CONTEXT.md`](AI_CONTEXT.md).

## Docker

The repository includes a `docker-compose.yml` that brings up MySQL and the API together.

```bash
docker-compose up --build
```

This will:

- Start MySQL 8.0 on host port `3307` (container port `3306`)
- Mount `./dbscripts` into MySQL's init directory so schema is loaded on first boot
- Build the API image from the included `Dockerfile` and start it on host port `3000`
- Wire `MYSQL_HOST=mysql` so the API talks to the containerized database

To stop and remove containers:

```bash
docker-compose down
```

To wipe MySQL data, also remove the volume:

```bash
docker-compose down -v
```

## Testing

Tests live under `tests/` and follow the same folder structure as `src/`. The Jest config is defined in `config/jest.config.ts` and the global setup in `tests/testSetup.ts` loads `.env.test`.

Conventions:

- Mock at the layer boundary: unit tests for services mock repositories, tests for controllers mock services.
- Avoid booting real loaders or opening database connections in unit tests.
- Add a test file next to the production code it covers (`*.spec.ts`).

```bash
npm test                 # run all
npm run test:watch       # watch mode
npm run test:coverage    # produce coverage/lcov-report/index.html
```

## Contributing

Contributions are welcome. Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines on reporting bugs, proposing features, submitting pull requests, and the coding standards enforced in this project.

## License

Released under the [ISC License](LICENSE).
