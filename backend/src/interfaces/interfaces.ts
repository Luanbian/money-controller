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

export interface IGmailController {
  getAttributes(): Promise<outputRelate[]>
}

export interface IGmailGateway {
  getAttributes(auth: string): Promise<Attributestype>;
}
