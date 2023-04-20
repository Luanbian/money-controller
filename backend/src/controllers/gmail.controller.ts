import { Attributestype, IGmailController, IGmailGateway } from '../interfaces/interfaces';
import { authorize } from '../..';

export class GmailController implements IGmailController {
  constructor(private readonly gmailGateway: IGmailGateway) {}

  private async setTransaction(): Promise<Attributestype[]> {
    try {
      const auth = await authorize()
      const transaction = await this.gmailGateway.getTransaction(auth);
      return transaction;
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async getTransaction(): Promise<Attributestype[]> {
    return await this.setTransaction();
  }
}
