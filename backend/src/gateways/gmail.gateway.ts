import { htmlToText } from 'html-to-text';
import { GoogleAdapter, HeaderType, IGmailGateway, ResponseType } from '../interfaces/interfaces';

export class GmailGateway implements IGmailGateway {
  constructor(private readonly google: GoogleAdapter) {}

  private async getMessage(auth: string): Promise<ResponseType[]> {
    const gmail = this.google.gmail({ version: 'v1', auth });
    const { data: { messages } } = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:inbox',
    });
    if (!messages || messages.length === 0) {
      throw new Error('No messages found');
    }
    const promises = messages.map(({ id }) => {
      return gmail.users.messages.get({
        userId: 'me',
        id,
        format: 'full'
      });
    });
    const results = await Promise.all(promises);
    return results.map(({ data: { payload: { headers, body}, id} }) => ({
      headers,
      id,
      body
    }));
  }

  private getHeader(message: ResponseType, headerName: string) {
    return message.headers?.find((header) => header.name === headerName)?.value;
  }

  private filterByKeyword(messages: ResponseType[]): ResponseType[] {
    const keyWords: string[] = ['pix']
    return messages.filter((message) => keyWords.some(keyword => {
      const subject = this.getHeader(message, 'Subject');
      return subject?.toLowerCase().includes(keyword);
    }));
  }

  private getBank(message: ResponseType): string {
    const from = this.getHeader(message, 'From');
    return from!.replace(/(^.*@)(.*)(\.com)(.*$)/, '$2');
  }

  private getDate(message: ResponseType): string {
    // refatorar com date-fns 
    const date = this.getHeader(message, 'Date');
    const formatDateHour = (data: string): string => {
      const dataObj = new Date(data);
      const day = String(dataObj.getDate()).padStart(2, '0');
      const month = String(dataObj.getMonth() + 1).padStart(2, '0');
      const year = dataObj.getFullYear();
      const hour = String(dataObj.getHours()).padStart(2, '0');
      const minute = String(dataObj.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hour}:${minute}`;
    }
    return formatDateHour(date!)
  }

  private getValue(message: ResponseType): string {
    //refatorar arrays desnecessárias
    const body = message.body.data;
    const decoded = Buffer.from(body, 'base64').toString();
    const readable = htmlToText(decoded);
    const element = readable.replace(/\n/g, ' ').split(' ');
    const keyWord = 'R$';
    const nextItem = 1;
    const valueIndex: number[] = [];
    const values: string[] = [];
    if (element) {
      for (let i = 0; i < element.length; i++) {
        if (element[i] === keyWord) {
          valueIndex.push(i + nextItem);
        }
      }
      for (let i = 0; i < valueIndex.length; i++) {
        values.push(element[valueIndex[i]]);
      }
    }
    return values[0];
  }

  async getTransaction(auth: string) {
    const messages = await this.getMessage(auth);
    const filteredMessages = this.filterByKeyword(messages);
    return filteredMessages.map((message) => {
      return {
        bank: this.getBank(message),
        date: this.getDate(message),
        value: this.getValue(message)
      }
    })
  }

}