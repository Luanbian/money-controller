import { GmailGateway } from '../gateways/gmail.gateway';
import { GmailController } from '../controllers/gmail.controller';

export const makeGmailController = () => {
  return new GmailController();
};
export const makeGmailGateway = () => {
  const gmailController = makeGmailController();
  return new GmailGateway(gmailController);
};
