# Use official lightweight Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy dependency configuration files
COPY package*.json ./

# Install packages
RUN npm install

# Copy all source files
COPY . .

# Compile TypeScript to JavaScript production build
RUN npm run build

# Expose backend port
EXPOSE 5000

# Run the compiled code natively
CMD ["node", "dist/index.js"]