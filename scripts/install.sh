#!/bin/bash

BUILD_DIR=/tmp/nginx
STICKY_MODULE_VERSION=1.2.5
NGINX_VERSION=1.4.7
PREFIX=/opt/nginx
NGINX_USER=nginx

#remove the lock
set +e
sudo rm /var/lib/dpkg/lock > /dev/null
sudo rm /var/cache/apt/archives/lock > /dev/null
sudo dpkg --configure -a
set -e

# creating a non-privileged user
sudo useradd $NGINX_USER || :

# install dependencies
sudo apt-get -y install libpcre3-dev libssl-dev build-essential

# start building process

rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR
cd $BUILD_DIR

# download sticky-module
sudo wget https://bitbucket.org/nginx-goodies/nginx-sticky-module-ng/get/$STICKY_MODULE_VERSION.tar.gz
sudo tar xvzf $STICKY_MODULE_VERSION.tar.gz
sudo mv nginx-goodies-nginx-sticky-module-ng-* nginx-sticky-module

# download nginx
sudo wget http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz
tar xvzf nginx-$NGINX_VERSION.tar.gz

# building
cd nginx-$NGINX_VERSION
sudo ./configure \
  --prefix=$PREFIX --user=$NGINX_USER --group=$NGINX_USER \
  --with-http_ssl_module --without-http_scgi_module \
  --without-http_uwsgi_module --without-http_fastcgi_module \
  --add-module=$BUILD_DIR/nginx-sticky-module

sudo make install
