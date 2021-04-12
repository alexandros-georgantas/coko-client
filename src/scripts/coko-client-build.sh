#!/bin/sh

ORIGINAL_DIR=`pwd -P`
echo $ORIGINAL_DIR

# SOLUTION BECAUSE readlink -f CANNOT WORK ON MACS
# https://stackoverflow.com/a/1116890
TARGET_FILE=$0
cd `dirname $TARGET_FILE`
TARGET_FILE=`basename $TARGET_FILE`
# Iterate down a (possible) chain of symlinks
while [ -L "$TARGET_FILE" ]
do
    TARGET_FILE=`readlink $TARGET_FILE`
    cd `dirname $TARGET_FILE`
    TARGET_FILE=`basename $TARGET_FILE`
done
# Find the physical path for the directory we're in
PHYS_DIR=`pwd -P`
# CONFIG_DIR_PATH=$PHYS_DIR/config


DEFAULT_CONFIG_DIR=$PHYS_DIR/../webpack/webpack.config.js

cd $ORIGINAL_DIR

yarn webpack \
  --config ${WEBPACK_CONFIG_DIR:-$DEFAULT_CONFIG_DIR}
