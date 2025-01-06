FROM php:8.4-fpm

# Set working directory
WORKDIR /var/www/backend

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    autoconf \
    pkg-config \
    libzip-dev \
    zlib1g-dev \
    libssl-dev \
    libssl-doc \
    libsasl2-dev \
    libonig-dev \
    libcurl4-openssl-dev \
    ca-certificates \
    supervisor \
    libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN apt-get install -y libpq-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && docker-php-ext-configure gd --with-freetype=/usr/include --with-jpeg=/usr/include \
    && docker-php-ext-install gd

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Create directory for Supervisor logs
RUN mkdir -p /var/log/supervisor \
    && mkdir -p /etc/supervisor/config

# Copy Supervisor config
COPY ./docker/supervisor/supervisord.conf /etc/supervisord.conf

# Add user for Laravel application
RUN groupadd -g 1000 www && useradd -u 1000 -ms /bin/bash -g www www

# Set folder permissions
RUN chown -R www:www /var/www/backend \
    && chown -R www:www /var/log/supervisor

# Switch to non-root user
USER www

# Expose port and run Supervisor
EXPOSE 9000
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisord.conf"]