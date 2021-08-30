FROM mapcentia/vidi:base
MAINTAINER Martin Høgh<mh@mapcentia.com>
ARG version=2021.8.0

RUN export DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_FRONTEND noninteractive

# Clone Vidi from GitHub
RUN cd  ~ &&\
	git  clone https://github.com/mapcentia/vidi.git &&\
	cd vidi &&\
	git checkout tags/$version

# Install grunt
RUN cd ~/vidi &&\
    npm install grunt-cli -g --save-dev

# Install packages
RUN cd ~/vidi &&\
	npm install

# Build a custom bundle of proj4js with only UTM
RUN cd ~ &&\
    npm install -g grunt-cli &&\
    git clone https://github.com/proj4js/proj4js.git &&\
    cd proj4js &&\
    npm install &&\
    grunt build:utm &&\
    cp dist/* /root/vidi/node_modules/proj4/dist/

RUN cd ~/vidi/public/js/lib/bootstrap-material-design &&\
	npm install

#Add config files from Git repo
COPY conf/vidi/config.js /root/vidi/config/config.js
COPY conf/vidi/_variables.less /root/vidi/config/_variables.less

#Run Grunt
RUN cd ~/vidi &&\
    grunt production

EXPOSE 3000

# Share the source dir
VOLUME  ["/root/vidi"]
