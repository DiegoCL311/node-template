import { ERROR_MESSAGES } from '../constants';
import { BadRequestError, NotFoundError } from '../core/ApiError';
import { ICatalogo, ICatalogoInput } from '../models/catalogo';
import * as catalogoRepository from '../repositories/catalogoRepository';

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
  if (!model) throw new NotFoundError(ERROR_MESSAGES.CATALOGO_NOT_FOUND);
  return model;
};

/**
 * Lógica de negocio para crear un catálogo.
 */
export const createCatalogo = async (data: ICatalogoInput): Promise<ICatalogo> => {
  const existing = await catalogoRepository.obtenerRepoCatalogoByClave(data.cClave);
  if (existing) throw new BadRequestError(ERROR_MESSAGES.CATALOGO_CLAVE_IN_USE(data.cClave));

  return await catalogoRepository.crearRepoCatalogo(data);
};

/**
 * Lógica de negocio para actualizar un catálogo.
 */
export const updateCatalogo = async (
  id: number,
  data: Partial<ICatalogoInput>,
): Promise<ICatalogo> => {
  const model = await catalogoRepository.obtenerRepoCatalogoById(id);
  if (!model) throw new NotFoundError(ERROR_MESSAGES.CATALOGO_NOT_FOUND);

  return await catalogoRepository.actualizarRepoCatalogo(id, data);
};

/**
 * Lógica de negocio para eliminar un catálogo.
 */
export const deleteCatalogo = async (id: number): Promise<void> => {
  const model = await catalogoRepository.obtenerRepoCatalogoById(id);
  if (!model) throw new NotFoundError(ERROR_MESSAGES.CATALOGO_NOT_FOUND);

  await catalogoRepository.eliminarRepoCatalogo(id);
};
