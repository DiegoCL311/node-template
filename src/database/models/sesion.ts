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

import {
  type ISesion,
  type ISesionFull,
  type ISesionInput,
  sesionPublicSchema,
} from '../../models/sesion';

/**
 * Modelo Sequelize de Sesión.
 *
 * Esta clase vive en `src/database/models/` y SOLO debe importarse desde:
 *   - `src/loaders/sequelize.ts` (registro del modelo)
 *   - `src/repositories/sessionRepository.ts` (operaciones de BD)
 *
 * Scopes:
 *   - default → excluye `accessKey`, `refreshKey` y campos de auditoría.
 *   - full    → incluye TODOS los campos (necesario porque las funciones del
 *               repositorio de sesiones necesitan `accessKey`/`refreshKey`).
 */
@DefaultScope(() => ({
  attributes: {
    exclude: ['accessKey', 'refreshKey', 'createdAt', 'updatedAt'],
  },
}))
@Scopes(() => ({
  full: {
    attributes: { include: [] },
  },
}))
@Table({
  tableName: 'sesiones',
  timestamps: true,
})
export class Sesion extends Model<Sesion, ISesionInput> implements ISesionFull {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare nSesion: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare nUsuario: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(64),
  })
  declare accessKey: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(64),
  })
  declare refreshKey: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare nEstatus: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  /**
   * Regresa un objeto `ISesion` (DTO público, SIN claves) **inmutable**.
   */
  public toObj(): Readonly<ISesion> {
    const { nSesion, nUsuario, nEstatus } = this.get({ plain: true });
    return Object.freeze(sesionPublicSchema.parse({ nSesion, nUsuario, nEstatus }));
  }

  /**
   * Regresa un objeto `ISesionFull` (fila cruda CON claves) **inmutable**.
   * Uso interno del data layer.
   */
  public toObjFull(): Readonly<ISesionFull> {
    return Object.freeze(this.get({ plain: true }) as ISesionFull);
  }
}

export default Sesion;
