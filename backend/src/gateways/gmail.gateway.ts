import { htmlToText } from 'html-to-text';
import { GoogleAdapter, IGmailGateway } from '../interfaces/interfaces';

type SubjectType = {headers?: string | null | undefined; id?: string | null | undefined}

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

  private async getHeader(auth: string, id: string, headerName: string): Promise<string | undefined | SubjectType> {
    const gmail = this.google.gmail({version: 'v1', auth});
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: id
    });
    if( headerName == 'Subject') {
      const headers = res.data.payload?.headers?.filter((header) => header.name === 'Subject')[0].value
      const id = res.data.id;
      return { headers, id };
    } else {
      const header = res.data.payload.headers?.find((header) => header.name === headerName)?.value;
      if (header) return header;
    }
  }

  private async getSubjects(auth: string, messageIds: string[]): Promise<string[]> {
    const subjects: string[] = [];
    for(const id of messageIds) {
      const subject: SubjectType = await this.getHeader(auth, id, 'Subject')
      if (subject.headers?.toLowerCase().includes('pix')) subjects.push(subject.id!);
    }
    console.log(subjects)
    return subjects;
  }

  private async getBank(auth: string, filteredIds: string[]): Promise<string[]> {
    const banks: string[] = [];
    for (const id of filteredIds) {
      const from = await this.getHeader(auth, id, 'From');
      if (from) banks.push(from);
    }
    return banks;
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
