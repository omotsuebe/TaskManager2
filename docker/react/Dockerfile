FROM node:20-alpine as react
# Set the working directory
WORKDIR /usr/src/app
# Add the source code to app
COPY ./frontend /usr/src/app/
RUN npm ci
RUN npm run build

FROM nginx:alpine
ARG name
# Copy the build output to replace the default nginx contents.
COPY --from=react /usr/src/app/build /usr/share/nginx/html

RUN ls /usr/share/nginx/html

COPY ./docker/nginx/conf.d/frontend.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80