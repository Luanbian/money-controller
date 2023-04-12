export interface IGmailController {
  getAttributes(): Promise<[number, string][]>
}

export interface IGmailGateway {
  getAttributes(auth: string): Promise<{messages: string[], banks: string[]}>;
}
