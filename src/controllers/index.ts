import express from 'express';

import authRoutes from './auth';
import catalogoRoutes from './catalogo';
import statusRoutes from './status';

const app = express();

// Rutas no protegidas por middleware de autenticación
app.use('/status', statusRoutes);
app.use('/auth', authRoutes);
app.use('/catalogos', catalogoRoutes);

export default app;
