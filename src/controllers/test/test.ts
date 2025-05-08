import { Request, Response } from 'express';
import { SuccessMsgResponse } from '../../core/ApiResponse';

const test = async (req: Request, res: Response) => {
    new SuccessMsgResponse("Respuesta de prueba!").send(res);
}

export default { test }