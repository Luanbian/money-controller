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

  private async getValue(messageArray: string[]) {
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

  async getAttributes() {
    const attributes = await this.setAttributes();
    const convertMessage = await this.convertMessageToArray(attributes.messages);
    const value = await this.getValue(convertMessage);
    return value;
  }
}
