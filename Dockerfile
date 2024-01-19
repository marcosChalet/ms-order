FROM node:lts-alpine3.18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000

RUN npx prisma generate

CMD [ "sh", "-c", "$NPM_RUN_COMMAND" ]