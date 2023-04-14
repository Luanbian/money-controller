export interface Attributestype {
  messages: string[],
  banks: string[],
  dates:string[]
}

export interface outputRelate {
  id: string,
  value: number,
  bank: string,
  date: string
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
      get(props: { userId: string; id: string}): Promise<GmailGetMethod>;
      list(props: {userId: string; q: string}): Promise<{data: {messages: { id: string }[]}}>;
    }
  }
}

export interface GoogleAdapter {
  gmail: (props: {version: 'v1'; auth: string}) => GoogleGmailAdapter;
}

export interface IGmailController {
  getAttributes(): Promise<outputRelate[]>
}

export interface IGmailGateway {
  getTransaction(auth: string): Promise<Attributestype>;
}
