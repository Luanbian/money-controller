import knex from '../config/database';
import { IExpenseDatabase, IExpenseOutput, IinputNewExpense, IinputUpdateExpense } from "../interfaces/interfaces";

export class ExpenseDatabase implements IExpenseDatabase {
    async newExpense({ expense, value }: IinputNewExpense): Promise<number[] | undefined> {
        try {
            const result = await knex('expenses').insert({
                expense, value
            })
            return result;
        } catch (error) {
            return error;
        }
    }

    async expenses(): Promise<IExpenseOutput | undefined> {
        try {
            const result: IExpenseOutput = await knex.select('*').from('expenses')
            return result;
        } catch (error) {
            return error;
        }
    }

    async updateExpense({id, expense, value}: IinputUpdateExpense): Promise<number | undefined> {
        try {
            const result = await knex('expenses').update({
                expense, value
            }).where('id', id);
            return result;
        } catch (error) {
            return error;
        }
    }

    async deleteExpense(id: string): Promise<number | undefined> {
        try {
            const result = await knex('expenses').delete().where('id', id);
            return result;
        } catch (error) {
            return error;
        }
    }

    async updateIsPaid(id: string): Promise<number | undefined> {
        try {
            const consult = await knex.select('isPaid').from('expenses').where('id', id);
            const value = consult[0].isPaid;
            const result = await knex('expenses').update({
                isPaid: !value
            }).where('id', id);
            return result;
        } catch (error) {
            return error;
        }
    }
}