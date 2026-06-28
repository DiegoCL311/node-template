import { NoEntryError } from '../core/ApiError';
import Catalogo from '../database/models/catalogo';
import CatalogoValor from '../database/models/catalogoValor';
import { type ICatalogoValor, type ICatalogoValorInput } from '../models/catalogoValor';

/**
 * Obtiene un valor por ID.
 */
export const obtenerRepoValorById = async (
  nIdCatalogoValor: number,
): Promise<Readonly<ICatalogoValor> | null> => {
  const model = await CatalogoValor.findByPk(nIdCatalogoValor);
  return model ? model.toObj() : null;
};

/**
 * Crea un valor de catálogo.
 */
export const crearRepoValor = async (
  data: ICatalogoValorInput,
): Promise<Readonly<ICatalogoValor>> => {
  const model = await CatalogoValor.create(data);
  return model.toObj();
};

/**
 * Actualiza un valor.
 */
export const actualizarRepoValor = async (
  nIdCatalogoValor: number,
  data: Partial<ICatalogoValorInput>,
): Promise<Readonly<ICatalogoValor>> => {
  const instancia = await CatalogoValor.findByPk(nIdCatalogoValor);
  if (!instancia) throw new NoEntryError('Valor no encontrado');
  await instancia.update(data);
  return instancia.toObj();
};

/**
 * Elimina un valor.
 */
export const eliminarRepoValor = async (nIdCatalogoValor: number): Promise<void> => {
  const instancia = await CatalogoValor.findByPk(nIdCatalogoValor);
  if (!instancia) throw new NoEntryError('Valor no encontrado');
  await instancia.destroy();
};

/**
 * Obtiene todos los valores de un catálogo por el ID del catálogo.
 */
export const obtenerValoresPorCatalogoId = async (
  nIdCatalogo: number,
): Promise<Readonly<ICatalogoValor>[]> => {
  const models = await CatalogoValor.findAll({
    where: { nIdCatalogo },
    order: [['nOrden', 'ASC']],
  });
  return models.map((m) => m.toObj());
};

/**
 * Obtiene todos los valores de un catálogo por su clave.
 */
export const obtenerValoresPorCatalogoClave = async (
  cClave: string,
): Promise<Readonly<ICatalogoValor>[]> => {
  const models = await CatalogoValor.findAll({
    include: [
      {
        model: Catalogo,
        where: { cClave },
        attributes: [],
      },
    ],
    order: [['nOrden', 'ASC']],
  });
  return models.map((m) => m.toObj());
};
