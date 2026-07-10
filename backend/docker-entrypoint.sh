#!/bin/sh
set -eu

if [ -z "${APP_KEY:-}" ]; then
    APP_KEY="base64:$(php -r 'echo base64_encode(random_bytes(32));')"
    export APP_KEY
fi

if [ -z "${JWT_SECRET:-}" ]; then
    JWT_SECRET="$(php -r 'echo bin2hex(random_bytes(32));')"
    export JWT_SECRET
fi

php artisan migrate --force
php artisan db:seed --force

exec php artisan serve --host=0.0.0.0 --port=8000
