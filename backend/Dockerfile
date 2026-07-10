FROM php:8.5-cli-alpine AS application

RUN apk add --no-cache \
        icu-libs \
        libpq \
        libzip \
    && apk add --no-cache --virtual .build-dependencies \
        icu-dev \
        libpq-dev \
        libzip-dev \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        intl \
        opcache \
        pcntl \
        pdo_pgsql \
        zip \
    && apk del .build-dependencies

WORKDIR /var/www/html

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY . .

RUN composer install \
        --no-dev \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader \
    && composer clear-cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod +x /var/www/html/docker-entrypoint.sh

USER www-data

EXPOSE 8000

ENTRYPOINT ["/var/www/html/docker-entrypoint.sh"]
