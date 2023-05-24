import knex from '../config/database';
import { ExpectedError } from '../helpers/errors/expected.errors';
import { IExpenseDatabase, IExpenseOutput, IinputNewExpense, IinputUpdateExpense } from "../interfaces/interfaces";

export class ExpenseDatabase implements IExpenseDatabase {
    async newExpense({ expense, value }: IinputNewExpense): Promise<number[] | undefined> {
        const existingExpense = await knex.select('expense').from('expenses').where('expense', expense).first();
        if(existingExpense) throw new ExpectedError('expense-already-exists')
        const result = await knex('expenses').insert({ expense, value })
        return result;
    }

    async expenses(): Promise<IExpenseOutput[] | undefined> {
        const result: IExpenseOutput[] = await knex.select('*').from('expenses')
        return result;
    }

    async updateExpense({id, expense, value}: IinputUpdateExpense): Promise<number | undefined> {
        const result = await knex('expenses').update({
            expense, value
        }).where('id', id);
        if(!result) throw new ExpectedError('expense-not-found')
        return result;
    }

    async deleteExpense(id: string): Promise<number | undefined> {
        const result = await knex('expenses').delete().where('id', id);
        if(!result) throw new ExpectedError('expense-not-found')
        return result;
    }

    async updateIsPaid(id: string): Promise<number | undefined> {
        const consult = await knex.select('isPaid').from('expenses').where('id', id).first();
        if(!consult) throw new ExpectedError('expense-not-found')
        const value = consult.isPaid;
        const result = await knex('expenses').update({
            isPaid: !value
        }).where('id', id);
        return result;
    }
}