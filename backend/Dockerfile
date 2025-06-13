# 1. Билдим frontend
FROM node:20 AS client-build

WORKDIR /client
COPY ../client/package*.json ./
RUN npm install
COPY ../client ./
RUN npm run build

# 2. Билдим backend и копируем фронт в public
FROM node:20

WORKDIR /app

# Backend dependencies
COPY package*.json ./
RUN npm install

# Backend source code
COPY . .

# Копируем сборку фронта из предыдущего stage
COPY --from=client-build /client/dist ./public

EXPOSE 5000

CMD ["npm", "start"]
