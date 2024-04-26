import { AuthFailureError, InternalError } from '../core/ApiError';
import JWT, { JwtPayload } from '../core/jwt';
import { IUsuario } from '../models/usuario';
import config from '../config';

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export const getAccessToken = (authorization?: string) => {
    if (!authorization || !authorization.startsWith('Bearer '))
        throw new AuthFailureError('Token faltante / invalido');
    return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
    if (!payload || !payload.iss || !payload.sub || !payload.aud || !payload.prm || payload.iss !== config.jwt.issuer || payload.aud !== config.jwt.audience)
        throw new AuthFailureError('Token invalido');

    return true;
};

export const createTokens = async (usuario: IUsuario): Promise<Tokens> => {
    const accessToken = await JWT.encode(new JwtPayload(/* issuer */ config.jwt.issuer, /* audience */ config.jwt.audience, /* subject */ usuario.id?.toString() || "0"));

    if (!accessToken) throw new InternalError();

    const refreshToken = await JWT.encode(new JwtPayload(/* issuer */ config.jwt.issuer, /* audience */ config.jwt.audience, /* subject */ usuario.id?.toString() || "0"));

    if (!refreshToken) throw new InternalError();

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    } as Tokens;
};

export const createAccessToken = async (usuario: IUsuario): Promise<string> => {
    return await JWT.encode(new JwtPayload(config.jwt.issuer, config.jwt.audience, usuario.id?.toString() || "0"));
};