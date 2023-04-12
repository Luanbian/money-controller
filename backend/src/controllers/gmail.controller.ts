import { IGmailController, IGmailGateway } from '../interfaces/interfaces';
import { authorize } from '../..';

export class GmailController implements IGmailController {
  constructor(private readonly gmailGateway: IGmailGateway) {}

  private async setAttributes(): Promise<{messages: string[], banks: string[]}> {
    try {
      const auth = await authorize()
      const attributes = await this.gmailGateway.getAttributes(auth);
      return attributes;
    } catch (error: any) {
      throw new Error(error)
    }
  }

  private async convertMessageToArray(message: string[]) {
    const cleanContent: string[][] = [];
    message.map((el) => {
      const element = el.replace(/\n/g, ' ').split(' ');
      cleanContent.push(element);
    });
    const messageArray = cleanContent.flat();
    return messageArray;
  }

  private async convertBankToArray(bank: string[]) {
    const cleanBank: string[][] = [];
    bank.map((el) => {
      const element = el.replace('.com', ' ').replace('@', ' ').replace('>', '').split(' ');
      cleanBank.push(element);
    });
    const bankArray = cleanBank.flat();
    return bankArray;
  }

  private async getValues(messageArray: string[]) {
    const keyWord = 'R$';
    const nextItem = 1;
    const valueIndex: number[] = [];
    const values: string[] = [];
    if (messageArray) {
      for (let i = 0; i < messageArray.length; i++) {
        if (messageArray[i] === keyWord) {
          valueIndex.push(i + nextItem);
        }
      }
      for (let i = 0; i < valueIndex.length; i++) {
        values.push(messageArray[valueIndex[i]]);
      }
    }
    return values;
  }

  private async getBanks(bankArray: string[]) {
    const keyWord = '.br';
    const previousItem = 1;
    const valueIndex: number[] = [];
    const banks: string[] = [];
    if (bankArray) {
      for(let i = 0; i < bankArray.length; i++) {
        if(bankArray[i] === keyWord) {
          valueIndex.push(i - previousItem);
        }
      }
      for(let i = 0; i < valueIndex.length; i++) {
        banks.push(bankArray[valueIndex[i]]);
      }
    }
    return banks;
  }

  async getAttributes() {
    const attributes = await this.setAttributes();
    const convertMessage = await this.convertMessageToArray(attributes.messages);
    const convertBank = await this.convertBankToArray(attributes.banks);
    const values = await this.getValues(convertMessage);
    const banks = await this.getBanks(convertBank);
    return {
      values,
      banks
    };
  }
}
