import { describe, vi, it, expect } from "vitest";
import { ExpenseController } from "../../controllers/expense.controller";

describe('Update the expense name and value by id', () => {
    it('should be able to update expense', async () => {
        const updateExpenseMock = vi.fn().mockResolvedValue([1]);
        const expenseController = new ExpenseController({updateExpense: updateExpenseMock} as any);
        const id = '1'
        const expense = {
            expense: 'teste',
            value: 1
        }
        await expect(expenseController.updateExpense(id, expense)).resolves.toEqual({
            statusCode: 200,
            message: 'Ok',
            data: [1]
        })
        expect(updateExpenseMock).toHaveBeenCalledOnce();
    })
})