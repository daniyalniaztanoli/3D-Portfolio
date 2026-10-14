FROM node:22-alpine
# v3-no-enum-fix
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN rm -f .env
EXPOSE 5000
CMD ["node", "server.js"]
