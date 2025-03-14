# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set environment variables with defaults
ARG REACT_APP_API_BASE_URL=http://localhost:8000
ARG REACT_APP_FACEBOOK_API_VERSION=v18.0
ARG REACT_APP_FACEBOOK_APP_ID

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Add bash for the entrypoint script
RUN apk add --no-cache bash

# Create a directory for our scripts
RUN mkdir -p /usr/share/nginx/scripts

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/share/nginx/scripts/
RUN chmod +x /usr/share/nginx/scripts/docker-entrypoint.sh

# Create a directory for environment variables
RUN mkdir -p /usr/share/nginx/html/config

# Expose port 80
EXPOSE 80

# Use our custom entrypoint script
ENTRYPOINT ["/usr/share/nginx/scripts/docker-entrypoint.sh"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
