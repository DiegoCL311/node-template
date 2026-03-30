# Project Context for AI Assistants

This document provides a comprehensive overview of the **Node Template** architecture and patterns to help AI agents understand and contribute to this project effectively.

## 🚀 Technology Stack
- **Web Framework**: Express.js with TypeScript (`ts-node`/`nodemon`).
- **Database (ORM)**: `sequelize-typescript` (decorator-based models).
- **Validation**: **Zod** (exclusive for schemas and request validation).
- **Security**: Helmet, CORS (dynamic), Express-rate-limit, custom Sanitizer.
- **Documentation**: Swagger/OpenAPI (served at `/api-docs`).

---

## 🏗️ Folder Structure
- `src/loaders/`: Initialization logic (Express, Sequelize, Swagger, etc.).
- `src/routes/`: Route definitions (Versioned at `/api/v1`).
- `src/controllers/`: Request handlers (parsing, calling services, responding).
- `src/services/`: Business logic and Database interactions.
- `src/models/`: Sequelize models using decorators and Zod schemas.
- `src/core/`: Foundation classes like `ApiError` and `ApiResponse`.
- `src/middlewares/`: Express middlewares (Auth, Error, Sanitizer, validateRequest).

---

## 📜 Coding & Naming Conventions
- **Naming Prefix (Hungarian Notation)**: Apply to BOTH class properties and **Database Columns**:
  - `n` for Numbers (e.g., `nIdCatalogo`, `nRol`).
  - `c` for Strings/Chars (e.g., `cClave`, `cDescripcion`).
  - `b` for Booleans (e.g., `bActivo`, `bValido`).
  - **Exception**: Control columns like `createdAt`, `updatedAt`, `deletedAt` maintain standard Sequelize camelCase.
- **Project Structure**:
  - `src/controllers/`: Presentation Layer (Routes + HTTP Handlers).
  - `src/services/`: Logic Layer (Agnostic Business Rules).
  - `src/repositories/`: Data Layer (Pure DB Operations).
  - `src/models/`: Entity Definitions (Sequelize + Zod).

## 💎 Design Patterns
- **Unified Presentation**: Handlers reside in route files under `src/controllers/`.
- **Agnostic Services**: Services must never import `express` or use `req`/`res`.
- **Error Handling**:
  - Repositories: Throw `NoEntryError` when a record is not found for modification/deletion.
  - Services: Throw `NotFoundError` (or others from `ApiError.ts`) to be caught by the global handler.
- **Fail-Fast**: Validate everything with Zod at entry points (config, routes).
- **Traceability**: All requests carry a `x-request-id` header/ID automatically.

---

## 🛠️ Master Guide: Creating a New CRUD Module (Step-by-Step)

When asked to create a new module (e.g., **"Producto"**), follow these EXACT steps:

### Step 1: Database Model (`src/models/producto.ts`)
1. Define interfaces: `IDataProducto` (input), `IProductoFull` (DB).
2. Create **Zod schemas**: `productoSchema` (required fields).
3. Implement `Sequelize` Class using decorators.
4. Register the model in `src/loaders/sequelize.ts`.

### Step 2: Repository Layer (`src/repositories/productoRepository.ts`)
1. Implement pure database operations (`create`, `findByPk`, `update`, `destroy`).
2. These functions must be **agnostic of business logic**.

### Step 3: Service Layer (`src/services/productoService.ts`)
1. Implement the business logic (e.g., checking stock, calculating prices).
2. This layer calls the **Repositories** to persist or fetch data.
3. **CRITICAL**: No Express imports/types here.

### Step 4: Unified Route & Handler (`src/routes/producto.ts`)
1. Define the endpoints and their **handlers** in the same file.
2. Handlers do:
   - Authentication (`authMiddleware`).
   - Validation (`validateRequest`).
   - Call the **Service Layer**.
   - Format the final response and manage **cookies** or headers.
   - Use `ApiResponse` classes for output.
3. **IMPORTANT**: Include `@openapi` JSDoc annotations for every endpoint.
4. Register the router in `src/routes/index.ts`.

### Step 5: Swagger Components (`src/loaders/swagger.ts`)
1. Add the new object definition in `components/schemas`.
