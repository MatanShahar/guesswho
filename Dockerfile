FROM node:12-alpine

USER node
WORKDIR /app
COPY package.json yarn.lock /app/

RUN yarn

COPY data/ /app/data/
COPY static/ /app/static/
COPY index.js /app/

EXPOSE 8080

CMD [ "yarn", "start" ]
