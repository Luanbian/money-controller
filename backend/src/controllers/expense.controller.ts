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
        const listExpenses = await this.expenseDatabase.expenses();
        return {
            statusCode: 200,
            message: 'Ok',
            data: listExpenses
        }
    }
}