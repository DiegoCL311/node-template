import * as catalogoRepository from '../repositories/catalogoRepository';
import { ICatalogo } from '../models/catalogo';
import { BadRequestError, NotFoundError } from '../core/ApiError';

/**
 * Lógica de negocio para obtener todos los catálogos.
 */
export const getAllCatalogos = async (): Promise<ICatalogo[]> => {
  return await catalogoRepository.obtenerTodosRepoCatalogos();
};

/**
 * Lógica de negocio para obtener un catálogo por ID.
 */
export const getCatalogoById = async (id: number): Promise<ICatalogo> => {
  const model = await catalogoRepository.obtenerRepoCatalogoById(id);
  if (!model) throw new NotFoundError('Catálogo no encontrado');
  return model;
};

/**
 * Lógica de negocio para crear un catálogo.
 */
export const createCatalogo = async (data: ICatalogo): Promise<ICatalogo> => {
  const existing = await catalogoRepository.obtenerRepoCatalogoByClave(data.cClave);
  if (existing) throw new BadRequestError(`La clave ${data.cClave} ya está en uso.`);

  return await catalogoRepository.crearRepoCatalogo(data);
};

/**
 * Lógica de negocio para actualizar un catálogo.
 */
export const updateCatalogo = async (id: number, data: Partial<ICatalogo>): Promise<ICatalogo> => {
  const model = await catalogoRepository.obtenerRepoCatalogoById(id);
  if (!model) throw new NotFoundError('Catálogo no encontrado');

  return await catalogoRepository.actualizarRepoCatalogo(id, data);
};

/**
 * Lógica de negocio para eliminar un catálogo.
 */
export const deleteCatalogo = async (id: number): Promise<void> => {
  const model = await catalogoRepository.obtenerRepoCatalogoById(id);
  if (!model) throw new NotFoundError('Catálogo no encontrado');

  await catalogoRepository.eliminarRepoCatalogo(id);
};
