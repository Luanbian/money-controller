import { IExpenseController, IExpenseDatabase, IExpenseOutput, IHttpsResponse, IinputNewExpense } from '../interfaces/interfaces';

export class ExpenseController implements IExpenseController {
    constructor(private readonly expenseDatabase: IExpenseDatabase) {}

    async newExpense(expense: IinputNewExpense): Promise<IHttpsResponse<IExpenseOutput>> {
        const expenses = await this.expenseDatabase.newExpense({
            expense: expense.expense,
            value: expense.value
        })
        return {
            statusCode: 201,
            message: 'created',
            data: { id: expenses }
        }
    }
}