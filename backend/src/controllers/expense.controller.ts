import { IExpenseController, IExpenseDatabase, IHttpsResponse, IinputNewExpense } from '../interfaces/interfaces';

export class ExpenseController implements IExpenseController {
    constructor(private readonly expenseDatabase: IExpenseDatabase) {}

    async newExpense(expense: IinputNewExpense): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.newExpense({
            expense: expense.expense,
            value: expense.value
        })
        return {
            statusCode: 201,
            message: 'created',
            data: expenses
        }
    }

    async expenses(): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.expenses();
        return {
            statusCode: 200,
            message: 'Ok',
            data: expenses
        }
    }

    async updateExpense(id: string, expense: IinputNewExpense): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.updateExpense({
            id,
            expense: expense.expense,
            value: expense.value
        })
        return {
            statusCode: 200,
            message: 'updated',
            data: expenses
        }
    }

    async deleteExpense(id: string): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.deleteExpense(id);
        return {
            statusCode: 200,
            message: 'deleted',
            data: expenses
        }
    }

    async updateIsPaid(id: string): Promise<IHttpsResponse> {
        const expenses = await this.expenseDatabase.updateIsPaid(id);
        return {
            statusCode: 200,
            message: 'Updated isPaid',
            data: expenses
        }
    }
}