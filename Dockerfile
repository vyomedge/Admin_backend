# Use Node 22
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose Cloud Run port
EXPOSE 8080

# Start using PM2 with cluster mode off (one instance)
CMD ["npx", "pm2-runtime", "index.js"]
