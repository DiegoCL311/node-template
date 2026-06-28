'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { z } = require('zod');

const DATA_FILE = path.join(__dirname, 'data', 'roles.json');

const RoleSeedSchema = z.object({
  cRol: z.string().min(3).max(20),
});

const RoleSeedListSchema = z.array(RoleSeedSchema).min(1);

function loadAndValidate() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw);
  return RoleSeedListSchema.parse(parsed);
}

module.exports = {
  /**
   * Seed: roles iniciales del sistema (ADMIN, USUARIO).
   *
   * Carga los datos desde `data/roles.json` y los valida con Zod antes
   * de insertarlos. Es idempotente respecto al constraint `cRol`
   * (re-ejecutarlo falla por UNIQUE, no duplica filas).
   *
   * Dependencias: ninguna (se ejecuta primero, prefijo `001-`).
   */
  async up(queryInterface /* , Sequelize */) {
    const roles = loadAndValidate();
    const now = new Date();

    await queryInterface.bulkInsert(
      'roles',
      roles.map((r) => ({ ...r, createdAt: now, updatedAt: now })),
      {},
    );
  },

  async down(queryInterface /* , Sequelize */) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
