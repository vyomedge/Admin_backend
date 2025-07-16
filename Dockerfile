# Use Node.js version 22
FROM node:22

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the production port
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
