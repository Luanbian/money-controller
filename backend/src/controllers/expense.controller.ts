import { HttpResponseSuccess } from '../helpers/success/success';
import { IExpenseController, IExpenseDatabase, IHttpsResponse, IinputNewExpense } from '../interfaces/interfaces';
import { z } from 'zod';

const expenseSchema = z.object({
    expense: z.string(),
    value: z.number()
})
const idSchema = z.string()

export class ExpenseController implements IExpenseController {
    constructor(private readonly expenseDatabase: IExpenseDatabase) {}

    public newExpense = async (expense: IinputNewExpense): Promise<IHttpsResponse> => {
        const expenses = expenseSchema.parse(expense)
        await this.expenseDatabase.newExpense(expenses)
        return HttpResponseSuccess.created({data: expenses })
    }

    public expenses = async (): Promise<IHttpsResponse> => {
        const expenses = await this.expenseDatabase.expenses();
        return HttpResponseSuccess.ok({data: expenses })
    }

    public updateExpense = async (expense: IinputNewExpense, id: string): Promise<IHttpsResponse> => {
        const expenseId = idSchema.parse(id)
        const expenses = expenseSchema.parse(expense)
        await this.expenseDatabase.updateExpense({
            id: expenseId,
            expense: expenses.expense,
            value: expenses.value
        })
        return HttpResponseSuccess.ok({data: expenses })
    }

    public deleteExpense = async (expense: IinputNewExpense, id: string): Promise<IHttpsResponse> => {
        const expenseId = idSchema.parse(id)
        await this.expenseDatabase.deleteExpense(expenseId);
        return HttpResponseSuccess.ok({data: expenseId })
    }

    public updateIsPaid = async (expense: IinputNewExpense, id: string): Promise<IHttpsResponse> => {
        const expenseId = idSchema.parse(id)
        await this.expenseDatabase.updateIsPaid(expenseId);
        return HttpResponseSuccess.ok({data: expenseId })
    }
}