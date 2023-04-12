export interface IGmailController {
  setMessages(content: string[]): Promise<void>;
  getValue(): Promise<void>;
}

export interface IGmailGateway {
  getMessages(auth?: string): Promise<string[]>;
}
