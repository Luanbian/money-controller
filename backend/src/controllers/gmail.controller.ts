import { google } from 'googleapis';
import { IGmailController } from '../interfaces/interfaces';

export class GmailController implements IGmailController {
  async listLabels(auth: string) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.labels.list({
      userId: 'me',
    });
    const labels = res.data.labels;
    if (!labels || labels.length === 0) {
      console.log('No labels found.');
      return;
    }
    console.log('chegou aqui');
  }
}
