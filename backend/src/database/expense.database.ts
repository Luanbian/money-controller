import knex from '../config/database';
import { IExpenseDatabase, IExpenseOutput, IinputNewExpense } from "../interfaces/interfaces";

export class ExpenseDatabase implements IExpenseDatabase {
    async newExpense({ expense, value }: IinputNewExpense): Promise<number[] | undefined> {
        try {
            const result = await knex('expenses').insert({
                expense, value
            })
            return result;
        } catch (error) {
            Promise.reject(new Error(error));
        }
    }

    async expenses(): Promise<IExpenseOutput | undefined> {
        try {
            const result: IExpenseOutput = await knex.select('*').from('expenses')
            return result;
        } catch (error) {
            Promise.reject(new Error(error));
        }
    }
}