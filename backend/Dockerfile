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
