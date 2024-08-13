FROM node:22-slim AS builder

WORKDIR /app

COPY package.json ./

RUN npm install --production

COPY . .

RUN npm run build

# Create a smaller production image
FROM node:22-slim AS runner
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["node", "start.js"]