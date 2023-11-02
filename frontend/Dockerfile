# Accept PRODUCTION as a build argument
ARG PRODUCTION

FROM node:18.17.1-alpine AS builder

WORKDIR /frontend

COPY package.json .

RUN if [ "$PRODUCTION" = "true" ] ; then yarn install --production && yarn build ; else yarn install ; fi
# Copy app files
COPY . .

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production

# Set NODE_ENV based on PRODUCTION value
RUN if [ "$PRODUCTION" = "true" ] ; then export NODE_ENV=production ; else export NODE_ENV=development ; fi

# Copy built assets from builder only if in production mode
RUN if [ "$PRODUCTION" = "true" ] ; then cp -r /frontend/build /usr/share/nginx/html ; else cp -r /frontend/src /usr/share/nginx/html ; fi
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 3000
# Start nginx
CMD ["nginx", "-g", "daemon off;"]