import * as UsuarioService from '../../../src/services/usuarioService';
import { NoEntryError } from '../../../src/core/ApiError';
import Usuario from '../../../src/models/usuario';

jest.mock('../../../src/models/usuario');

describe('Usuario Service', () => {
    const mockUserModel = {
        id: 1,
        nombre: 'John Doe',
        email: 'john@example.com',
        contrasena: 'securepassword',
        toJSON: function () { return mockUserJSON; }
    };

    const mockUserJSON = {
        id: 1,
        nombre: 'John Doe',
        email: 'john@example.com',
        contrasena: 'securepassword',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('encontrarUsuarioByEmail', () => {
        it('should return a user when found', async () => {
            Usuario.findOne = jest.fn().mockResolvedValue(mockUserModel);
            const user = await UsuarioService.encontrarUsuarioByEmail('john@example.com');
            expect(user).toEqual(mockUserJSON);
        });

        it('should return null when user is not found', async () => {
            Usuario.findOne = jest.fn().mockResolvedValue(null);
            const user = await UsuarioService.encontrarUsuarioByEmail('john@example.com');
            expect(user).toBeNull();
        });
    });

    describe('crearUsuario', () => {
        it('should create a user successfully', async () => {
            Usuario.create = jest.fn().mockResolvedValue(mockUserModel);
            const user = await UsuarioService.crearUsuario('John Doe', 'john@example.com', 'securepassword');
            expect(user).toEqual(mockUserJSON);
        });
    });

    describe('encontrarUsuarioByPk', () => {
        it('should return a user when found', async () => {
            Usuario.findByPk = jest.fn().mockResolvedValue(mockUserModel);
            const user = await UsuarioService.encontrarUsuarioByPk(1);
            expect(user).toEqual(mockUserJSON);
        });

        it('should return null when user is not found', async () => {
            Usuario.findByPk = jest.fn().mockResolvedValue(null);
            const user = await UsuarioService.encontrarUsuarioByPk(1);
            expect(user).toBeNull();
        });
    });

    describe('actualizarUsuario', () => {
        it('should update a user successfully', async () => {

            const janeDoeJson = {
                id: 1,
                nombre: 'Jane Doe',
                email: 'jane@example.com',
                contrasena: 'securepassword'
            };

            const janeDoeModel = {
                id: 1,
                nombre: 'Jane Doe',
                email: 'jane@example.com',
                contrasena: 'securepassword',
                toJSON: function () {
                    return janeDoeJson;
                }
            };

            Usuario.findByPk = jest.fn().mockResolvedValue({
                ...janeDoeModel,
                update: jest.fn().mockResolvedValue(janeDoeModel)
            });
            const user = await UsuarioService.actualizarUsuario(1, 'Jane Doe', 'jane@example.com');
            expect(user).toEqual(janeDoeJson);
        });

        it('should throw NoEntryError when user is not found', async () => {
            Usuario.findByPk = jest.fn().mockResolvedValue(null);
            await expect(UsuarioService.actualizarUsuario(1, 'Jane Doe', 'jane@example.com')).rejects.toThrow(NoEntryError);
        });
    });
});