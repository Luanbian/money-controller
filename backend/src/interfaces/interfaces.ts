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

export interface IHttpsResponse<T = any> {
  message?: string | any[];
  statusCode: number;
  data?: T;
}

export interface IExpenseOutput {
  id?: number[] | number;
}

export interface IExpenseController {
  newExpense(expense: IinputNewExpense): Promise<IHttpsResponse<IExpenseOutput>>;
}

export interface IGmailController {
  getTransaction(): Promise<Attributestype[]>
}

export interface IGmailGateway {
  getTransaction(auth: string): Promise<Attributestype[]>
}

export interface IExpenseDatabase {
  newExpense({ expense, value }: IinputNewExpense): Promise<number[] | undefined>;
}
