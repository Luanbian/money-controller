import { GmailGateway } from '../gateways/gmail.gateway';
import { GmailController } from '../controllers/gmail.controller';

export const makeGmailGateway = () => {
  return new GmailGateway();
};
export const makeGmailController = () => {
  const gmailGateway = makeGmailGateway();
  return new GmailController(gmailGateway);
};
