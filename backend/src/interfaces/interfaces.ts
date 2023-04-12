export interface IGmailController {
  getAttributes(): Promise<string[]>;
}

export interface IGmailGateway {
  getAttributes(auth: string): Promise<{messages: string[], banks: string[]}>;
}
