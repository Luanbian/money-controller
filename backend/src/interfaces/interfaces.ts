export interface IGmailController {
  getAtributes(): Promise<string[]>;
}

export interface IGmailGateway {
  getMessages(auth: string): Promise<string[]>;
}
