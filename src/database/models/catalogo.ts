import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  DefaultScope,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

import CatalogoValor from './catalogoValor';
import {
  type ICatalogo,
  type ICatalogoFull,
  type ICatalogoInput,
  catalogoPublicSchema,
} from '../../models/catalogo';

/**
 * Modelo Sequelize de Catálogo.
 *
 * Esta clase vive en `src/database/models/` y SOLO debe importarse desde:
 *   - `src/loaders/sequelize.ts` (registro del modelo)
 *   - `src/repositories/catalogoRepository.ts` (operaciones de BD)
 *
 * Scopes:
 *   - default → excluye campos de auditoría (`createdAt`, `updatedAt`,
 *              `deletedAt`, `cCreatedBy`, `cUpdatedBy`).
 *   - full    → incluye TODOS los campos.
 */
@DefaultScope(() => ({
  attributes: {
    exclude: ['cCreatedBy', 'cUpdatedBy', 'createdAt', 'updatedAt', 'deletedAt'],
  },
}))
@Scopes(() => ({
  full: {
    attributes: { include: [] },
  },
}))
@Table({
  tableName: 'catalogo',
  timestamps: true,
  paranoid: true,
})
export class Catalogo extends Model<Catalogo, ICatalogoInput> implements ICatalogoFull {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare nIdCatalogo: number;

  @AllowNull(false)
  @Unique('uk_catalogo_clave')
  @Column({
    type: DataType.STRING(50),
  })
  declare cClave: string;

  @Column({
    type: DataType.STRING(200),
  })
  declare cDescripcion: string;

  @AllowNull(false)
  @Default(true)
  @Column({
    type: DataType.TINYINT,
  })
  declare bActivo: boolean;

  @Column({
    type: DataType.STRING(100),
  })
  declare cCreatedBy: string;

  @Column({
    type: DataType.STRING(100),
  })
  declare cUpdatedBy: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletedAt: Date;

  @HasMany(() => CatalogoValor)
  valores!: CatalogoValor[];

  /**
   * Regresa un objeto `ICatalogo` (DTO público) **inmutable** y validado
   * contra `catalogoPublicSchema`.
   */
  public toObj(): Readonly<ICatalogo> {
    const plain = this.get({ plain: true });
    return Object.freeze(
      catalogoPublicSchema.parse({
        nIdCatalogo: plain.nIdCatalogo,
        cClave: plain.cClave,
        cDescripcion: plain.cDescripcion ?? null,
        bActivo: Boolean(plain.bActivo),
      }),
    );
  }

  /**
   * Regresa un objeto `ICatalogoFull` (fila cruda) **inmutable**. Uso interno.
   */
  public toObjFull(): Readonly<ICatalogoFull> {
    return Object.freeze(this.get({ plain: true }) as ICatalogoFull);
  }
}

export default Catalogo;
