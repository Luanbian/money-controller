import { GmailGateway } from '../gateways/gmail.gateway';
import { GmailController } from '../controllers/gmail.controller';
import { google } from 'googleapis';
import { GoogleAdapter, GoogleGmailAdapter } from '../interfaces/interfaces';

export const makeGmailGateway = () => {
  const adapterGoogle: GoogleAdapter = {
    gmail: ({ version, auth }) => {
      const gmail = google.gmail({ version, auth });
      return {
        users: {
          messages: {
            list: (props) => gmail.users.messages.list(props),
            get: (props) => gmail.users.messages.get(props),
          },
        },
      } as GoogleGmailAdapter;
    },
  };
  return new GmailGateway(adapterGoogle);
};

export const makeGmailController = () => {
  const gmailGateway = makeGmailGateway();
  return new GmailController(gmailGateway);
};
