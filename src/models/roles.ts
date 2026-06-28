import { z } from 'zod';

/**
 * Modelo público de Rol (tipos y schemas Zod).
 *
 * Este archivo SOLO expone tipos y schemas. La clase Sequelize vive en
 * `src/database/models/roles.ts`.
 *
 * Patrón de tipos:
 *   - `IRolInput` → entrada para crear/actualizar (derivado de Zod).
 *   - `IRol`       → salida pública (derivado de Zod, lo que retorna `toObj()`).
 *   - `IRolFull`   → fila cruda de BD con timestamps (no derivable de Zod).
 */

//
// 1. INPUT SHAPE — fuente de verdad para creación/actualización
//
export const rolSchema = z.object({
  nRol: z.number().min(1),
  cRol: z.string().min(3).max(20),
});

/** Tipo derivado del schema de entrada. */
export type IRolInput = z.infer<typeof rolSchema>;

//
// 2. PUBLIC OUTPUT SHAPE — lo que se expone a clientes
//
export const rolPublicSchema = z.object({
  nRol: z.number(),
  cRol: z.string(),
});

/** Tipo derivado del schema público. */
export type IRol = z.infer<typeof rolPublicSchema>;

//
// 3. FULL ROW — fila cruda de la base de datos
//
export interface IRolFull {
  nRol: number;
  cRol: string;
  createdAt: Date;
  updatedAt: Date;
}
