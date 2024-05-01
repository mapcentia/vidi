FROM mapcentia/vidi:base18
MAINTAINER Martin Høgh<mh@mapcentia.com>

RUN export DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_FRONTEND noninteractive

# Clone Vidi from GitHub
RUN cd  ~ &&\
	git  clone https://github.com/mapcentia/vidi.git

# Install grunt
RUN cd ~/vidi &&\
    npm install grunt-cli -g --save-dev

# Install packages
RUN cd ~/vidi &&\
	npm install

#Add config files from Git repo
COPY conf/vidi/config.js /root/vidi/config/config.js

#Run Grunt
RUN cd ~/vidi &&\
    grunt production

EXPOSE 3000

# Share the source dir
VOLUME  ["/root/vidi"]
