import { Model, Sequelize, DataTypes } from 'sequelize';
import { z } from "zod"

// 1. TYPESCRIPT INTERFACES

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
// 3. SEQUELIZE MODEL WITH INSTANCE METHODS
//
export class Usuario
  extends Model<IUsuarioFull, IDataUsuario>
  implements IUsuarioFull {
  declare public nUsuario: number;
  declare public nRol: number;
  declare public nEstatus: number;
  declare public cNombres: string;
  declare public cApellidos: string;
  declare public cUsuario: string;
  declare public cPassword: string;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;

  /**
   * Regresa un objeto IUsuario sin la contraseña ni timestamps
   */
  public toUsuario(): IUsuario {
    const { nUsuario, nRol, nEstatus, cNombres, cApellidos, cUsuario } =
      this.get({ plain: true });
    return { nUsuario, nRol, nEstatus, cNombres, cApellidos, cUsuario };
  }

  /**
   * Regresa un objeto IUsuarioFull con todos los datos
   */
  public toUsuarioFull(): IUsuarioFull {
    // `get()` returns all dataValues; we just assert it matches IUsuarioFull
    return this.get({ plain: true }) as IUsuarioFull;
  }
}

export const loadModel = (sequelize: Sequelize) => {
  Usuario.init(
    {
      nUsuario: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nRol: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      nEstatus: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
      cNombres: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      cApellidos: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      cUsuario: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      cPassword: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      createdAt: '',
      updatedAt: ''
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );
};

export default Usuario;
