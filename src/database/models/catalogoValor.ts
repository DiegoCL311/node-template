import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DefaultScope,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import Catalogo from './catalogo';
import {
  type ICatalogoValor,
  type ICatalogoValorFull,
  type ICatalogoValorInput,
  catalogoValorPublicSchema,
} from '../../models/catalogoValor';

/**
 * Modelo Sequelize de Valor de Catálogo.
 *
 * Esta clase vive en `src/database/models/` y SOLO debe importarse desde:
 *   - `src/loaders/sequelize.ts` (registro del modelo)
 *   - `src/repositories/catalogoValorRepository.ts` (operaciones de BD)
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
  tableName: 'catalogo_valor',
  timestamps: true,
  paranoid: true,
})
export class CatalogoValor
  extends Model<CatalogoValor, ICatalogoValorInput>
  implements ICatalogoValorFull
{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare nIdCatalogoValor: number;

  @AllowNull(false)
  @ForeignKey(() => Catalogo)
  @Column({
    type: DataType.INTEGER,
  })
  declare nIdCatalogo: number;

  @AllowNull(false)
  @Default(1)
  @Column({
    type: DataType.INTEGER,
  })
  declare nOrden: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  declare cClave: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
  })
  declare cValor: string;

  @Column({
    type: DataType.STRING(200),
  })
  declare cValorExtra: string;

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

  @BelongsTo(() => Catalogo)
  catalogo!: Catalogo;

  /**
   * Regresa un objeto `ICatalogoValor` (DTO público) **inmutable** y validado
   * contra `catalogoValorPublicSchema`.
   */
  public toObj(): Readonly<ICatalogoValor> {
    const plain = this.get({ plain: true });
    return Object.freeze(
      catalogoValorPublicSchema.parse({
        nIdCatalogoValor: plain.nIdCatalogoValor,
        nIdCatalogo: plain.nIdCatalogo,
        nOrden: plain.nOrden,
        cClave: plain.cClave,
        cValor: plain.cValor,
        cValorExtra: plain.cValorExtra ?? null,
        bActivo: Boolean(plain.bActivo),
        cCreatedBy: plain.cCreatedBy ?? null,
        cUpdatedBy: plain.cUpdatedBy ?? null,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
        deletedAt: plain.deletedAt ?? null,
      }),
    );
  }

  /**
   * Regresa un objeto `ICatalogoValorFull` (fila cruda) **inmutable**.
   * Uso interno del data layer.
   */
  public toObjFull(): Readonly<ICatalogoValorFull> {
    return Object.freeze(this.get({ plain: true }) as ICatalogoValorFull);
  }
}

export default CatalogoValor;
