import { z } from 'zod';

/**
 * Modelo público de Usuario (tipos y schemas Zod).
 *
 * Este archivo SOLO expone tipos y schemas. La clase Sequelize vive en
 * `src/database/models/usuario.ts` y no debe importarse desde aquí ni desde
 * ninguna capa por encima del data layer.
 *
 * Patrón de tipos:
 *   - `IDataUsuario`  → entrada para crear (derivado de Zod).
 *   - `IUsuario`      → salida pública (derivado de Zod).
 *   - `IUsuarioFull`  → fila cruda de BD (incluye password + timestamps).
 *                      No derivable de Zod (timestamps gestionados por Sequelize).
 *
 * Convenciones:
 *   - Notación húngara (`n`/`c`/`b`) en columnas y propiedades.
 *   - `createdAt`, `updatedAt`, `deletedAt` mantienen camelCase estándar de Sequelize.
 */

//
// 1. INPUT SHAPE — fuente de verdad para creación
//
export const usuarioSchema = z.object({
  nRol: z.number().min(1),
  cNombres: z.string().min(3).max(50),
  cApellidos: z.string().min(3).max(50),
  cUsuario: z.string().max(100),
  cPassword: z.string().min(6).max(255),
});

export const loginSchema = z.object({
  cUsuario: z.string().max(100),
  cPassword: z.string().min(6).max(255),
});

/** Tipo derivado del schema de entrada. */
export type IDataUsuario = z.infer<typeof usuarioSchema>;

//
// 2. PUBLIC OUTPUT SHAPE — lo que se expone a clientes
//
export const usuarioPublicSchema = z.object({
  nUsuario: z.number(),
  cUsuario: z.string(),
  nRol: z.number(),
  nEstatus: z.number(),
  cNombres: z.string(),
  cApellidos: z.string(),
});

/** Tipo derivado del schema público. */
export type IUsuario = z.infer<typeof usuarioPublicSchema>;

//
// 3. FULL ROW — fila cruda de la base de datos (uso interno del data layer)
//
/**
 * Fila completa de la tabla `usuarios` (incluye password y timestamps).
 * No se deriva de Zod porque los timestamps son gestionados por Sequelize.
 */
export interface IUsuarioFull {
  nUsuario: number;
  nRol: number;
  nEstatus: number;
  cNombres: string;
  cApellidos: string;
  cUsuario: string;
  cPassword: string;
  createdAt: Date;
  updatedAt: Date;
}
