import { google } from 'googleapis';
import { IGmailController, IGmailGateway } from '../interfaces/interfaces';
import { htmlToText } from 'html-to-text';

export class GmailGateway implements IGmailGateway {
  private gmailController: IGmailController;

  constructor(gmailController: IGmailController) {
    this.gmailController = gmailController;
    this.getMessageId = this.getMessageId.bind(this);
    this.listMessage = this.listMessage.bind(this);
    this.listSubject = this.listSubject.bind(this);
  }

  async getMessageId(auth: string) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:inbox',
    });
    const labels = res.data.messages;
    if (!labels || labels.length === 0) {
      console.log('No labels found.');
      return;
    }
    const messageId: string[] = [];
    labels.forEach((label) => {
      messageId.push(`${label.id}`);
    });
    this.listSubject(auth, messageId);
  }

  async listSubject(auth: string, messageId: string[]) {
    const gmail = google.gmail({ version: 'v1', auth });
    const promises = messageId.map((id) => {
      return gmail.users.messages.get({
        userId: 'me',
        id: id,
      });
    });
    const results = await Promise.all(promises);
    const filteredIds: string[] = [];
    results.forEach((res) => {
      const headers = res.data.payload?.headers;
      const id = res.data.id;
      const subject = headers?.filter((header) => header.name === 'Subject')[0]
        .value;
      if (subject?.toLowerCase().includes('pix')) {
        const filtered = id;
        if (filtered) {
          filteredIds.push(filtered);
        }
      }
    });
    this.listMessage(auth, filteredIds);
  }

  async listMessage(auth: string, filteredIds: string[]): Promise<void> {
    const gmail = google.gmail({ version: 'v1', auth });
    const promises = filteredIds.map((id) => {
      return gmail.users.messages.get({
        userId: 'me',
        id: id,
      });
    });
    const results = await Promise.all(promises);
    const content: string[] = [];
    results.forEach((res) => {
      const body = res.data.payload?.body?.data;
      if (body) {
        const decodedBody = Buffer.from(body, 'base64').toString();
        const readable = htmlToText(decodedBody);
        content.push(readable);
      }
    });
    await this.gmailController.getValue(content);
  }
}
