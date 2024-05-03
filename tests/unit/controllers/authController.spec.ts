import request from 'supertest';
import app from '../../../src/app';
import loaders from '../../../src/loaders';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

describe('Auth Controller', () => {
    let user: any;

    beforeAll(async () => {
        await loaders.init({ expressApp: app });
    });

    it('should return an error when logging in with an empty body', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', "email is required, contrasena is required");

    });

    it('should successfully register with valid email and password', async () => {
        const email = faker.internet.email();
        const contrasena = faker.internet.password();

        user = {
            nombre: 'testuser',
            email: email,
            contrasena: contrasena,
        };

        const response = await request(app)
            .post('/api/auth/register')
            .send(user);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Registro exitoso');
    });

    it('should return a valid token when logging in with valid credentials', async () => {

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: user.email, contrasena: user.contrasena });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Inicio de sesion exitoso');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('accessToken');
    });


    it('should return an error when logging in with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testing2@testing1.com',
                contrasena: '22222222222275f6tuyibinj',
            });

        expect(response.status).toBe(400);
        expect(response).toHaveProperty('error');
        expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    });

    it('should return an error when registering with an invalid email, contrasena, nombre', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                nombre: '',
                email: '',
                contrasena: '',
            });

        expect(response.status).toBe(400);
        expect(response).toHaveProperty('error');
        expect(response.body).toHaveProperty('message', 'email is not allowed to be empty, contrasena is not allowed to be empty, nombre is not allowed to be empty');

    });

    it('should return an error when registering with an invalid email', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                nombre: 'testuser',
                email: 'con.bo7b87@.mx',
                contrasena: 'testpassword',
            });

        expect(response.status).toBe(400);
        expect(response).toHaveProperty('error');
        expect(response.body).toHaveProperty('message', 'email must be a valid email');
    });

    it('should return an error when registering with an invalid contrasena', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                nombre: 'testuser',
                email: 'testing@testing.com',
                contrasena: '',
            });

        expect(response.status).toBe(400);
        expect(response).toHaveProperty('error');
        expect(response.body).toHaveProperty('message', 'contrasena is not allowed to be empty');
    });

    it('should return an error when registering with a valid email and invalid contrasena', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'testing@testing.com',
                contrasena: '0',
            });

        expect(response.status).toBe(400);
        expect(response).toHaveProperty('error');
    });

    it('should return an error when registering with a valid email and contrasena that is too short', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                nombre: 'testuser',
                email: 'testuser@testing.com',
                contrasena: 'shrt',
            });

        expect(response.status).toBe(400);
        expect(response).toHaveProperty('error');
        expect(response.body).toHaveProperty('message', 'contrasena length must be at least 6 characters long');
    });
});
