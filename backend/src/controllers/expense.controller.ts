import { IExpenseController, IExpenseDatabase, IHelper, IHttpsResponse, IinputNewExpense } from '../interfaces/interfaces';

export class ExpenseController implements IExpenseController {
    constructor(
        private readonly expenseDatabase: IExpenseDatabase, 
        private readonly helper: IHelper
    ) {}

    async newExpense(expense: IinputNewExpense): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.newExpense({
            expense: expense.expense,
            value: expense.value
        })
        return this.helper.ok({ data: expenses })
    }

    async expenses(): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.expenses();
        return this.helper.ok({ data: expenses })
    }

    async updateExpense(id: string, expense: IinputNewExpense): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.updateExpense({
            id,
            expense: expense.expense,
            value: expense.value
        })
        return this.helper.ok({ data: expenses })
    }

    async deleteExpense(id: string): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.deleteExpense(id);
        return this.helper.ok({ data: expenses })
    }

    async updateIsPaid(id: string): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.updateIsPaid(id);
        return this.helper.ok({ data: expenses })
    }
}