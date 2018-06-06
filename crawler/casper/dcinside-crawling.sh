#! /bin/sh

# PATH 설정
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
NODE_PATH=/usr/lib/nodejs

cd `dirname $0`
casperjs dcinside-crawling.js
