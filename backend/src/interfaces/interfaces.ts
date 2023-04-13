export interface IGmailController {
  getAttributes(): Promise<[number, string, string][]>
}

export interface IGmailGateway {
  getAttributes(auth: string): Promise<{messages: string[], banks: string[], dates:string[]}>;
}
