'use strict';

const path = require('node:path');
const fs = require('node:fs');
const bcrypt = require('bcrypt');
const { z } = require('zod');

const DATA_FILE = path.join(__dirname, 'data', 'admin-user.json');

const BCRYPT_COST = Number(process.env.SEED_BCRYPT_COST) || 10;
const DEFAULT_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin123';

const AdminSeedSchema = z.object({
  cUsuario: z.string().min(3).max(100),
  cPasswordPlain: z.string().min(6).max(255),
  cNombres: z.string().min(3).max(50),
  cApellidos: z.string().min(3).max(50),
  nRol: z.number().int().min(1),
  nEstatus: z.number().int().min(0).default(1),
  bSeedPassword: z.boolean().default(true),
});

function loadAndValidate() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw);
  const merged = { ...parsed, cPasswordPlain: DEFAULT_PASSWORD };
  return AdminSeedSchema.parse(merged);
}

module.exports = {
  /**
   * Seed: usuario administrador inicial.
   *
   * Carga los datos desde `data/admin-user.json`, los valida con Zod,
   * hashea el password con bcrypt y los inserta.
   *
   * Variables de entorno (opcionales):
   *   - SEED_ADMIN_PASSWORD: password plana del admin (default: 'admin123').
   *   - SEED_BCRYPT_COST:    cost factor de bcrypt (default: 10).
   *
   * Dependencias:
   *   - Requiere que `001-roles` haya corrido primero (nRol=1 → ADMIN).
   */
  async up(queryInterface /* , Sequelize */) {
    const seed = loadAndValidate();
    const { cPasswordPlain, bSeedPassword, ...rest } = seed;

    const cPassword = bSeedPassword
      ? await bcrypt.hash(cPasswordPlain, BCRYPT_COST)
      : cPasswordPlain;

    const now = new Date();

    await queryInterface.bulkInsert(
      'usuarios',
      [{ ...rest, cPassword, createdAt: now, updatedAt: now }],
      {},
    );
  },

  async down(queryInterface /* , Sequelize */) {
    await queryInterface.bulkDelete('usuarios', { cUsuario: 'admin' });
  },
};
