import { Router } from "express";
import { makeGmailController } from "../app/factories";

export const router = Router();
const gmailController = makeGmailController();

router.get('/history', async (req, res) => {
    const result = await gmailController.getTransaction();
    res.json(result);
});
