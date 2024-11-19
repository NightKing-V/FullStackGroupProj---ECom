# Use Node.js LTS version
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy application code
COPY src ./src

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
