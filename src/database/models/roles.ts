import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DefaultScope,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { type IRol, type IRolFull, type IRolInput, rolPublicSchema } from '../../models/roles';

/**
 * Modelo Sequelize de Rol.
 *
 * Esta clase vive en `src/database/models/` y SOLO debe importarse desde:
 *   - `src/loaders/sequelize.ts` (registro del modelo)
 *   - `src/repositories/rolRepository.ts` (operaciones de BD)
 *
 * Scopes:
 *   - default → excluye campos de auditoría (`createdAt`, `updatedAt`).
 *   - full    → incluye TODOS los campos (auditoría interna).
 */
@DefaultScope(() => ({
  attributes: {
    exclude: ['createdAt', 'updatedAt'],
  },
}))
@Scopes(() => ({
  full: {
    attributes: { include: [] },
  },
}))
@Table({
  tableName: 'roles',
  timestamps: true,
})
export class Rol extends Model<Rol, IRolInput> implements IRolFull {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER.UNSIGNED,
  })
  declare nRol: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
  })
  declare cRol: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  /**
   * Regresa un objeto `IRol` (DTO público) **inmutable** y validado contra
   * `rolPublicSchema`.
   */
  public toObj(): Readonly<IRol> {
    const { nRol, cRol } = this.get({ plain: true });
    return Object.freeze(rolPublicSchema.parse({ nRol, cRol }));
  }

  /**
   * Regresa un objeto `IRolFull` (fila cruda) **inmutable**. Uso interno.
   */
  public toObjFull(): Readonly<IRolFull> {
    return Object.freeze(this.get({ plain: true }) as IRolFull);
  }
}

export default Rol;
