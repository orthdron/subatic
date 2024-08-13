# Use an official Node.js runtime as a parent image with multi-arch support
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies without building native addons
RUN npm ci --ignore-scripts

# Rebuild platform-specific dependencies
RUN npm rebuild

# Install esbuild for the target platform
RUN apk add --no-cache python3 make g++
RUN npm install --platform=linux --arch=arm64 @esbuild/linux-arm64 @esbuild/linux-x64

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Production image, copy all the files and run next
FROM --platform=$TARGETPLATFORM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set ownership to the nextjs user
RUN chown -R nextjs:nodejs .

USER nextjs

# Expose the port the app runs on
EXPOSE 3000

ENV PORT 3000

# Copy and set permissions for the start script
COPY start.sh .
RUN chmod +x start.sh

# Define the command to run the app using the start script
CMD ["/bin/sh", "./start.sh"]