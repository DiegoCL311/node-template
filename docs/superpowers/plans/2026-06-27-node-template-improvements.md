# Mejoras del Node Template - Plan de Implementación

> **Para agentes:** Implementar este plan sprint por sprint usando subagentes paralelos. Cada sprint tiene archivos disjuntos para evitar conflictos.

**Goal:** Llevar el template de "funcional con varios defectos" a "producción-ready, testeable, documentado y mantenible".

**Architecture:** Mantener la arquitectura actual (Express + Sequelize-typescript + Zod + Swagger + Winston). Reforzar con validaciones más estrictas, tests aislados (mocks), migraciones reales, y documentación completa. No romper la API pública de los módulos existentes.

**Tech Stack:** Node 18+, TypeScript 5.4, Express 4, Sequelize 6, Zod 3, Jest 29, ESLint 9, Prettier 3, Husky 9, Winston 3, helmet, express-rate-limit, jsonwebtoken, bcrypt.

## Global Constraints

- **Naming Hungarian:** Mantener `n`/`c`/`b`/`d`/`t` en columnas y propiedades.
- **Strict TS:** `noUncheckedIndexedAccess`, `useUnknownInCatchVariables`, `strict: true` activos.
- **Commits frecuentes** al terminar cada sub-tarea.
- **No romper API pública:** No cambiar firmas exportadas sin actualizar consumidores.
- **No subir secretos:** `.env*` debe quedar en `.gitignore`. Crear `.env.example` con placeholders.
- **No crear duplicados:** Respetar las reglas de jscpd (umbral 1%).

---

## Sprint 1: Seguridad y Bugs Críticos (Agente A)

**Archivos propiedad exclusiva del Agente A:**

- `src/app.ts`
- `src/middlewares/authMiddleware.ts`
- `src/middlewares/errorMiddleware.ts`
- `src/middlewares/sanitizerMiddleware.ts`
- `src/loaders/express.ts`
- `src/utils/utils.ts`
- `package.json` (solo añadir deps; no quitar)
- `.gitignore`
- `.env.example` (crear nuevo)
- `src/constants/index.ts` (crear nuevo)

### Tareas

#### Task A1: Fix bug en `src/app.ts:14`

- `app.listen(3000, ...)` debe usar `port` del config.
- Eliminar `dotenv.config()` redundante (ya se carga en `config/index.ts`).

#### Task A2: Fix bug crítico en `src/middlewares/authMiddleware.ts`

- Cambiar `JWT.decode(accessToken!)` por `JWT.validate(accessToken!)` para validar expiración.
- En `src/utils/utils.ts`, eliminar o marcar `validateTokenData` como deprecated si ya no es necesario.
- Mantener el manejo de errores como `AuthFailureError`.

#### Task A3: Refactor `src/middlewares/errorMiddleware.ts`

- Reemplazar `switch (true) { case ... instanceof ... }` por `if/else if`.
- No cambiar el comportamiento observable.

#### Task A4: Mejorar `src/middlewares/sanitizerMiddleware.ts`

- Implementar sanitización robusta: rechazar `<script>`, `<iframe>`, `javascript:`, `on*=` atributos.
- NO mutar `req.body` directamente; crear una copia sanitizada en `res.locals`.
- Actualizar los handlers que dependan del body para leer de `res.locals` cuando aplique.

#### Task A5: Hardening en `src/loaders/express.ts`

- Añadir `express.json({ limit: '100kb' })` y `express.urlencoded({ limit: '100kb', extended: true })`.
- Añadir rate-limit específico para `/auth` (5 req/min) antes del global.
- Asegurar que `helmet()` se aplica antes de `cors()`.

#### Task A6: Crear `src/constants/index.ts`

- Centralizar mensajes de error (NO_DATA, NO_ENTRY, AUTH_FAIL, etc.) en constantes reutilizables.
- Centralizar opciones de cookie (httpOnly, secure, sameSite, maxAge).
- Centralizar configuración de rate-limit (windowMs, max).
- Centralizar códigos de estado personalizados (StatusCode ya está en ApiResponse.ts, mantener).

