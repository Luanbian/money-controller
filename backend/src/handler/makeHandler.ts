import { Request, Response } from "express";
import { IinputNewExpense } from "../interfaces/interfaces";
import { ExpectedError } from "../helpers/errors/expected.errors";
import { ZodError } from "zod";

export function makeHandler(handlerFn: (expense: IinputNewExpense, id: string) => unknown) {
    return async (req: Request, res: Response) => {
        try {
            const result = await handlerFn(req.body, req.params.id)
            res.json(result)
        } catch (error) {
            const language = req.headers["accept-language"] || 'pt-BR'
            const fileImported = await import(`../locales/${language}`)
            if(error instanceof ExpectedError) {
                return res.status(400).json({messages: fileImported[error.message]})
            }
            if(error instanceof ZodError) {
                return res.status(404).json({message: error.errors})
            }
            return res.status(500).json({messages: fileImported["internal-server-error"]})
        }
    }
}
