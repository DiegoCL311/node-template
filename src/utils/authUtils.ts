import { AuthFailureError, InternalError } from '../core/ApiError';
import JWT, { JwtPayload } from '../core/jwt';
import { IUsuario } from '../models/usuario';
import { jwt } from '../config';

interface Tokens {
	accessToken: string;
	refreshToken: string;
}

export const getAccessToken = (authorization?: string) => {
	if (!authorization) throw new AuthFailureError('Invalid authentication');
	if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization');
	return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
	if (!payload || !payload.iss || !payload.sub || !payload.aud || !payload.prm || payload.iss !== jwt.issuer || payload.aud !== jwt.audience || !payload.sub) throw new AuthFailureError('Invalid Token (Incomplete)');
	return true;
};

export const createTokens = async (user: IUsuario, accessTokenKey: string, refreshTokenKey: string): Promise<Tokens> => {
	const accessToken = await JWT.encode(new JwtPayload(/* issuer */ jwt.issuer, /* audience */ jwt.audience, /* subject */ user.nUsuario, /* param */ accessTokenKey, /* validity */));

	if (!accessToken) throw new InternalError();

	const refreshToken = await JWT.encode(new JwtPayload(/* issuer */ jwt.issuer, /* audience */ jwt.audience, /* subject */ user.nUsuario, /* param */ refreshTokenKey, /* validity */));

	if (!refreshToken) throw new InternalError();

	return {
		accessToken: accessToken,
		refreshToken: refreshToken,
	} as Tokens;
};

export const createAccessToken = async (user: IUsuario, accessTokenKey: string): Promise<string> => {
	return await JWT.encode(new JwtPayload(jwt.issuer, jwt.audience, user.nUsuario, accessTokenKey));
};