#### Task A7: Actualizar `.gitignore`

- Añadir `.env`, `.env.*`, `!.env.example` para ignorar archivos de entorno reales.

#### Task A8: Crear `.env.example`

- Plantilla con placeholders para todas las variables requeridas por `src/config/index.ts`.
- Marcar claramente que JWT_PUBLIC_KEY/JWT_PRIVATE_KEY deben ser reemplazados.
- NO copiar las claves reales del `.env` actual.

#### Task A9: Añadir dependencia `express-xss-sanitizer`

- `npm install express-xss-sanitizer` y sus tipos.
- Reemplazar `sanitizerMiddleware` por el uso del paquete si es más confiable (decisión en A4).

---

## Sprint 2: Tests y CI (Agente B)

**Archivos propiedad exclusiva del Agente B:**

- `tests/**/*.ts`
- `tests/testSetup.ts`
- `dbscripts/mysql.sql`
- `.github/workflows/node.js.yml`
- `.husky/pre-commit`
- `.husky/pre-push`
- `jest.config.ts` (no, está en `config/jest.config.ts`)

### Tareas

#### Task B1: Reescribir `tests/unit/services/usuario.spec.ts`

- Mockear `src/repositories/usuarioRepository` en vez de `src/models/usuario`.
- Ajustar a las funciones reales exportadas por `src/services/usuarioService.ts`.
- Cubrir: `fetchAllUsers`, `fetchUserByPk`, `registerNewUser`, `modifyUser`, `removeUser`.

#### Task B2: Reescribir `tests/unit/controllers/authController.spec.ts`

- Mockear `src/services/authService` y `src/middlewares/authMiddleware`.
- Evitar inicializar loaders reales (no conectar a BD).
- Usar `request(app)` directamente con body válido.

#### Task B3: Crear test para `authMiddleware`

- Test que valida token expirado → 401.
- Test que valida token con firma inválida → 401.
- Test que valida token válido → next().

#### Task B4: Sincronizar `dbscripts/mysql.sql` con los modelos actuales

- Tablas: `usuarios` (nUsuario, nRol, nEstatus, cNombres, cApellidos, cUsuario, cPassword, createdAt, updatedAt).
- Tablas: `roles`, `sesiones`, `catalogo`, `catalogo_valor`.
- Asegurar constraints (UNIQUE, FK).

#### Task B5: Actualizar `.github/workflows/node.js.yml`

- Añadir step "Lint" (`npm run lint`).
- Añadir step "Typecheck" (`npm run typecheck`).
- Añadir step "Coverage" (`npm run test:coverage`).
- Fallar el job si coverage < 80% (configurable).

#### Task B6: Activar tests en `.husky/pre-push`

- Descomentar `npm test -- --passWithNoTests`.

#### Task B7: Activar lint-staged y typecheck en `.husky/pre-commit`

- Descomentar las líneas `#!npx lint-staged` y `#!npm run typecheck`.

---

## Sprint 3: Documentación y DX (Agente C)

**Archivos propiedad exclusiva del Agente C:**

- `README.md`
- `CONTRIBUTING.md` (crear nuevo)
- `.editorconfig` (crear nuevo)
- `.gitattributes` (crear nuevo)
- `AI_CONTEXT.md` (solo actualizar; no romper)

### Tareas

#### Task C1: README.md completo

- Título y descripción del template.
- Badges (CI, license, node version).
- Quick start (prerequisites, install, dev, build, test).
- Arquitectura (carpetas, capas).
- Convenciones (Hungarian, errores, validación).
- Crear un módulo CRUD (paso a paso, referenciando `AI_CONTEXT.md`).
- Variables de entorno (referenciar `.env.example`).
- Docker.
- Troubleshooting común.

#### Task C2: CONTRIBUTING.md

- Cómo reportar bugs.
- Cómo proponer features.
- Flujo de PR.
- Estándares de código (lint, prettier, typecheck).
- Tests requeridos para nuevas features.

