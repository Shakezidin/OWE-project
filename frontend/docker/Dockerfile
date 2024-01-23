FROM node:14-alpine

RUN mkdir -p /root/frontend

ADD commission_app /root/frontend
RUN ls -lA /root/frontend

WORKDIR /root/frontend
EXPOSE 3000
RUN chown -R root /root/frontend
RUN npm i

CMD ["npm", "start"]
