
FROM node:20-bookworm-slim

WORKDIR /app

# Install OpenSSL required by Prisma
RUN apt-get update \
    && apt-get install -y openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./

RUN npm install

# Copy application source
COPY . .

# Generate Prisma Client and compile NestJS
RUN npx prisma generate && npm run build

EXPOSE 4000

CMD ["node", "dist/src/main.js"]
