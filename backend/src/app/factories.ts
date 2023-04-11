import { GmailGateway } from '../gateways/gmail.gateway';

export const makeGmailGateway = () => {
  return new GmailGateway();
};
