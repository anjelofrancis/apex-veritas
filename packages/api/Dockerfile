# Use official Node.js runtime as a parent image
FROM node:20-bullseye-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy root package.json files for the workspace
COPY package.json package-lock.json ./
COPY packages/api/package.json ./packages/api/

# Install dependencies (only for api workspace)
RUN npm ci --workspace=packages/api

# Copy the rest of the API application code
COPY packages/api ./packages/api/

# Generate Prisma Client
WORKDIR /usr/src/app/packages/api
RUN npx prisma generate

# Expose the port the app runs on (Cloud Run sets PORT env var)
ENV PORT=8080
EXPOSE 8080

# Command to run the application
CMD [ "sh", "-c", "npx prisma migrate deploy && npm start" ]
