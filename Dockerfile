FROM nginx
COPY . /etc/nginx/html
ADD default.conf /etc/nginx/conf.d/default.conf