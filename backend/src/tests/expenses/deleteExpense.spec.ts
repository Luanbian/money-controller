import { describe, it, vi, expect } from "vitest";
import { ExpenseController } from "../../controllers/expense.controller";

describe('Delete one expense', () => {
    it('should be able to delete one expense by id', async () => {
        const deleteExpenseMock = vi.fn().mockResolvedValue([1]);
        const expenseController = new ExpenseController({deleteExpense: deleteExpenseMock} as any);
        const id = '1';
        await expect(expenseController.deleteExpense(id)).resolves.toEqual({
            statusCode: 200,
            message: 'Ok',
            data: [1]
        })
        expect(deleteExpenseMock).toHaveBeenCalledOnce()
    })
})