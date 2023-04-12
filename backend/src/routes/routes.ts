import { Router } from "express";
import { makeGmailController } from "../app/factories";

export const router = Router();
const gmailController = makeGmailController();

router.get('/', () => {gmailController.setMessages()});