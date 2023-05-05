import { Request, Response } from "express";
import { IinputNewExpense } from "../interfaces/interfaces";

export function makeMiddleware(handlerFn: (expense: IinputNewExpense, id: string) => unknown) {
    return async (req: Request, res: Response) => {
        try {
            const result = await handlerFn(req.body, req.params.id)
            res.json(result)
        } catch (error) {
            res.json(error.message)
        }
    }
}
