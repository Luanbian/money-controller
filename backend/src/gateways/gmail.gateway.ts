import { google } from 'googleapis';
import { IGmailGateway } from '../interfaces/interfaces';

export class GmailGateway implements IGmailGateway {
  constructor() {
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
    results.forEach((res) => {
      const headers = res.data.payload?.headers;
      const id = res.data.id;
      const subject = headers?.filter((header) => header.name === 'Subject')[0]
        .value;
      if (subject?.toLowerCase().includes('pix')) {
        const filtered = id;
        if (filtered) {
          this.listMessage(auth, filtered);
        }
      }
    });
  }

  async listMessage(auth: string, filtered: string): Promise<void> {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: filtered,
    });
    const payload = res.data.payload;
    if (!payload) {
      console.log('No payload found.');
      return;
    }
    const messageParts = payload.parts;
    if (!messageParts) {
      console.log('No message parts found.');
      return;
    }
    const textPlainParts = messageParts.filter(
      (part) => part.mimeType === 'text/plain'
    );
    if (textPlainParts.length === 0) {
      console.log('No text/plain parts found.');
      return;
    }
    const body = textPlainParts[0].body;
    if (!body) {
      console.log('No body found.');
      return;
    }
    const data = body.data;
    if (!data) {
      console.log('No data found.');
      return;
    }
    const decodedBody = Buffer.from(data, 'base64').toString();
    console.log(decodedBody);
  }
}
