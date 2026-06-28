import { z } from 'zod';

/**
 * Modelo público de Catálogo (tipos y schemas Zod).
 *
 * Este archivo SOLO expone tipos y schemas. La clase Sequelize vive en
 * `src/database/models/catalogo.ts`.
 *
 * Patrón de tipos:
 *   - `ICatalogoInput` → entrada para crear/actualizar (derivado de Zod).
 *   - `ICatalogo`       → salida pública (derivado de Zod, lo que retorna `toObj()`).
 *   - `ICatalogoFull`   → fila cruda de BD (incluye timestamps y soft-delete).
 */

//
// 1. INPUT SHAPE — fuente de verdad para creación/actualización
//
export const catalogoSchema = z.object({
  cClave: z.string().min(1).max(50),
  cDescripcion: z.string().max(200).optional(),
  bActivo: z.boolean().optional(),
  cCreatedBy: z.string().max(100).optional(),
});

/** Tipo derivado del schema de entrada. */
export type ICatalogoInput = z.infer<typeof catalogoSchema>;

//
// 2. PUBLIC OUTPUT SHAPE — lo que se expone a clientes
//
export const catalogoPublicSchema = z.object({
  nIdCatalogo: z.number(),
  cClave: z.string(),
  cDescripcion: z.string().nullable(),
  bActivo: z.boolean(),
});

/** Tipo derivado del schema público. */
export type ICatalogo = z.infer<typeof catalogoPublicSchema>;

//
// 3. FULL ROW — fila cruda de la base de datos (uso interno del data layer)
//
export interface ICatalogoFull {
  nIdCatalogo: number;
  cClave: string;
  cDescripcion: string | null;
  bActivo: boolean;
  cCreatedBy: string | null;
  cUpdatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
