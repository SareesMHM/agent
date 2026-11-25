FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend .
RUN npx prisma generate && npm run build
CMD ["node","dist/main.js"]
