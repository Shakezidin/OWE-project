import { Dispatch, SetStateAction } from 'react';
import { postCaller } from '../infrastructure/web_api/services/apiUrl';
import {  format, parse, addMinutes } from 'date-fns';
export const firstCapitalize = (str: string) => {
  const key = str[0].toUpperCase() + str.slice(1, str.length);
  return key;
};
export const sendMail = ({
  toMail,
  message,
  subject,
  html_content,
}: {
  toMail: string;
  message: string;
  subject: string;
  html_content: string;
}) => {
  return postCaller('sendmail', {
    subject,
    message,
    to_mail: toMail,
    html_content,
  });
};

export const checkLastPage = (
  current: number,
  total: number,
  setCurrentPage: Dispatch<SetStateAction<number>>,
  rows: number,
  totalPageData: number
) => {
  if (current === total && current > 1 && rows === totalPageData) {
    setCurrentPage((prev) => prev - 1);
  }
  return;
};
export const generateTimeArray=(start: string, end: string)=> {
  const startTime = parse(start, 'h:mm aa', new Date());
  const endTime = parse(end, 'h:mm aa', new Date());
  const timeArray = [];

  let currentTime = startTime;
  while (currentTime <= endTime) {
    timeArray.push(format(currentTime, 'h:mm aa'));
    currentTime = addMinutes(currentTime, 30);
  }
  return timeArray;
}