import { z } from 'zod';

/**
 * Modelo público de Sesión (tipos y schemas Zod).
 *
 * Este archivo SOLO expone tipos y schemas. La clase Sequelize vive en
 * `src/database/models/sesion.ts`.
 *
 * Patrón de tipos:
 *   - `ISesionInput` → entrada para crear (sin PK), derivado de Zod.
 *   - `ISesion`       → salida pública, derivado de Zod.
 *   - `ISesionFull`   → fila cruda de BD con timestamps y claves (uso interno).
 */

//
// 1. INPUT SHAPE — fuente de verdad para creación
//
export const sesionSchema = z.object({
  nSesion: z.number().min(1),
  nUsuario: z.number().min(1),
  accessKey: z.string().min(3).max(64),
  refreshKey: z.string().min(3).max(64),
  nEstatus: z.number().min(1),
});

/** Tipo derivado del schema. */
export type ISesionInput = z.infer<typeof sesionSchema>;

//
// 2. PUBLIC OUTPUT SHAPE — lo que se expone a clientes
//
export const sesionPublicSchema = z.object({
  nSesion: z.number(),
  nUsuario: z.number(),
  nEstatus: z.number(),
});

/** Tipo derivado del schema público. */
export type ISesion = z.infer<typeof sesionPublicSchema>;

//
// 3. FULL ROW — fila cruda de la base de datos (uso interno del data layer)
//
export interface ISesionFull {
  nSesion: number;
  nUsuario: number;
  accessKey: string;
  refreshKey: string;
  nEstatus: number;
  createdAt: Date;
  updatedAt: Date;
}
