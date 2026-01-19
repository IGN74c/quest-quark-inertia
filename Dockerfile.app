FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    libzip-dev \
    postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

WORKDIR /var/www/html

COPY . .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader

RUN apk add --no-cache nodejs npm \
    && npm ci \
    && npm run build \
    && rm -rf node_modules

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

ENTRYPOINT ["sh", "-c", "php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan view:cache && php-fpm"]