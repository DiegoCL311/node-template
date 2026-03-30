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
- **Naming Prefix**: Use Hungarian-like notation for database fields:
  - `n` for Numbers (e.g., `nUsuario`, `nRol`, `nEstatus`).
  - `c` for Strings/Chars (e.g., `cUsuario`, `cNombres`, `cPassword`).
  - `is` for Booleans (Optional, e.g., `isActivo`).
- **Standardized Responses**: Use `SuccessResponse(msg, data)`, `NoContentResponse()`, or `SuccessMsgResponse(msg).send(res)`.
- **Error Handling**: Throw `BadRequestError`, `NotFoundError`, `AuthFailureError`, etc. (Middleware catches them).
- **Requests**: Cast `Request` to `ProtectedRequest` to access `req.usuario`.

---

## 🛠️ Master Guide: Creating a New CRUD Module (Step-by-Step)

When asked to create a new module (e.g., **"Producto"**), follow these EXACT steps:

### Step 1: Model & Schema (`src/models/producto.ts`)
1. Define interfaces: `IDataProducto` (for input), `IProductoFull` (for DB).
2. Create **Zod schemas**: `productoSchema` (required fields) and `productoUpdateSchema` (optional).
3. Implement `Sequelize` Class using decorators (@Table, @Column, @PrimaryKey, @AutoIncrement).
4. Add helper methods like `toPublic()` if needed.

### Step 2: Register Model (`src/loaders/sequelize.ts`)
1. Import the new model.
2. Add it to the `decoratorModels` array.

### Step 3: Service Layer (`src/services/productoService.ts`)
1. Create functions using **Sequelize static methods** (`create`, `findAll`, `findByPk`, `update`, `destroy`).
2. Example functions: `crearProducto`, `obtenerProductos`, `obtenerProductoByPk`, `actualizarProducto`, `eliminarProducto`.

### Step 4: Controller Layer (`src/controllers/productoController.ts`)
1. Implement handlers using `asyncErrorHandler`.
2. Map HTTP results to `ApiResponse` instances.
3. Don't handle errors manually; let the global middleware work.

### Step 5: Router & Swagger (`src/routes/producto.ts`)
1. Use `asyncErrorHandler` for every route.
2. Add `authMiddleware` if the route is protected.
3. Use `validateRequest(productoSchema)` middleware before the controller.
4. **IMPORTANT**: Include `@openapi` JSDoc annotations for every endpoint.

### Step 6: Main Router Registration (`src/routes/index.ts`)
1. Register the new router: `app.use("/productos", productoRouter);`.

### Step 7: Swagger Schema (`src/loaders/swagger.ts`)
1. Add the new object definition in `components/schemas`.

---

## 💎 Design Patterns
- **Three-Tier Architecture**: Routes -> Controllers -> Services -> Models.
- **Async Error Wrapper**: Always wrap controllers or async calls in `asyncErrorHandler` or use the utility in routes.
- **Fail-Fast**: Validate everything with Zod at entry points (config, routes).
- **Traceability**: All requests carry a `x-request-id` header/ID automatically.
- **Auto-Documentation**: Keep Swagger JSDoc updated in routes at all times.
