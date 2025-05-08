import JWT from 'jsonwebtoken';
import { InternalError, BadTokenError, TokenExpiredError } from './ApiError';
import { logger } from '../loaders/logger';
import { jwt } from '../config'


/*
 * iss -> issuer 		-> emisor 			— Software organization who issues the token.
 * aud -> audience 		-> destinatario 	— Basically identity of the intended recipient of the token.
 * sub -> subject 		-> usuario 			— Intended user of the token.
 * prm -> param 		-> parametro 		— Random string to differentiate tokens.
 * iat -> issued at 	-> emitido en 		— Time at which the token was issued.
 * exp -> expiration 	-> vencimiento 	— Time after which the token is invalid (expiry time).
 */

export class JwtPayload {
    iss: string;
    aud: string;
    sub: string | number;
    prm: string;
    iat: number;
    exp: number;

    //  * validity -> validity-> validez — Time after which the token is invalid (expiry time).
    constructor(issuer: string, audience: string, subject: string | number, param: string) {
        this.iss = issuer;
        this.aud = audience;
        this.sub = subject;
        this.prm = param;
        this.iat = Math.floor(Date.now() / 1000);
        this.exp = this.iat + jwt.expiryTime;
    }
}



async function encode(payload: JwtPayload): Promise<string> {
    const cert = jwt.private
    if (!cert) throw new InternalError('Token generation failure');
    return JWT.sign({ ...payload }, cert, { algorithm: 'RS256' });
}

async function validate(token: string): Promise<JwtPayload> {
    const cert = jwt.public;
    try {
        return (await JWT.verify(token, cert)) as JwtPayload;
    } catch (e: any) {
        logger.debug(e);
        if (e?.name === 'TokenExpiredError') throw new TokenExpiredError();
        throw new BadTokenError();
    }
}

async function decode(token: string): Promise<JwtPayload> {
    const cert = jwt.private;
    try {
        return (await JWT.verify(token, cert, {
            ignoreExpiration: true,
        })) as JwtPayload;
    } catch (e) {
        logger.debug(e);
        throw new BadTokenError();
    }
}

export default {
    encode,
    validate,
    decode,
};
