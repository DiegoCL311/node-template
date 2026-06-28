import { BadRequestError, NotFoundError } from '../../../src/core/ApiError';
import { IUsuario, IDataUsuario } from '../../../src/models/usuario';
import * as usuarioRepository from '../../../src/repositories/usuarioRepository';
import * as usuarioService from '../../../src/services/usuarioService';

jest.mock('../../../src/repositories/usuarioRepository', () => ({
  obtenerTodosLosUsuarios: jest.fn(),
  obtenerUsuarioByPk: jest.fn(),
  obtenerUsuarioFullByUsuario: jest.fn(),
  obtenerUsuarioFullById: jest.fn(),
  crearUsuario: jest.fn(),
  actualizarUsuario: jest.fn(),
  eliminarUsuario: jest.fn(),
}));

const mockedRepo = usuarioRepository as jest.Mocked<typeof usuarioRepository>;

describe('Usuario Service', () => {
  const mockUser: IUsuario = {
    nUsuario: 1,
    nRol: 1,
    nEstatus: 1,
    cNombres: 'John',
    cApellidos: 'Doe',
    cUsuario: 'johndoe',
  };

  const mockUserData: IDataUsuario = {
    nRol: 1,
    cNombres: 'John',
    cApellidos: 'Doe',
    cUsuario: 'johndoe',
    cPassword: 'securepassword',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAllUsers', () => {
    it('should return an array of users', async () => {
      mockedRepo.obtenerTodosLosUsuarios.mockResolvedValue([mockUser]);

      const users = await usuarioService.fetchAllUsers();

      expect(users).toEqual([mockUser]);
      expect(mockedRepo.obtenerTodosLosUsuarios).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no users exist', async () => {
      mockedRepo.obtenerTodosLosUsuarios.mockResolvedValue([]);

      const users = await usuarioService.fetchAllUsers();

      expect(users).toEqual([]);
    });
  });

  describe('fetchUserByPk', () => {
    it('should return a user when found', async () => {
      mockedRepo.obtenerUsuarioByPk.mockResolvedValue(mockUser);

      const user = await usuarioService.fetchUserByPk(1);

      expect(user).toEqual(mockUser);
      expect(mockedRepo.obtenerUsuarioByPk).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when user is not found', async () => {
      mockedRepo.obtenerUsuarioByPk.mockResolvedValue(null);

      await expect(usuarioService.fetchUserByPk(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('registerNewUser', () => {
    it('should create a user when cUsuario is not taken', async () => {
      mockedRepo.obtenerUsuarioFullByUsuario.mockResolvedValue(null);
      mockedRepo.crearUsuario.mockResolvedValue(mockUser);

      const result = await usuarioService.registerNewUser(mockUserData);

      expect(result).toEqual(mockUser);
      expect(mockedRepo.obtenerUsuarioFullByUsuario).toHaveBeenCalledWith(mockUserData.cUsuario);
      expect(mockedRepo.crearUsuario).toHaveBeenCalledWith(mockUserData);
    });

    it('should throw BadRequestError when cUsuario already exists', async () => {
      mockedRepo.obtenerUsuarioFullByUsuario.mockResolvedValue({
        ...mockUser,
        cPassword: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(usuarioService.registerNewUser(mockUserData)).rejects.toThrow(BadRequestError);
      expect(mockedRepo.crearUsuario).not.toHaveBeenCalled();
    });
  });

  describe('modifyUser', () => {
    it('should update a user when it exists', async () => {
      mockedRepo.obtenerUsuarioByPk.mockResolvedValue(mockUser);
      mockedRepo.actualizarUsuario.mockResolvedValue(mockUser);

      const result = await usuarioService.modifyUser(1, { cNombres: 'Jane' });

      expect(result).toEqual(mockUser);
      expect(mockedRepo.obtenerUsuarioByPk).toHaveBeenCalledWith(1);
      expect(mockedRepo.actualizarUsuario).toHaveBeenCalledWith(1, { cNombres: 'Jane' });
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockedRepo.obtenerUsuarioByPk.mockResolvedValue(null);

      await expect(usuarioService.modifyUser(999, { cNombres: 'Jane' })).rejects.toThrow(
        NotFoundError,
      );
      expect(mockedRepo.actualizarUsuario).not.toHaveBeenCalled();
    });
  });

  describe('removeUser', () => {
    it('should remove a user when it exists', async () => {
      mockedRepo.obtenerUsuarioByPk.mockResolvedValue(mockUser);
      mockedRepo.eliminarUsuario.mockResolvedValue(undefined);

      await usuarioService.removeUser(1);

      expect(mockedRepo.obtenerUsuarioByPk).toHaveBeenCalledWith(1);
      expect(mockedRepo.eliminarUsuario).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockedRepo.obtenerUsuarioByPk.mockResolvedValue(null);

      await expect(usuarioService.removeUser(999)).rejects.toThrow(NotFoundError);
      expect(mockedRepo.eliminarUsuario).not.toHaveBeenCalled();
    });
  });
});
