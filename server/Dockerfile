FROM node:22-alpine
# v5-fresh-deploy
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN rm -f .env
EXPOSE 5000
CMD ["node", "server.js"]
