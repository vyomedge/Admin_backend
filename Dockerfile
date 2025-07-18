FROM node:22

WORKDIR /app

# Install native build tools for bcrypt/sharp etc.
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy full codebase
COPY . .

# Build step (if needed)
RUN npm run build || echo "No build step"

# Must expose 8080 for Cloud Run
EXPOSE 8080

# Start your app cleanly
CMD ["node", "index.js"]
