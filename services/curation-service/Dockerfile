FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY services/curation-service/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY services/curation-service /app/
COPY shared /app/shared/

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3008

# Start the service
CMD ["node", "dist/index.js"] 