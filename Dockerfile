FROM node:12-alpine

WORKDIR /app
COPY package.json yarn.lock /app/

RUN yarn

COPY data/ /app/data/
COPY static/ /app/static/
COPY index.ts /app/
COPY src/ /app/src/

EXPOSE 8080

CMD [ "yarn", "start" ]
