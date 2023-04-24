import { IExpenseController, IExpenseOutput, IHttpsResponse, IinputNewExpense } from '../interfaces/interfaces';

export class ExpenseController implements IExpenseController {
    async newExpense(expense: IinputNewExpense): Promise<IHttpsResponse<IExpenseOutput>> {
        const expenses = expense;
        console.log(expenses);
        return {
            statusCode: 201,
            message: 'created',
            data: { id: 1 }
        }
    }
}