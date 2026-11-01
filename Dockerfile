FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html privacy.html delete-me.html delete-my-data.html styles.css /usr/share/nginx/html/
COPY logo.png favicon.png favicon-16.png favicon-32.png apple-touch-icon.png icon-192.png /usr/share/nginx/html/
COPY portico-now-qr-no-blend.png portico-api-qr-no-blend.png portico-api-qr-light.png portico-api-qr.png /usr/share/nginx/html/
COPY diagram /usr/share/nginx/html/diagram
COPY .well-known /usr/share/nginx/html/.well-known
EXPOSE 80