#### Task C3: `.editorconfig`

- Root=true, charset=utf-8, end_of_line=lf, indent_style=space, indent_size=2, insert_final_newline=true, trim_trailing_whitespace=true.

#### Task C4: `.gitattributes`

- `* text=auto eol=lf`
- `*.png binary`
- `package-lock.json -diff` (para reducir ruido en PRs)

#### Task C5: Actualizar `AI_CONTEXT.md`

- Añadir referencia a `.env.example`.
- Documentar la convención de constants en `src/constants/`.
- Documentar la separación entre loaders activos (sequelize) y opcionales (mongoose/postgres/mssql).

---

## Sprint 4: Arquitectura (Agente D)

**Archivos propiedad exclusiva del Agente D:**

- `src/sequelize-migrations/` (crear nuevo) o `dbscripts/migrations/`
- `src/seeders/`
- `src/constants/` (parcialmente - solo añadir después de A6)
- `src/loaders/express.ts` (NO - es de Agente A; coordinar)
- `src/models/usuario.ts` (refactor parcial)
- `package.json` (solo añadir deps Sequelize CLI)

### Tareas

#### Task D1: Configurar Sequelize CLI

- Añadir `sequelize-cli` y `umzug` (o similar) como devDependencies.
- Crear `.sequelizerc` apuntando a `src/sequelize-migrations/` y `src/seeders/`.
- Crear `src/sequelize-migrations/config.js` con carga de variables de entorno.

#### Task D2: Crear migración inicial

- Generar `src/sequelize-migrations/0001-init-schema.js` con la creación de tablas según `dbscripts/mysql.sql` actualizado por B4.
- Incluir índices y FKs.

#### Task D3: Crear seeders básicos

- Crear `src/seeders/0001-roles.js` con roles básicos (ADMIN, USUARIO).
- Crear `src/seeders/0002-admin-user.js` con un usuario admin inicial.

#### Task D4: Añadir scripts de migración a `package.json`

- `db:migrate`, `db:migrate:undo`, `db:seed`, `db:reset`.

#### Task D5: Reducir duplicación en modelos

- Para `src/models/usuario.ts`: derivar tipos desde Zod schemas usando `z.infer`.
- Mantener la clase Sequelize pero eliminar las interfaces redundantes donde sea posible.
- Aplicar el patrón solo a este modelo como ejemplo.

#### Task D6: Rate-limit específico para auth (si A5 no lo hizo)

- Si A5 ya añadió rate-limit específico a `/auth`, marcar D6 como completado.

---

## Sprint 5: Verificación Final (Coordinador)

**Comandos a ejecutar (en orden):**

1. `npm run typecheck` → debe pasar
2. `npm run lint` → debe pasar
3. `npm run format:check` → debe pasar
4. `npm run build` → debe pasar
5. `npm test` → debe pasar
6. `npm run dupcheck` → debe pasar

**Si algo falla:**

- Asignar el fix al agente dueño del archivo correspondiente.
- NO mezclar archivos de diferentes agentes en un mismo fix.

---

## Notas de Coordinación

- **Conflictos potenciales y resolución:**
  - `package.json`: Agente A y D podrían añadir deps. Coordinar: A se enfoca en seguridad, D en migraciones. Sin solapamiento.
  - `.env.example`: Solo Agente A lo crea. Agente C solo referencia en README.
  - `src/constants/`: Agente A lo crea primero. Agente D puede extenderlo después.
  - `src/loaders/express.ts`: Solo Agente A lo modifica.

- **Orden de ejecución sugerido:**
  1. Agente A (seguridad) - paralelo con B, C, D
  2. Agente B (tests) - paralelo con C, D
  3. Agente C (docs) - paralelo con D
  4. Agente D (arquitectura) - paralelo
  5. Verificación final - secuencial

- **Entregables de cada agente:**
  - Resumen de cambios (archivos tocados).
  - Comandos ejecutados y resultados.
  - Cualquier desviación del plan con justificación.
