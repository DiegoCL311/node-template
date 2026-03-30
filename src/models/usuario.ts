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
} from 'sequelize-typescript';
import { z } from "zod"


export interface IDataUsuario {
  cUsuario: string;
  nRol: number;
  cNombres: string;
  cApellidos: string;
  cPassword: string;
}

export interface IUsuario {
  nUsuario: number;
  cUsuario: string;
  nRol: number;
  nEstatus: number;
  cNombres: string;
  cApellidos: string;
}

export interface IUsuarioFull {
  nUsuario: number;
  nRol: number;
  nEstatus: number;
  cNombres: string;
  cApellidos: string;
  cUsuario: string;
  cPassword: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. z SCHEMA IDataUsuario
export const usuarioSchema = z.object({
  nRol: z.number().min(1),
  cNombres: z.string().min(3).max(50),
  cApellidos: z.string().min(3).max(50),
  cUsuario: z.string().max(100),
  cPassword: z.string().min(6).max(255),
})


export const loginSchema = z.object({
  cUsuario: z.string().max(100),
  cPassword: z.string().min(6).max(255),
})

//
// 3. SEQUELIZE MODEL WITH DECORATORS
//
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
   * Regresa un objeto IUsuario sin la contraseña ni timestamps
   */
  public toUsuario(): IUsuario {
    const { nUsuario, nRol, nEstatus, cNombres, cApellidos, cUsuario } = this.get({ plain: true });
    return { nUsuario, nRol, nEstatus, cNombres, cApellidos, cUsuario };
  }

  /**
   * Regresa un objeto IUsuarioFull con todos los datos
   */
  public toUsuarioFull(): IUsuarioFull {
    return this.get({ plain: true }) as IUsuarioFull;
  }
}

export default Usuario;
