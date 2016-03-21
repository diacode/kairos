#!/bin/bash

# Shell script based on:
# https://cdyer.co.uk/blog/deploying-phoenix-elixir-with-bash-script/

APP="kairos"
REMOTE_USER="deployer"
SERVER="diacode.com"
BUILD_DIR="/home/deployer/elixir_builds/${APP}"
DEPLOY_DIR="/var/www/${APP}.diacode.com/current"
SHARED_DIR="/var/www/${APP}.diacode.com/shared"

############

VERSION=`awk '/version: \"(.*)\"/{ print $2 }' ./mix.exs | cut -d '"' -f2`

deploy() {
  echo -e "Deploying Version ${VERSION}\n"

  ### Clean
  echo -e "--> Cleaning local source tree\n"
  mix clean
  rm -rf priv/images
  rm -rf priv/static/*
  rm priv/server.js
  rm priv/webpack.stats.json
  # ... add any other files here you feel should be removed

  ### Copy current code
  echo -e "--> Uploading sources\n"
  rsync -azq --exclude='.git/' --exclude="_build/" --exclude="deps/" --exclude="app/node_modules" ./ ${REMOTE_USER}@${SERVER}:${BUILD_DIR}

  ### Copy prod.secret.exs
  echo -e "--> Copying shared/prod.config.exs"
  ssh ${REMOTE_USER}@${SERVER} -- "cp ${SHARED_DIR}/prod.secret.exs ${BUILD_DIR}/config"

  ### Build on remote
  echo -e "--> Building on remote\n"
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${BUILD_DIR} && mix deps.get --only prod"
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${BUILD_DIR} && MIX_ENV=prod mix compile"
  echo -e "--> Compiling assets on remote\n"
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${BUILD_DIR}/app && npm install"
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${BUILD_DIR} && cd app && node node_modules/brunch/bin/brunch build --production"
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${BUILD_DIR} && MIX_ENV=prod mix phoenix.digest"
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${BUILD_DIR} && MIX_ENV=prod mix release"

  echo -e "--> Moving release to deployment dir\n"
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${BUILD_DIR} && cp -R rel/${APP}/releases/${VERSION}/${APP}.tar.gz ${DEPLOY_DIR}"
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${DEPLOY_DIR} && tar -xf ${APP}.tar.gz"
}

migrate() {
  echo -e "--> Running migrations\n"
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${BUILD_DIR} && MIX_ENV=prod mix ecto.migrate"
}

upgrade() {
  echo -e "Upgrading to version ${VERSION}\n"
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${DEPLOY_DIR} && bin/${APP} upgrade ${VERSION}"
}

downgrade() {
  echo -e "Not yet implemented"
}

start() {
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${DEPLOY_DIR} && bin/${APP} start"
}

stop() {
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${DEPLOY_DIR} && bin/${APP} stop"
}

restart() {
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${DEPLOY_DIR} && bin/${APP} restart"
}

console() {
  ssh ${REMOTE_USER}@${SERVER} -- "cd ${DEPLOY_DIR} && bin/${APP} remote_console"
}

clean() {
  echo -e "--> Cleaning build dir on remote\n"
  ssh ${REMOTE_USER}@${SERVER} -- "rm -rf ${BUILD_DIR}/*"
}

case "$1" in
  deploy)
    deploy
    ;;
  migrate)
    migrate
    ;;
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    stop
    start
    ;;
  upgrade)
    upgrade
    ;;
  downgrade)
    downgrade
    ;;
  console)
    console
    ;;
  clean)
    clean
    ;;
  *)
    echo "Usage: $0 {deploy|migrate|upgrade|downgrade|stop|start|restart|clean}" >&2
    exit 1
    ;;
esac
