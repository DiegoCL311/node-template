'use strict';

/**
 * Migración inicial: crea las tablas base del template.
 *
 * Tablas:
 *   - roles
 *   - usuarios
 *   - sesiones
 *   - catalogo
 *   - catalogo_valor
 *
 * Las definiciones reflejan los modelos de Sequelize en `src/models/`.
 *
 * Se ejecuta con `npm run db:migrate`.
 * Los seeders (002-roles, 003-admin-user) corren después con `npm run db:seed`.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      nRol: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      cRol: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('usuarios', {
      nUsuario: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nRol: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'nRol',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      nEstatus: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
      cNombres: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      cApellidos: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      cUsuario: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      cPassword: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('sesiones', {
      nSesion: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nUsuario: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'nUsuario',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      accessKey: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      refreshKey: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      nEstatus: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('catalogo', {
      nIdCatalogo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cClave: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      cDescripcion: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      bActivo: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      cCreatedBy: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      cUpdatedBy: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('catalogo', ['cClave'], {
      name: 'uk_catalogo_clave',
      unique: true,
    });

    await queryInterface.createTable('catalogo_valor', {
      nIdCatalogoValor: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nIdCatalogo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'catalogo',
          key: 'nIdCatalogo',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nOrden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      cClave: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      cValor: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      cValorExtra: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      bActivo: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      cCreatedBy: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      cUpdatedBy: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('catalogo_valor');
    await queryInterface.dropTable('catalogo');
    await queryInterface.dropTable('sesiones');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('roles');
  },
};
