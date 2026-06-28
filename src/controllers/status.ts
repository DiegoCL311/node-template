import express from 'express';

import { SuccessMsgResponse } from '../core/ApiResponse';

const router = express.Router();

/**
 * @openapi
 * /status:
 *   get:
 *     summary: Check service health
 *     responses:
 *       200:
 *         description: Success message indicating the service is up.
 */
router.get('/', (req, res) => {
  new SuccessMsgResponse('Service is up and running').send(res);
});

export default router;
