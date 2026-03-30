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

export interface IRol {
  nRol: number;
  cRol: string;
}

// 2. z SCHEMA IRol
export const rolSchema = z.object({
  nRol: z.number().min(1),
  cRol: z.string().min(3).max(20),
});

//
// 3. SEQUELIZE MODEL WITH DECORATORS
//
@Table({
  tableName: 'roles',
  timestamps: true,
})
export class Rol extends Model<IRol, Omit<IRol, 'nRol'>> implements IRol {
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
   * Regresa un objeto IRol sin timestamps
   */
  public toObj(): IRol {
    const { nRol, cRol } = this.get({ plain: true });
    return { nRol, cRol };
  }

  /**
   * Regresa un objeto IRol con todos los datos
   */
  public toObjFull(): IRol {
    return this.get({ plain: true }) as IRol;
  }
}

export default Rol;

