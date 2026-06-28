import { Router, Request, Response } from 'express';

import { ERROR_MESSAGES } from '../constants';
import { BadRequestError } from '../core/ApiError';
import { SuccessResponse, NoContentResponse } from '../core/ApiResponse';
import { validateRequest } from '../middlewares/validateRequest';
import { catalogoSchema } from '../models/catalogo';
import { catalogoValorSchema } from '../models/catalogoValor';
import * as catalogoService from '../services/catalogoService';
import * as catalogoValorService from '../services/catalogoValorService';
import asyncErrorHandler from '../utils/asyncErrorHandler';

const app = Router();

/**
 * @openapi
 * /catalogos/multi:
 *   get:
 *     summary: Obtener múltiples catálogos en una sola petición
 *     tags: [Catalogos]
 *     parameters:
 *       - name: claves
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Claves separadas por coma (Ej. ROL,ESTATUS)
 */
app.get(
  '/multi',
  asyncErrorHandler(async (req: Request, res: Response) => {
    const { claves } = req.query;
    if (!claves || typeof claves !== 'string') {
      throw new BadRequestError(ERROR_MESSAGES.CLAVES_REQUIRED);
    }

    const clavesArray = claves.split(',').map((c) => c.trim());
    const listMulti = await catalogoValorService.getMultipleValoresByClaves(clavesArray);

    new SuccessResponse('Catalogos múltiples obtenidos', listMulti).send(res);
  }),
);

/**
 * @openapi
 * /catalogos:
 *   get:
 *     summary: Obtener todos los catálogos
 *     tags: [Catalogos]
 */
app.get(
  '/',
  asyncErrorHandler(async (req: Request, res: Response) => {
    const list = await catalogoService.getAllCatalogos();
    new SuccessResponse('Catalogos obtenidos', list).send(res);
  }),
);

/**
 * @openapi
 * /catalogos:
 *   post:
 *     summary: Crear un catálogo
 *     tags: [Catalogos]
 */
app.post(
  '/',
  validateRequest(catalogoSchema),
  asyncErrorHandler(async (req: Request, res: Response) => {
    const model = await catalogoService.createCatalogo(req.body);
    new SuccessResponse('Catalogo creado', model).send(res);
  }),
);

/**
 * @openapi
 * /catalogos/{id}:
 *   put:
 *     summary: Actualizar un catálogo
 *     tags: [Catalogos]
 */
app.put(
  '/:id',
  validateRequest(catalogoSchema.partial()),
  asyncErrorHandler(async (req: Request, res: Response) => {
    const model = await catalogoService.updateCatalogo(Number(req.params.id), req.body);
    new SuccessResponse('Catalogo actualizado', model).send(res);
  }),
);

/**
 * @openapi
 * /catalogos/{id}:
 *   delete:
 *     summary: Eliminar un catálogo
 *     tags: [Catalogos]
 */
app.delete(
  '/:id',
  asyncErrorHandler(async (req: Request, res: Response) => {
    await catalogoService.deleteCatalogo(Number(req.params.id));
    new NoContentResponse('Catalogo eliminado').send(res);
  }),
);

// --- VALORES ---

/**
 * @openapi
 * /catalogos/valores/{idCatalogo}:
 *   get:
 *     summary: Obtener valores por ID de catálogo
 *     tags: [Catalogos]
 */
app.get(
  '/valores/:idCatalogo',
  asyncErrorHandler(async (req: Request, res: Response) => {
    const list = await catalogoValorService.getValoresByCatalogoId(Number(req.params.idCatalogo));
    new SuccessResponse('Valores obtenidos', list).send(res);
  }),
);

/**
 * @openapi
 * /catalogos/valores/clave/{clave}:
 *   get:
 *     summary: Obtener valores por clave de catálogo
 *     tags: [Catalogos]
 */
app.get(
  '/valores/clave/:clave',
  asyncErrorHandler(async (req: Request, res: Response) => {
    const { clave } = req.params;
    if (!clave) {
      throw new BadRequestError(ERROR_MESSAGES.CLAVES_REQUIRED);
    }
    const list = await catalogoValorService.getValoresByCatalogoClave(clave);
    new SuccessResponse(`Valores obtenidos para la clave ${clave}`, list).send(res);
  }),
);

/**
 * @openapi
 * /catalogos/valores:
 *   post:
 *     summary: Crear un valor de catálogo
 *     tags: [Catalogos]
 */
app.post(
  '/valores',
  validateRequest(catalogoValorSchema),
  asyncErrorHandler(async (req: Request, res: Response) => {
    const model = await catalogoValorService.createValor(req.body);
    new SuccessResponse('Valor creado', model).send(res);
  }),
);

/**
 * @openapi
 * /catalogos/valores/{id}:
 *   put:
 *     summary: Actualizar un valor de catálogo
 *     tags: [Catalogos]
 */
app.put(
  '/valores/:id',
  validateRequest(catalogoValorSchema.partial()),
  asyncErrorHandler(async (req: Request, res: Response) => {
    const model = await catalogoValorService.updateValor(Number(req.params.id), req.body);
    new SuccessResponse('Valor actualizado', model).send(res);
  }),
);

/**
 * @openapi
 * /catalogos/valores/{id}:
 *   delete:
 *     summary: Eliminar un valor de catálogo
 *     tags: [Catalogos]
 */
app.delete(
  '/valores/:id',
  asyncErrorHandler(async (req: Request, res: Response) => {
    await catalogoValorService.deleteValor(Number(req.params.id));
    new NoContentResponse('Valor eliminado').send(res);
  }),
);

export default app;
