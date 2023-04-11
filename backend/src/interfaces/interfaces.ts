export interface IGmailController {
  listLabels(auth: string): void;
  teste(auth: string, messageId: string): void;
}
