export interface IGmailController {

}

export interface IGmailGateway {
  getMessageId(auth: string): void;
  listSubject(auth: string, messageId: string[]): void;
  listMessage(auth: string, filtered: string): Promise<void>;
}
