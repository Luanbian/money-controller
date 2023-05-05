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

router.get('/history', async (req, res) => {
    const result = await gmailController.getTransaction();
    res.json(result);
});

router.post('/expense', makeMiddleware(expenseController.newExpense))
router.get('/expense', makeMiddleware(expenseController.expenses))

router.put('/expense/:id', async (req, res) => {
    const id = IdSchema.parse(req.params).id;
    const expense = ExpenseSchema.parse(req.body);
    const result = await expenseController.updateExpense(id, expense);
    res.json(result);
})
router.delete('/expense/:id', async (req, res) => {
    const id = IdSchema.parse(req.params).id;
    const result = await expenseController.deleteExpense(id);
    res.json(result);
})
router.put('/expense/:id/isPaid', async (req, res) => {
    const id = IdSchema.parse(req.params).id;
    const result = await expenseController.updateIsPaid(id);
    res.json(result);
})