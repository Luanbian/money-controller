export interface IGmailController {
  getValue(content: string[]): Promise<void>;
}

export interface IGmailGateway {
  getMessageId(auth: string): void;
  listSubject(auth: string, messageId: string[]): void;
  listMessage(auth: string, filteredIds: string[]): Promise<void>;
}
