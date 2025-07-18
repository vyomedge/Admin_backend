FROM node:22

WORKDIR /app

# Install build tools for native dependencies like bcrypt, sharp etc.
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Fix: Add --legacy-peer-deps if needed (for newer npm conflicts)
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build || echo "no build step"

EXPOSE 8080

CMD ["node", "index.js"]

