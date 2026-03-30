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
  HasMany,
} from 'sequelize-typescript';
import { z } from 'zod';
import CatalogoValor from './catalogoValor';

// 1. INTERFACES
export interface ICatalogo {
  nIdCatalogo?: number;
  cClave: string;
  cDescripcion?: string;
  bActivo?: boolean;
  cCreatedBy?: string;
  cUpdatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// 2. ZOD SCHEMA
export const catalogoSchema = z.object({
  cClave: z.string().min(1).max(50),
  cDescripcion: z.string().max(200).optional(),
  bActivo: z.boolean().optional(),
  cCreatedBy: z.string().max(100).optional(),
});

// 3. MODEL
@Table({
  tableName: 'catalogo',
  timestamps: true,
  paranoid: true,
})
export class Catalogo extends Model<Catalogo, ICatalogo> implements ICatalogo {
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

  public toObj(): ICatalogo {
    return this.get({ plain: true });
  }
}

export default Catalogo;
