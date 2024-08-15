FROM debian:bookworm-slim

MAINTAINER Martin Høgh<mh@mapcentia.com>

RUN export DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_FRONTEND noninteractive

# Install packages
RUN apt-get -y update --allow-releaseinfo-change
RUN apt-get -y install wget curl vim git supervisor postgresql-client default-jre gnupg2 locales libssl-dev libxss-dev pdftk bzip2 chromium ruby-full rubygems

RUN curl -sL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh &&\
    bash nodesource_setup.sh &&\
    apt-get install -y nodejs

RUN npm install -g sass grunt-cli

HEALTHCHECK --interval=30s --timeout=20s --start-period=30s --retries=2 \
    CMD curl --fail http://127.0.0.1:3000 || exit 1

# Add Supervisor config and run the deamon
ADD conf/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
