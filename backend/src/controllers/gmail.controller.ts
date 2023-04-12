import { IGmailController } from '../interfaces/interfaces';

export class GmailController implements IGmailController {
  private content?: string[];

  async setMessages(content: string[]): Promise<void> {
    const cleanContent: string[][] = [];
    content.map((el) => {
      const element = el.replace(/\n/g, ' ').split(' ');
      cleanContent.push(element);
    });
    this.content = cleanContent.flat();
    this.getValue();
  }

  async getValue() {
    const keyWord = 'R$';
    const nextItem = 1;
    const valueIndex: number[] = [];
    const values: string[] = [];
    if (this.content) {
      for (let i = 0; i < this.content.length; i++) {
        if (this.content[i] === keyWord) {
          valueIndex.push(i + nextItem);
        }
      }
      for (let i = 0; i < valueIndex.length; i++) {
        values.push(this.content[valueIndex[i]]);
      }
    }
    console.log(values);
  }
}
