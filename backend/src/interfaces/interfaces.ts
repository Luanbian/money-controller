export interface IGmailController {
  setMessages(): Promise<string[]>;
  getValue(): Promise<void>;
}

export interface IGmailGateway {
  getMessages(auth?: string): Promise<string[]>;
}
