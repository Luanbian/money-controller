import { IGmailController } from '../interfaces/interfaces';

export class GmailController implements IGmailController {
  private content?: string[];

  async setContent(content: string[]): Promise<void> {
    const cleanContent: string[][] = [];
    content.map((el) => {
      const element = el.replace(/\n/g, ' ').split(' ');
      cleanContent.push(element);
    });
    this.content = cleanContent.flat();
    this.getValue();
  }

  async getValue() {
    console.log(this.content);
  }
}
