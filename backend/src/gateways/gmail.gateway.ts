import { htmlToText } from 'html-to-text';
import { format } from 'date-fns';
import { GoogleAdapter, IGmailGateway, EmailType } from '../interfaces/interfaces';

export class GmailGateway implements IGmailGateway {
  constructor(private readonly google: GoogleAdapter) {}

  private async getMessage(auth: string): Promise<EmailType[]> {
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

  private getHeader(message: EmailType, headerName: string) {
    return message.headers?.find((header) => header.name === headerName)?.value;
  }

  private filterByKeyword(messages: EmailType[]): EmailType[] {
    const keyWords: string[] = ['pix']
    return messages.filter((message) => keyWords.some(keyword => {
      const subject = this.getHeader(message, 'Subject');
      return subject?.toLowerCase().includes(keyword);
    }));
  }

  private getBank(message: EmailType): string {
    const from = this.getHeader(message, 'From');
    return from!.replace(/(^.*@)(.*)(\.com)(.*$)/, '$2');
  }

  private getDate(message: EmailType): string {
    const date = new Date(this.getHeader(message, 'Date')!);
    const formattedDate = format(date, 'dd/MM/yyyy HH:mm');
    return formattedDate!
  }

  private getValue(message: EmailType): number {
    const body = message.body.data;
    const decoded = Buffer.from(body, 'base64').toString();
    const readable = htmlToText(decoded);
    const value = readable.match(/\d{1,3}(?:\.\d{3})*(?:,\d{2})/g)?.[0];
    const floatValue = parseFloat(parseFloat(value!.replace(',', '.')).toFixed(2));
    return floatValue;
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