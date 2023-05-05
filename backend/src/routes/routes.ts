import { Router } from "express";
import { makeGmailController, makeExpenseController } from "../app/factories";
import { makeHandler } from "../handler/makeHandler";

export const router = Router();
const gmailController = makeGmailController();
const expenseController = makeExpenseController();

router.get('/history', makeHandler(gmailController.getTransaction));
router.post('/expense', makeHandler(expenseController.newExpense))
router.get('/expense', makeHandler(expenseController.expenses))
router.put('/expense/:id', makeHandler(expenseController.updateExpense))
router.delete('/expense/:id', makeHandler(expenseController.deleteExpense))
router.put('/expense/:id/isPaid', makeHandler(expenseController.updateIsPaid))