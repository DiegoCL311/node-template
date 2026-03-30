import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { z } from 'zod';
import Catalogo from './catalogo';

// 1. INTERFACES
export interface ICatalogoValor {
  nIdCatalogoValor?: number;
  nIdCatalogo: number;
  nOrden: number;
  cClave: string;
  cValor: string;
  cValorExtra?: string;
  bActivo?: boolean;
  cCreatedBy?: string;
  cUpdatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// 2. ZOD SCHEMA
export const catalogoValorSchema = z.object({
  id_catalogo: z.number().int().positive(),
  orden: z.number().int().positive().optional(),
  clave: z.string().min(1).max(50),
  valor: z.string().min(1).max(200),
  valor_extra: z.string().max(200).optional(),
  b_activo: z.boolean().optional(),
  created_by: z.string().max(100).optional(),
});

// 3. MODEL
@Table({
  tableName: 'catalogo_valor',
  timestamps: true,
  paranoid: true,
})
export class CatalogoValor extends Model<CatalogoValor, ICatalogoValor> implements ICatalogoValor {
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

  public toObj(): ICatalogoValor {
    return this.get({ plain: true });
  }
}

export default CatalogoValor;
