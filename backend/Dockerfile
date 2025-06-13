FROM node:20

WORKDIR /app

# Устанавливаем зависимости backend-а
COPY package*.json ./
RUN npm install

# Копируем всё остальное, включая папку public
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
