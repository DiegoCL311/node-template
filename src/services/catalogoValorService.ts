import * as catalogoValorRepository from '../repositories/catalogoValorRepository';
import { ICatalogoValor } from '../models/catalogoValor';
import { NotFoundError } from '../core/ApiError';

/**
 * Lógica de negocio para obtener todos los valores.
 */
export const getValoresByCatalogoId = async (idCatalogo: number): Promise<ICatalogoValor[]> => {
  return await catalogoValorRepository.obtenerValoresPorCatalogoId(idCatalogo);
};

/**
 * Lógica de negocio para obtener valores por clave de catálogo.
 */
export const getValoresByCatalogoClave = async (clave: string): Promise<ICatalogoValor[]> => {
  return await catalogoValorRepository.obtenerValoresPorCatalogoClave(clave);
};

/**
 * Lógica de negocio para crear un valor.
 */
export const createValor = async (data: ICatalogoValor): Promise<ICatalogoValor> => {
  return await catalogoValorRepository.crearRepoValor(data);
};

/**
 * Lógica de negocio para actualizar un valor.
 */
export const updateValor = async (id: number, data: Partial<ICatalogoValor>): Promise<ICatalogoValor> => {
  const model = await catalogoValorRepository.obtenerRepoValorById(id);
  if (!model) throw new NotFoundError('Valor no encontrado');

  return await catalogoValorRepository.actualizarRepoValor(id, data);
};

/**
 * Lógica de negocio para eliminar un valor.
 */
export const deleteValor = async (id: number): Promise<void> => {
  const model = await catalogoValorRepository.obtenerRepoValorById(id);
  if (!model) throw new NotFoundError('Valor no encontrado');

  await catalogoValorRepository.eliminarRepoValor(id);
};
/**
 * Lógica de negocio para obtener múltiples catálogos en una sola petición.
 * Regresa un arreglo de arreglos en el mismo orden que las claves recibidas.
 */
export const getMultipleValoresByClaves = async (claves: string[]): Promise<ICatalogoValor[][]> => {
  const promises = claves.map(clave => catalogoValorRepository.obtenerValoresPorCatalogoClave(clave));
  return await Promise.all(promises);
};
