import { describe, it, vi, expect } from "vitest";
import { ExpenseController } from "../../controllers/expense.controller";

describe('list os expenses', () => {
    it('should be able to list my expenses', async () => {
        const listExpensesMock = vi.fn().mockResolvedValue([1]);
        const expenseController = new ExpenseController({expenses: listExpensesMock} as any);
        await expect(expenseController.expenses()).resolves.toEqual({
            statusCode: 200,
            message: 'Ok',
            data: [1]
        })
        expect(listExpensesMock).toHaveBeenCalledOnce()
    });
})