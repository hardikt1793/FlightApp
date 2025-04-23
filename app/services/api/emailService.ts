import {URL} from './axios';

export const fetchEmailList = async (
  accessToken: string,
  pageSize: number,
  pageToken: string | null = null,
) => {
  const response = await fetch(
    `${URL['get-emails']}?maxResults=${pageSize}${
      pageToken ? `&pageToken=${pageToken}` : ''
    }`,
    {
      headers: {Authorization: `Bearer ${accessToken}`},
    },
  );
  return response.json();
};

export const fetchEmailDetails = async (
  accessToken: string,
  emailId: string,
) => {
  const response = await fetch(URL['get-email-details'](emailId), {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
  return response.json();
};
