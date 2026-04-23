###############################################################################
# Base image
###############################################################################
FROM debian:bookworm-slim AS base
LABEL maintainer="Martin Høgh <mh@mapcentia.com>"

# Non-interactive mode for apt
ENV DEBIAN_FRONTEND=noninteractive

# Install packages
RUN apt-get -y update &&\
    apt-get -y install wget curl vim git supervisor postgresql-client default-jre gnupg2 locales libssl-dev libxss-dev pdftk bzip2 chromium ruby-full rubygems

# Node.js
RUN curl -sL https://deb.nodesource.com/setup_24.x -o nodesource_setup.sh &&\
    bash nodesource_setup.sh &&\
    apt-get install -y nodejs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=20s --start-period=30s --retries=2 \
    CMD curl --fail http://127.0.0.1:3000 || exit 1

# Add Supervisor config and run the deamon
ADD conf/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Clone GC2 from GitHub
RUN mkdir -p /var/www \
    && cd /var/www \
    && git clone https://github.com/mapcentia/vidi.git --branch master

# Set workdir
WORKDIR /var/www/vidi

EXPOSE 3000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

###############################################################################
# Dev Stage (final)
###############################################################################
FROM base AS dev

# Get latest source
RUN git pull

#Add config files from Git repo
COPY conf/vidi/config.js config/config.js

# VOLUME for Vidi if you want persistence
VOLUME /var/www/vidi

# Build with Node + Grunt
RUN npm install &&\
    npm run build &&\
    npm run build:css &&\
    npm run build:libs
