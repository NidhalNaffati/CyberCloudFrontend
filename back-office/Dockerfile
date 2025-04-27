    # Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose port 4200
EXPOSE 4202

# Command to run the application
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
