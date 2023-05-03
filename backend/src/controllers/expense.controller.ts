import { IExpenseController, IExpenseDatabase, IHttpsResponse, IinputNewExpense } from '../interfaces/interfaces';
import { HttpResponseHelper } from '../helpers/helper';
export class ExpenseController implements IExpenseController {
    constructor(private readonly expenseDatabase: IExpenseDatabase) {}

    async newExpense(expense: IinputNewExpense): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.newExpense({
            expense: expense.expense,
            value: expense.value
        })
        return HttpResponseHelper.ok({data : expenses })
    }

    async expenses(): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.expenses();
        return HttpResponseHelper.ok({data : expenses })
    }

    async updateExpense(id: string, expense: IinputNewExpense): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.updateExpense({
            id,
            expense: expense.expense,
            value: expense.value
        })
        return HttpResponseHelper.ok({data : expenses })
    }

    async deleteExpense(id: string): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.deleteExpense(id);
        return HttpResponseHelper.ok({data : expenses })
    }

    async updateIsPaid(id: string): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.updateIsPaid(id);
        return HttpResponseHelper.ok({data : expenses })
    }
}