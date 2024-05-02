import { getAccessToken, validateTokenData, createTokens, createAccessToken } from '../../../src/utils/utils';
import { AuthFailureError, InternalError } from '../../../src/core/ApiError';
import JWT from '../../../src/core/jwt';
import config from '../../../src/config';

// Mocking JWT encode function 
jest.mock('../../../src/core/jwt', () => ({
    encode: jest.fn().mockImplementation((payload) => Promise.resolve('mockedToken')),
    validate: jest.fn().mockImplementation((token) => Promise.resolve({ iss: config.jwt.issuer, sub: '123', aud: config.jwt.audience, prm: 'random_param', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + Number(Number(config.jwt.expiryTime)) })),
    decode: jest.fn().mockImplementation((token) => Promise.resolve({ iss: config.jwt.issuer, sub: '123', aud: config.jwt.audience, prm: 'random_param', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + Number(Number(config.jwt.expiryTime)) })),
}));


describe('Utils Tests', () => {

    describe('getAccessToken', () => {
        it('should return access token from authorization header', () => {
            const accessToken = getAccessToken('Bearer mockedToken');
            expect(accessToken).toBe('mockedToken');
        });

        it('should throw AuthFailureError when authorization header is missing or invalid', () => {
            expect(() => {
                getAccessToken('');
            }).toThrow(AuthFailureError);
            expect(() => {
                getAccessToken('InvalidToken');
            }).toThrow(AuthFailureError);
        });
    });

    describe('validateTokenData', () => {
        it('should validate token data successfully', () => {
            const payload = {
                iss: config.jwt.issuer,
                sub: '123',
                aud: config.jwt.audience,
                prm: 'random_param',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + Number(config.jwt.expiryTime),
            };
            const result = validateTokenData(payload);
            expect(result).toBe(true);
        });

        it('should throw AuthFailureError when token data is invalid', () => {
            const invalidPayload = {
                iss: 'invalid_issuer',
                sub: '123',
                aud: config.jwt.audience,
                prm: 'random_param',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + Number(config.jwt.expiryTime),
            };
            expect(() => {
                validateTokenData(invalidPayload);
            }).toThrow(AuthFailureError);
        });
    });

});
