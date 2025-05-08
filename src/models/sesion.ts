import { Model, Sequelize, DataTypes } from 'sequelize';
import { z } from "zod"

// 1. TYPESCRIPT INTERFACES


export interface ISesion {
  nSesion: number;
  nUsuario: number;
  accessKey: string;
  refreshKey: string;
  nEstatus: number;
}

// 2. z SCHEMA IDataUsuario
export const rolSchema = z.object({
  nSesion: z.number().min(1),
  nUsuario: z.string().min(3).max(20),
  accessKey: z.string().min(3).max(20),
  refreshKey: z.string().min(3).max(20),
  nEstatus: z.number().min(1),
})


//
// 3. SEQUELIZE MODEL WITH INSTANCE METHODS
//
export class Sesion
  extends Model<ISesion, Omit<ISesion, 'nSesion'>>
  implements ISesion {
  declare public nSesion: number;
  declare public nUsuario: number;
  declare public accessKey: string;
  declare public refreshKey: string;
  declare public nEstatus: number;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;

  /**
   * Regresa un objeto ISesion ni timestamps
   */
  public toObj(): ISesion {
    const { nSesion,
      nUsuario,
      accessKey,
      refreshKey,
      nEstatus,
    } = this.get({ plain: true });
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
    return this.get({ plain: true }) as ISesion
  }
}

export const loadModel = (sequelize: Sequelize) => {
  Sesion.init(
    {
      nSesion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nUsuario: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      accessKey: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      refreshKey: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      nEstatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Sesion',
      tableName: 'sesiones',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );
};

export default Sesion;
