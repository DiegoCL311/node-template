import { NoEntryError } from '../core/ApiError';
import Catalogo from '../database/models/catalogo';
import { type ICatalogo, type ICatalogoInput } from '../models/catalogo';

/**
 * Obtiene un catálogo por ID.
 */
export const obtenerRepoCatalogoById = async (
  nIdCatalogo: number,
): Promise<Readonly<ICatalogo> | null> => {
  const model = await Catalogo.findByPk(nIdCatalogo);
  return model ? model.toObj() : null;
};

/**
 * Obtiene un catálogo por Clave.
 */
export const obtenerRepoCatalogoByClave = async (
  cClave: string,
): Promise<Readonly<ICatalogo> | null> => {
  const model = await Catalogo.findOne({ where: { cClave } });
  return model ? model.toObj() : null;
};

/**
 * Crea un catálogo.
 */
export const crearRepoCatalogo = async (data: ICatalogoInput): Promise<Readonly<ICatalogo>> => {
  const model = await Catalogo.create(data);
  return model.toObj();
};

/**
 * Actualiza un catálogo.
 */
export const actualizarRepoCatalogo = async (
  nIdCatalogo: number,
  data: Partial<ICatalogoInput>,
): Promise<Readonly<ICatalogo>> => {
  const instancia = await Catalogo.findByPk(nIdCatalogo);
  if (!instancia) throw new NoEntryError('Catálogo no encontrado');
  await instancia.update(data);
  return instancia.toObj();
};

/**
 * Elimina un catálogo.
 */
export const eliminarRepoCatalogo = async (nIdCatalogo: number): Promise<void> => {
  const instancia = await Catalogo.findByPk(nIdCatalogo);
  if (!instancia) throw new NoEntryError('Catálogo no encontrado');
  await instancia.destroy();
};

/**
 * Obtiene todos los catálogos.
 */
export const obtenerTodosRepoCatalogos = async (): Promise<Readonly<ICatalogo>[]> => {
  const models = await Catalogo.findAll();
  return models.map((m) => m.toObj());
};
