import { IGmailController } from '../interfaces/interfaces';

export class GmailController implements IGmailController {
  private content?: string[];

  async setContent(content: string[]): Promise<void> {
    this.content = content;
  }

  async getValue() {
    console.log(this.content);
  }
}
