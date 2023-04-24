import knex from '../config/database';
import { IExpenseDatabase, IinputNewExpense } from "../interfaces/interfaces";

export class ExpenseDatabase implements IExpenseDatabase {
    async newExpense({ text, value }: IinputNewExpense): Promise<number[] | undefined> {
        try {
            const result = await knex('expenses').insert({
                text, value
            })
            return result;
        } catch (error) {
            Promise.reject(new Error(error));
        }
    }
}