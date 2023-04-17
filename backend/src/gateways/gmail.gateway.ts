import { htmlToText } from 'html-to-text';
import { GoogleAdapter, IGmailGateway, ResponseType } from '../interfaces/interfaces';


export class GmailGateway implements IGmailGateway {
  constructor(private readonly google: GoogleAdapter) {}

  private async getMessage(auth: string): Promise<ResponseType> {
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

  private async getHeader(messages: ResponseType, headerName: string): Promise<string[]> {
    const header: string[] = [];
    messages.map(item => {
      const filtered = item.headers?.find((header) => header.name === headerName)?.value;
      if(filtered) header.push(filtered);
    })
    return header;
  }

  private async getSubjects(messages: ResponseType): Promise<string[]> {
    const subjects: string[] = [];
    const keyWords: string[] = ['pix']
    const listSubject = await this.getHeader(messages, 'Subject');
    listSubject.forEach(item => {
      if(keyWords.some(subject => item.toLowerCase().includes(subject))) {
        subjects.push(item);
      }
    })
    return subjects;
  }

  private async getBank(messages: ResponseType): Promise<string[]> {
    const banks: string[] = [];
    const keyWords: string[] = ['c6bank', 'nubank'];
    const listBank = await this.getHeader(messages, 'From');
    listBank.forEach(item => {
      if (keyWords.some(bank => item.toLowerCase().includes(bank))) {
        banks.push(item);
      }
    })
    return banks;
  }

  private async getDates(messages: ResponseType): Promise<string[]> {
    return await this.getHeader(messages, 'Date');
  }

  private async getBody(messages: ResponseType): Promise<string[]> {
    const bodies: string[] = [];
    messages.forEach((res) => {
      const body = res.body.data
      if (body) {
        const decodedBody = Buffer.from(body, 'base64').toString();
        const readable = htmlToText(decodedBody);
        bodies.push(readable);
      }
    });
    return bodies;
  }

  async getTransaction(auth: string) {
  const messages = await this.getMessage(auth);
  const [subjects, banks, dates, bodies] = await Promise.all([
    this.getSubjects(messages),
    this.getBank(messages),
    this.getDates(messages),
    this.getBody(messages),
  ]);
  return {
    subjects, banks, dates, bodies
  };
}

}
