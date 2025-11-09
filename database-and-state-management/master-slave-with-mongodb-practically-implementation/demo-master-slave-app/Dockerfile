# Use Bun official image
FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy package.json and bun.lockb first for caching deps
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install

# Copy the rest of the app
COPY . .

# Expose backend port
EXPOSE 3000

# Start app
CMD ["bun", "run", "dev"]
