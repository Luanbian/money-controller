export interface IGmailController {
  getAttributes(): Promise<[number, string, string][]>
}

export interface Attributestype {
  messages: string[],
  banks: string[],
  dates:string[]
}

export interface IGmailGateway {
  getAttributes(auth: string): Promise<Attributestype>;
}
