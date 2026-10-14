
FROM node:22-alpine
# cache-bust-2
WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN rm -f .env

EXPOSE 5000

CMD ["npm", "start"]
