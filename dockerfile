# Dockerfile
FROM php:8.3-apache

WORKDIR /var/www/html

# Enable Apache mod_rewrite and allow .htaccess overrides
RUN a2enmod rewrite \
 && sed -ri 's/AllowOverride\s+None/AllowOverride All/i' /etc/apache2/apache2.conf

# PHP extensions you need for MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql \
 && docker-php-ext-enable mysqli pdo_mysql

# Copy your app
COPY . /var/www/html/

# Make Apache listen on Render's provided $PORT (default vhost)
CMD bash -lc 'if [ -n "$PORT" ]; then \
  sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf && \
  sed -i "s/:80>/:$PORT>/" /etc/apache2/sites-available/000-default.conf; \
  fi; exec apache2-foreground'
