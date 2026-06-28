import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  DefaultScope,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

import {
  type IDataUsuario,
  type IUsuario,
  type IUsuarioFull,
  usuarioPublicSchema,
} from '../../models/usuario';

/**
 * Modelo Sequelize de Usuario.
 *
 * Esta clase vive en `src/database/models/` y SOLO debe importarse desde:
 *   - `src/loaders/sequelize.ts` (registro del modelo)
 *   - `src/repositories/usuarioRepository.ts` (operaciones de BD)
 *
 * Los servicios, middlewares y controllers deben consumir los tipos y DTOs
 * desde `src/models/usuario.ts`, nunca la clase directamente.
 *
 * Scopes:
 *   - default  → excluye `cPassword` y campos de auditoría.
 *   - full     → incluye TODOS los campos (para auditoría interna).
 *   - withPassword → incluye `cPassword` (solo flujo de login/autenticación).
 */
@DefaultScope(() => ({
  attributes: {
    exclude: ['cPassword', 'cCreatedBy', 'cUpdatedBy', 'createdAt', 'updatedAt'],
  },
}))
@Scopes(() => ({
  full: {
    attributes: { include: [] },
  },
  withPassword: {
    attributes: { include: ['cPassword'] },
  },
}))
@Table({
  tableName: 'usuarios',
  timestamps: true,
})
export class Usuario extends Model<IUsuarioFull, IDataUsuario> implements IUsuarioFull {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER.UNSIGNED,
  })
  declare nUsuario: number;

  @AllowNull(false)
  @Column({
    type: DataType.TINYINT.UNSIGNED,
  })
  declare nRol: number;

  @AllowNull(false)
  @Default(1)
  @Column({
    type: DataType.TINYINT.UNSIGNED,
  })
  declare nEstatus: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  declare cNombres: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  declare cApellidos: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(100),
  })
  declare cUsuario: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  declare cPassword: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  /**
   * Regresa un objeto `IUsuario` (DTO público) **inmutable** y validado
   * contra `usuarioPublicSchema`. No incluye password ni timestamps.
   */
  public toObj(): Readonly<IUsuario> {
    const plain = this.get({ plain: true });
    return Object.freeze(
      usuarioPublicSchema.parse({
        nUsuario: plain.nUsuario,
        nRol: plain.nRol,
        nEstatus: plain.nEstatus,
        cNombres: plain.cNombres,
        cApellidos: plain.cApellidos,
        cUsuario: plain.cUsuario,
      }),
    );
  }

  /**
   * Regresa un objeto `IUsuarioFull` (fila cruda, sin password) **inmutable**.
   * Pensado para uso interno del data layer. NO exponer al cliente HTTP.
   */
  public toObjFull(): Readonly<IUsuarioFull> {
    return Object.freeze(this.get({ plain: true }) as IUsuarioFull);
  }
}

export default Usuario;
