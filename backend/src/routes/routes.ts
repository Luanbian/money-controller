import { Router } from "express";
import { makeGmailController, makeExpenseController } from "../app/factories";
import { z } from 'zod';
import { makeMiddleware } from "../middleware/makeMiddleware";

export const router = Router();
const gmailController = makeGmailController();
const expenseController = makeExpenseController();

const ExpenseSchema = z.object({
    expense: z.string(),
    value: z.number()
});
const IdSchema = z.object({
    id: z.string(),
});

router.get('/history', makeMiddleware(gmailController.getTransaction));
router.post('/expense', makeMiddleware(expenseController.newExpense))
router.get('/expense', makeMiddleware(expenseController.expenses))
router.put('/expense/:id', makeMiddleware(expenseController.updateExpense))
router.delete('/expense/:id', makeMiddleware(expenseController.deleteExpense))
router.put('/expense/:id/isPaid', makeMiddleware(expenseController.updateIsPaid))