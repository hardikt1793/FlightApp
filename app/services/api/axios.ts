import axios from 'axios';

export const api = axios.create({});

export const URL = {
  'get-emails': 'https://www.googleapis.com/gmail/v1/users/me/messages',
  'get-email-details': (id: string) =>
    `https://www.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
};
