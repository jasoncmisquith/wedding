# Ultra-lightweight Nginx container for local preview & production container hosting
FROM nginx:alpine

# Copy web files
COPY public /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
