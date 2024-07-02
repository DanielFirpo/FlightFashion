# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory inside the container to /frontend
WORKDIR /frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that the Next.js app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]