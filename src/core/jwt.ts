import JWT from 'jsonwebtoken';
import { InternalError, BadTokenError, TokenExpiredError } from './ApiError';
import config from '../config';
/*
 * iss -> issuer 		-> emisor 			— Software organization who issues the token.
 * aud -> audience 		-> destinatario 	— Basically identity of the intended recipient of the token.
 * sub -> subject 		-> usuario 			— Intended user of the token.
 * prm -> param 		-> parametro 		— Random string to differentiate tokens.
 * iat -> issued at 	-> emitido en 		— Time at which the token was issued.
 * exp -> expiration 	-> vencimiento 	    — Time after which the token is invalid (expiry time).
 */

export class JwtPayload {
    iss: string;
    aud: string;
    sub: string;
    prm: string;
    iat: number;
    exp: number;

    constructor(issuer: string, audience: string, subject: string) {
        this.iss = issuer;
        this.aud = audience;
        this.sub = subject;
        this.prm = Math.random().toString(36).substring(7);
        this.iat = Math.floor(Date.now() / 1000);
        this.exp = this.iat + Number(config.jwt.expiryTime);
    }
}

async function encode(payload: JwtPayload): Promise<string> {
    const cert = config.jwt.private;
    if (!cert) throw new InternalError('Fallo al generar el token');
    return JWT.sign({ ...payload }, cert, { algorithm: 'RS256' });
}

async function validate(token: string): Promise<JwtPayload> {
    const cert = config.jwt.public;
    try {
        return (await JWT.verify(token, cert)) as JwtPayload;
    } catch (e: any) {
        if (e?.name === 'TokenExpiredError') throw new TokenExpiredError();
        throw new BadTokenError();
    }
}

async function decode(token: string): Promise<JwtPayload> {
    const cert = config.jwt.public;
    try {
        return (await JWT.verify(token, cert, {
            ignoreExpiration: true,
        })) as JwtPayload;
    } catch (e) {
        throw new BadTokenError();
    }
}

export default {
    encode,
    validate,
    decode,
};