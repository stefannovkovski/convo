FROM node:20-alpine

WORKDIR /app
# force rebuild v2

COPY package*.json ./

COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]