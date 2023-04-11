import { IGmailController } from '../interfaces/interfaces';

export class GmailController implements IGmailController {
  async getValue(content: string[]): Promise<void> {
    console.log(content);
  }
}
