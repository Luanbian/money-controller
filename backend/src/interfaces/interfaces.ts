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

export interface IHttpsResponse {
  message?: string | any[];
  statusCode: number;
}

export interface IExpenseOutput {
  id: number, 
  expense: string, 
  value: number, 
  isPaid: boolean
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
}

export interface IExpenseDatabase {
  newExpense({ expense, value }: IinputNewExpense): Promise<number[] | undefined>;
  expenses(): Promise<IExpenseOutput | undefined>;
}
