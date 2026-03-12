FROM node:20-alpine

# force rebuild v4
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .
RUN rm -f tsconfig.build.tsbuildinfo
RUN npm run build
RUN ls -la /app/dist

EXPOSE 3001

CMD ["npm", "run", "start:prod"]