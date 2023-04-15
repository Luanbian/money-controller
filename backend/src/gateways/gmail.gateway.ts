import { htmlToText } from 'html-to-text';
import { GoogleAdapter, IGmailGateway } from '../interfaces/interfaces';

type SubjectType = {headers?: string | null | undefined; identify?: string | null | undefined}[]

export class GmailGateway implements IGmailGateway {
  constructor(private readonly google: GoogleAdapter) {}

  private async getMessageIds(auth: string): Promise<string[]> {
    const gmail = this.google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:inbox',
    });
    const labels = res.data.messages;
    if (!labels || labels.length === 0) {
      throw new Error('No labels found');
    }
    const messageIds = labels.map((label) => label.id);
    return messageIds;
  }

  private async getHeader(auth: string, ids: string[], headerName: string): Promise<SubjectType> {
    const gmail = this.google.gmail({version: 'v1', auth});
    const promises = ids.map(id => {
      return gmail.users.messages.get({
        userId: 'me',
        id: id
      });
    });
    const result = await Promise.all(promises);
    const output: SubjectType = [];
    result.forEach(res => {
      const headers = res.data.payload?.headers?.find((header) => header.name === headerName)?.value
      const identify = res.data.id; 
      output.push({ headers, identify });
    });
    return output;
  }

  private async getSubjects(auth: string, messageIds: string[]): Promise<SubjectType> {
    const subject: SubjectType = []
    const listsubjects = await this.getHeader(auth, messageIds, 'Subject');
    listsubjects.map(item => {
      if(item.headers?.toLowerCase().includes('pix')) subject.push(item);
    })
    return subject;
  }

  private async getBank(auth: string, subjects: SubjectType): Promise<SubjectType> {
    const ids: string[] = []
    subjects.map(item => {ids.push(item.identify!)});
    const listBank = await this.getHeader(auth, ids, 'From');
    return listBank;
  }

  private async getDates(auth: string, filteredIds: string[]): Promise<string[]> {
    const dates: string[] = [];
    for (const id of filteredIds) {
      const date = await this.getHeader(auth, id, 'Date');
      if (date) dates.push(date);
    }
    return dates;
  }

  private async listMessages(auth: string, filteredIds: string[]): Promise<string[]> {
    const gmail = this.google.gmail({ version: 'v1', auth });
    const promises = filteredIds.map((id) => {
      return gmail.users.messages.get({
        userId: 'me',
        id: id,
      });
    });
    const results = await Promise.all(promises);
    const contents: string[] = [];
    results.forEach((res) => {
      const body = res.data.payload?.body?.data;
      if (body) {
        const decodedBody = Buffer.from(body, 'base64').toString();
        const readable = htmlToText(decodedBody);
        contents.push(readable);
      }
    });
    return contents;
  }

  async getTransaction(auth: string) {
    const messageIds = await this.getMessageIds(auth);
    const subjects = await this.getSubjects(auth, messageIds);
    const banks = await this.getBank(auth, subjects);
    const messages = await this.listMessages(auth, subjects);
    const dates = await this.getDates(auth, subjects);
    return {
      banks,
      messages,
      dates
    };
  }
}
