# Dockerfile for Food Delivery App
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for Expo
RUN npm install -g expo-cli @expo/ngrok

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port for Expo dev server
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start Expo
CMD ["npm", "start"]
