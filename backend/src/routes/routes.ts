import { Router } from "express";
import { makeGmailController, makeExpenseController } from "../app/factories";
import { z } from 'zod';

export const router = Router();
const gmailController = makeGmailController();
const expenseController = makeExpenseController();

const ExpenseSchema = z.object({
    text: z.string(),
    value: z.number()
})

router.get('/history', async (req, res) => {
    const result = await gmailController.getTransaction();
    res.json(result);
});

router.post('/expense', async (req, res) => {
    const expense = ExpenseSchema.parse(req.body);
    const result = await expenseController.newExpense(expense);
    res.json(result);
})
