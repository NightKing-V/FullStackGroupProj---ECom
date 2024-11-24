# Use Node.js LTS version
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy application code
COPY src ./src

# Copy entrypoint script and make it executable
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose the application port
EXPOSE 3000

# Use entrypoint script
ENTRYPOINT ["sh", "/usr/local/bin/entrypoint.sh"]
