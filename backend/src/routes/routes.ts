import { Router } from "express";
import { makeGmailController, makeExpenseController } from "../app/factories";
import { makeMiddleware } from "../middleware/makeMiddleware";

export const router = Router();
const gmailController = makeGmailController();
const expenseController = makeExpenseController();

router.get('/history', makeMiddleware(gmailController.getTransaction));
router.post('/expense', makeMiddleware(expenseController.newExpense))
router.get('/expense', makeMiddleware(expenseController.expenses))
router.put('/expense/:id', makeMiddleware(expenseController.updateExpense))
router.delete('/expense/:id', makeMiddleware(expenseController.deleteExpense))
router.put('/expense/:id/isPaid', makeMiddleware(expenseController.updateIsPaid))