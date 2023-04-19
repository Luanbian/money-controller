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

export interface outputRelate {
  id: string,
  bank: string,
  date: string
  value: number,
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

export interface IGmailController {
  getTransaction(): Promise<Attributestype[]>
}

export interface IGmailGateway {
  getTransaction(auth: string): Promise<Attributestype[]>
}
