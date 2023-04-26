import { describe, expect, it, vi } from "vitest";
import { ExpenseController } from "../../controllers/expense.controller";

describe('Create a new expense', () => {
    it('should be able to create a new expense', async () => {
        const expenseMock = vi.fn().mockResolvedValue([1]);
        const expenseController = new ExpenseController({newExpense: expenseMock} as any)
        const input = {
            expense: 'Teste',
            value: 1
        };
        await expect(expenseController.newExpense(input)).resolves.toEqual({
            statusCode: 201,
            message: 'created',
            data: [ 1 ]
        });
        expect(expenseMock).toHaveBeenCalledOnce();
        expect(expenseMock).toHaveBeenCalledWith(input);
    })
})