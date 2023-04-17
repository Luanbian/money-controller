import { htmlToText } from 'html-to-text';
import { GoogleAdapter, HeaderType, IGmailGateway, ResponseType } from '../interfaces/interfaces';


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

  private async getHeader(messages: ResponseType, headerName: string): Promise<HeaderType> {
    const headers: HeaderType = [];
    messages.map(item => {
      const header = item.headers?.find((header) => header.name === headerName)?.value;
      const date = item.headers?.find((header) => header.name === 'Date')?.value;
      const bank = item.headers?.find((header) => header.name === 'From')?.value;
      const body = item.body.data;
      if(header && date && bank) headers.push({header, date, bank, body});
    })
    return headers;
  }

  private async getSubjects(messages: ResponseType): Promise<HeaderType> {
    const subjects: HeaderType = [];
    const keyWords: string[] = ['pix']
    const listSubject = await this.getHeader(messages, 'Subject');
    listSubject.forEach(item => {
      if(keyWords.some(subject => item.header?.toLowerCase().includes(subject))) {
        subjects.push(item);
      }
    })
    return subjects;
  }

  private async getBank(subjects: HeaderType): Promise<string[]> {
    const listbanks: string[] = [];
    subjects.map(item => {
      if(item.bank) listbanks.push(item.bank);
    })
    const cleanListBank: string[][] = [];
    listbanks.map(item => {
      const element = item.replace('.com', ' ').replace('@', ' ').replace('>', '').split(' ');
      cleanListBank.push(element);
    })
    const bankArray = cleanListBank.flat();
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
    return banks
  }

  private async getDate(subjects: HeaderType): Promise<string[]> {
    const date: string[] = [];
    subjects.map(item => {
      date.push(item.date!);
    })
    const formatDateHour = (data: string): string => {
      const dataObj = new Date(data);
      const day = String(dataObj.getDate()).padStart(2, '0');
      const month = String(dataObj.getMonth() + 1).padStart(2, '0');
      const year = dataObj.getFullYear();
      const hour = String(dataObj.getHours()).padStart(2, '0');
      const minuto = String(dataObj.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hour}:${minuto}`;
    };
    const dates = date.map((data) => formatDateHour(data));
    return dates;
  }

  private async getBody(subjects: HeaderType): Promise<string[]> {
    const bodies: string[] = []
    subjects.map(item => {
      if(item.body) bodies.push(item.body);
    })
    const email: string[] =[]
    bodies.map(item => {
      const decoded = Buffer.from(item, 'base64').toString();
      const readable = htmlToText(decoded);
      email.push(readable);
    })
    const cleanEmail: string[][] = [];
    email.map(item => {
      const element = item.replace(/\n/g, ' ').split(' ');
      cleanEmail.push(element);
    })
    const messageArray = cleanEmail.flat();
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

  async getTransaction(auth: string) {
  const messages = await this.getMessage(auth);
  const subjects = await this.getSubjects(messages);
  const [banks, dates, bodies] = await Promise.all([
    this.getBank(subjects),
    this.getDate(subjects),
    this.getBody(subjects),
  ]);
  return { banks, dates, bodies };
}

}
