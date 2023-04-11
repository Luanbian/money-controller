import { GmailController } from '../controllers/gmail.controller';

export const makeGmailController = () => {
  return new GmailController();
};
