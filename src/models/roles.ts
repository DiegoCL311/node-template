import { Model, Sequelize, DataTypes } from 'sequelize';
import { z } from "zod"

// 1. TYPESCRIPT INTERFACES

export interface IRol {
  nRol: number;
  cRol: string;
}

// 2. z SCHEMA IDataUsuario
export const rolSchema = z.object({
  nRol: z.number().min(1),
  cRol: z.string().min(3).max(20),
})


//
// 3. SEQUELIZE MODEL WITH INSTANCE METHODS
//
export class Rol
  extends Model<IRol>
  implements IRol {
  declare public nRol: number;
  declare public cRol: string;
  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;

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
    // `get()` returns all dataValues; we just assert it matches IRol
    return this.get({ plain: true }) as IRol;
  }
}

export const loadModel = (sequelize: Sequelize) => {
  Rol.init(
    {
      nRol: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      cRol: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },

    },
    {
      sequelize,
      modelName: 'Rol',
      tableName: 'roles',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );
};

export default Rol;
