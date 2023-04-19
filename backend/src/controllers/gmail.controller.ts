import { Attributestype, IGmailController, IGmailGateway, outputRelate } from '../interfaces/interfaces';
import { authorize } from '../..';
import { v4 } from 'uuid';

export class GmailController implements IGmailController {
  constructor(private readonly gmailGateway: IGmailGateway) {}

  private async setAttributes(): Promise<Attributestype[]> {
    try {
      const auth = await authorize()
      const transaction = await this.gmailGateway.getTransaction(auth);
      return transaction;
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async getAttributes(): Promise<Attributestype[]> {
    return this.setAttributes();
  }
}
