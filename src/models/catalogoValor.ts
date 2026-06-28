import { z } from 'zod';

/**
 * Modelo público de Valor de Catálogo (tipos y schemas Zod).
 *
 * Este archivo SOLO expone tipos y schemas. La clase Sequelize vive en
 * `src/database/models/catalogoValor.ts`.
 *
 * Patrón de tipos (alineado con `roles.ts`, `catalogo.ts`, `usuario.ts`):
 *   - `ICatalogoValorInput` → entrada para crear/actualizar (derivado de Zod).
 *   - `ICatalogoValor`       → salida pública (derivado de Zod).
 *   - `ICatalogoValorFull`   → fila cruda de BD con timestamps y soft-delete.
 *
 * Convenciones:
 *   - Notación húngara (`n`/`c`/`b`) en columnas y propiedades.
 *   - `createdAt`, `updatedAt`, `deletedAt` mantienen camelCase estándar de Sequelize.
 */

//
// 1. INPUT SHAPE — fuente de verdad para creación/actualización
//
export const catalogoValorSchema = z.object({
  nIdCatalogo: z.number().int().positive(),
  nOrden: z.number().int().positive().optional(),
  cClave: z.string().min(1).max(50),
  cValor: z.string().min(1).max(200),
  cValorExtra: z.string().max(200).optional(),
  bActivo: z.boolean().optional(),
  cCreatedBy: z.string().max(100).optional(),
});

/** Tipo derivado del schema de entrada. */
export type ICatalogoValorInput = z.infer<typeof catalogoValorSchema>;

//
// 2. PUBLIC OUTPUT SHAPE — lo que se expone a clientes
//
export const catalogoValorPublicSchema = z.object({
  nIdCatalogoValor: z.number(),
  nIdCatalogo: z.number(),
  nOrden: z.number(),
  cClave: z.string(),
  cValor: z.string(),
  cValorExtra: z.string().nullable(),
  bActivo: z.boolean(),
  cCreatedBy: z.string().nullable(),
  cUpdatedBy: z.string().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

/** Tipo derivado del schema público. */
export type ICatalogoValor = z.infer<typeof catalogoValorPublicSchema>;

//
// 3. FULL ROW — fila cruda de la base de datos (uso interno del data layer)
//
export interface ICatalogoValorFull {
  nIdCatalogoValor: number;
  nIdCatalogo: number;
  nOrden: number;
  cClave: string;
  cValor: string;
  cValorExtra: string | null;
  bActivo: boolean;
  cCreatedBy: string | null;
  cUpdatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
