# Stage 1: Build React App
FROM node:20-alpine as react
# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY ./frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code
COPY ./frontend ./

# Build the application for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
ARG name

# Copy the build output to Nginx HTML directory
COPY --from=react /usr/src/app/build/client /usr/share/nginx/html


# Verify the copied files (Optional)
RUN ls /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./docker/react/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
