export interface IGmailController {

}

export interface IGmailGateway {
  getMessageId(auth: string): void;
  listMessage(auth: string, messageId: string): void;
}
