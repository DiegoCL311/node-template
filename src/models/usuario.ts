import { Model, Sequelize } from 'sequelize';
import { DataTypes } from "sequelize";
import Joi from "joi";

export interface IUsuario {
  id?: number;
  nombre: string;
  email: string;
  contrasena?: string;
}

export const registerSchema = Joi.object({
  email: Joi.string().email().required().email(),
  contrasena: Joi.string().required().min(6),
  nombre: Joi.string().required().min(3),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().email(),
  contrasena: Joi.string().required().min(6),
});

class Usuario extends Model<IUsuario> { }

export const loadModel = (sequelize: Sequelize) => {

  Usuario.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'usuarios',
    },
  );

}

export default Usuario;