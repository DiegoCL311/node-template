import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { z } from 'zod';

// 1. TYPESCRIPT INTERFACES

export interface ISesion {
  nSesion: number;
  nUsuario: number;
  accessKey: string;
  refreshKey: string;
  nEstatus: number;
}

// 2. z SCHEMA ISesion
export const sesionSchema = z.object({
  nSesion: z.number().min(1),
  nUsuario: z.number().min(1),
  accessKey: z.string().min(3).max(20),
  refreshKey: z.string().min(3).max(20),
  nEstatus: z.number().min(1),
});

//
// 3. SEQUELIZE MODEL WITH DECORATORS
//
@Table({
  tableName: 'sesiones',
  timestamps: true,
})
export class Sesion extends Model<ISesion, Omit<ISesion, 'nSesion'>> implements ISesion {
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
    type: DataType.STRING(20),
  })
  declare accessKey: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
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
   * Regresa un objeto ISesion sin timestamps
   */
  public toObj(): ISesion {
    const { nSesion, nUsuario, accessKey, refreshKey, nEstatus } = this.get({ plain: true });
    return {
      nSesion,
      nUsuario,
      accessKey,
      refreshKey,
      nEstatus,
    };
  }

  /**
   * Regresa un objeto con todos los datos
   */
  public toObjFull(): ISesion {
    return this.get({ plain: true }) as ISesion;
  }
}

export default Sesion;

