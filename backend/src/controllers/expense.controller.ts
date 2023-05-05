import { HttpResponseSuccess } from '../helpers/success/success';
import { IExpenseController, IExpenseDatabase, IHttpsResponse, IinputNewExpense } from '../interfaces/interfaces';
export class ExpenseController implements IExpenseController {
    constructor(private readonly expenseDatabase: IExpenseDatabase) {}

    public newExpense = async (expense: IinputNewExpense): Promise<IHttpsResponse> => {
        const expenses = await this.expenseDatabase.newExpense({
            expense: expense.expense,
            value: expense.value
        })
        return HttpResponseSuccess.created({data : expenses })
    }

    public expenses = async (): Promise<IHttpsResponse> => {
        const expenses = await this.expenseDatabase.expenses();
        return HttpResponseSuccess.ok({data : expenses })
    }

    public updateExpense = async (expense: IinputNewExpense, id: string): Promise<IHttpsResponse> => {
        const expenses = await this.expenseDatabase.updateExpense({
            id,
            expense: expense.expense,
            value: expense.value
        })
        return HttpResponseSuccess.ok({data : expenses })
    }

    async deleteExpense(id: string): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.deleteExpense(id);
        return HttpResponseSuccess.ok({data : expenses })
    }

    async updateIsPaid(id: string): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.updateIsPaid(id);
        return HttpResponseSuccess.ok({data : expenses })
    }
}