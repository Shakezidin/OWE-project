import { Dispatch, SetStateAction } from 'react';
import { postCaller } from '../infrastructure/web_api/services/apiUrl';

export const firstCapitalize = (str: string) => {
  const key = str[0].toUpperCase() + str.slice(1, str.length);
  return key;
};
export const sendMail = ({
  toMail,
  message,
  subject,
}: {
  toMail: string;
  message: string;
  subject: string;
}) => {
  return postCaller('sendmail', { subject, message, to_mail: toMail });
};

export const checkLastPage = (
  current: number,
  total: number,
  setCurrentPage: Dispatch<SetStateAction<number>>,
  rows:number,
  totalPageData:number
) => {
  if (current === total && current > 1 && rows===totalPageData) {
    setCurrentPage((prev) => prev - 1);
  }
  return;
};
