import { describe, it, expect, vi } from "vitest";
import { ExpenseController } from "../../controllers/expense.controller";

describe('Update the status of paid expense', () => {
    it('should be able to update Paid status', async () => {
        const updateIsPaidMock = vi.fn().mockResolvedValue([1]);
        const expenseController = new ExpenseController({updateIsPaid: updateIsPaidMock} as any);
        const id = '1';
        await expect(expenseController.updateIsPaid(id)).resolves.toEqual({
            statusCode: 200,
            message: 'Ok',
            data: [1]
        })
        expect(updateIsPaidMock).toHaveBeenCalledOnce();
    })
})