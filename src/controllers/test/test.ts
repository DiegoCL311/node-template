import { Request, Response } from 'express';
import { SuccessMsgResponse } from '../../core/ApiResponse';

const test = async (req: Request, res: Response) => {
    new SuccessMsgResponse(res, "Respuesta de prueba!");
}

export default { test }