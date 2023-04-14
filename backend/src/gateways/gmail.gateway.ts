import { htmlToText } from 'html-to-text';
import { GoogleAdapter, IGmailGateway } from '../interfaces/interfaces';

type SubjectType = {
  headers?: { name?: string | null; value?: string | null }[] | null;
  id?: string | null;
}[];

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
    return labels.map((label) => label.id);
  }

  private async getHeader(auth: string, id: string, headerName: string): Promise<string | undefined> {
    const gmail = this.google.gmail({version: 'v1', auth});
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: id
    });
    const header = res.data.payload.headers?.find((header) => header.name === headerName)?.value;
    if (header) return header;
  }

  private async listSubjects(auth: string, messageIds: string[]): Promise<SubjectType> {
    const gmail = this.google.gmail({ version: 'v1', auth });
    const promises = messageIds.map((id) => {
      return gmail.users.messages.get({
        userId: 'me',
        id: id,
      });
    });
    const results = await Promise.all(promises);
    const subjects = results.map((res) => {
      const headers = res.data.payload?.headers;
      const id = res.data.id;
      return { headers, id };
    });
    return subjects;
  }

  private async filterSubjects(subjects: SubjectType): Promise<string[]> {
    const filteredIds: string[] = [];
    subjects.forEach(({headers, id}) => {
      const subject = headers?.filter((header) => header.name === 'Subject')[0]
        .value;
      if (subject?.toLowerCase().includes('pix')) {
        const filtered = id;
        if (filtered) {
          filteredIds.push(filtered);
        }
      }
    });
    return filteredIds;
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
    const subjects = await this.listSubjects(auth, messageIds);
    const filterSubjects = await this.filterSubjects(subjects);
    const banks = await this.getBank(auth, filterSubjects);
    const messages = await this.listMessages(auth, filterSubjects);
    const dates = await this.getDates(auth, filterSubjects);
    return {
      banks,
      messages,
      dates
    };
  }
}
