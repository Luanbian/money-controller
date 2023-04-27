export interface Attributestype {
  bank: string;
  date: string;
  value: number;
}

export type EmailType = {
  headers: { 
    name?: string | null | undefined; 
    value?: string | null | undefined; 
  }[] | null | undefined;
  id: string;
  body: {
    data: string
  }
}

interface GmailGetMethod {
  data: {
    payload: {
      headers?: { name?: string | null; value?: string | null }[] | null;
      body: {
        data: string
      }
    },
    id: string
  }
}
export interface GoogleGmailAdapter {
  users: {
    messages: {
      get(props: { userId: string; id: string, format: string}): Promise<GmailGetMethod>;
      list(props: {userId: string; q: string}): Promise<{data: {messages: { id: string }[]}}>;
    }
  }
}

export interface GoogleAdapter {
  gmail: (props: {version: 'v1'; auth: string}) => GoogleGmailAdapter;
}

export interface IinputNewExpense {
  expense: string,
  value: number
}

export interface IinputUpdateExpense {
  id: string,
  expense: string,
  value: number
}

export interface IHttpsResponse {
  message?: string;
  statusCode?: number;
  data?: number[] | IExpenseOutput | number
}

export interface IExpenseOutput {
  id: number, 
  expense: string, 
  value: number, 
  isPaid: boolean
}

export interface IHelper {
  ok({ statusCode, data, message }: IHttpsResponse): IHttpsResponse
}

export interface IGmailController {
  getTransaction(): Promise<Attributestype[]>
}

export interface IGmailGateway {
  getTransaction(auth: string): Promise<Attributestype[]>
}
export interface IExpenseController {
  newExpense(expense: IinputNewExpense): Promise<IHttpsResponse>;
  expenses(): Promise<IHttpsResponse>;
  updateExpense(id: string, expense: IinputNewExpense): Promise<IHttpsResponse>;
  deleteExpense(id: string): Promise<IHttpsResponse>;
  updateIsPaid(id: string): Promise<IHttpsResponse>;
}

export interface IExpenseDatabase {
  newExpense({ expense, value }: IinputNewExpense): Promise<number[] | undefined>;
  expenses(): Promise<IExpenseOutput | undefined>;
  updateExpense({id, expense, value}: IinputUpdateExpense): Promise<number | undefined>;
  deleteExpense(id: string): Promise<number | undefined>;
  updateIsPaid(id: string): Promise<number | undefined>;
}
