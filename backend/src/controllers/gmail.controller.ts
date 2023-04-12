import { IGmailController, IGmailGateway } from '../interfaces/interfaces';

export class GmailController implements IGmailController {
  private content?: string[];

  constructor(private readonly gmailGateway: IGmailGateway) {}

  async setMessages(): Promise<void> {
    const messages = await this.gmailGateway.getMessages();
    console.log(messages);
  }

  async getValue() {
    const keyWord = 'R$';
    const nextItem = 1;
    const valueIndex: number[] = [];
    const values: string[] = [];
    if (this.content) {
      for (let i = 0; i < this.content.length; i++) {
        if (this.content[i] === keyWord) {
          valueIndex.push(i + nextItem);
        }
      }
      for (let i = 0; i < valueIndex.length; i++) {
        values.push(this.content[valueIndex[i]]);
      }
    }
    console.log(values);
  }
}
