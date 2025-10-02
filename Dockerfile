# Dockerfile — PHP 8.3 + Apache for Render
FROM php:8.3-apache

WORKDIR /var/www/html

# Enable Apache mod_rewrite and allow .htaccess
RUN a2enmod rewrite \
 && sed -ri 's/AllowOverride\s+None/AllowOverride All/i' /etc/apache2/apache2.conf

# PHP extensions for MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql \
 && docker-php-ext-enable mysqli pdo_mysql

# Copy your app
COPY . /var/www/html/

# Make Apache listen on Render's assigned $PORT
CMD bash -lc 'if [ -n "$PORT" ]; then \
  sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf && \
  sed -i "s/:80>/:$PORT>/" /etc/apache2/sites-available/000-default.conf; \
  fi; exec apache2-foreground'
