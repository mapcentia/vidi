FROM debian:bookworm-slim
MAINTAINER Martin Høgh<mh@mapcentia.com>

RUN export DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_FRONTEND noninteractive

# Install packages
RUN apt-get -y update
RUN apt-get -y install wget curl vim git supervisor postgresql-client default-jre gnupg2 locales libssl-dev libxss-dev pdftk bzip2 libgtk-3-0

# We’ll still rely on nvm, but watch out for environment issues in multi-stage
# Docker builds. We’ll “export” environment variables inline as needed.
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash

SHELL ["/bin/bash", "-l", "-c"]
# Docker does not expand ~ in ENV values, so use an absolute path.
ENV NVM_DIR="/root/.nvm"
RUN source $NVM_DIR/nvm.sh \
    && nvm install 14 \
    && nvm alias default 14 \
    # nvm only puts node/npm on PATH in login/interactive shells. Symlink them
    # into /usr/local/bin so any shell (incl. non-login build steps) gets Node 24
    # and its bundled npm, instead of falling back to a stale system npm.
    && ln -sf "$(nvm which 14)" /usr/local/bin/node \
    && ln -sf "$(dirname "$(nvm which 14)")/npm" /usr/local/bin/npm \
    && ln -sf "$(dirname "$(nvm which 14)")/npx" /usr/local/bin/npx

# Add Supervisor config and run the deamon
ADD conf/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
