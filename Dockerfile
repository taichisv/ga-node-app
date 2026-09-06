FROM node:20-alpine

WORKDIR /app

# 依存関係のインストールを先にキャッシュさせる
COPY package*.json ./
RUN npm install

# アプリケーションのコードをコピー
COPY . .

EXPOSE 3000

CMD ["npm", "start"]