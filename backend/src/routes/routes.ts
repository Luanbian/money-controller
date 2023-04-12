import { Router } from "express";
import { makeGmailController } from "../app/factories";

export const router = Router();
const gmailController = makeGmailController();

router.get('/', async (req, res) => {
    const result = await gmailController.getAtributes();
    res.json(result);
});
