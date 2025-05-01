#!/bin/bash
set -e
set -o pipefail

source scripts/config

if [ -z $server ]; then
  echo >&2 "Error: server is not set in scripts/config"
  exit 1
fi

if [ -z $project_dir ]; then
  echo >&2 "Error: project_dir is not set in scripts/config"
  exit 1
fi

npm run build

rsync -SavLP \
  package.json \
  public \
  dist \
  $server:$project_dir

ssh $server "
source ~/.nvm/nvm.sh && \
cd $project_dir && \
pnpm install && \
cp .env dist/.env && \
cd dist && \
npx knex migrate:latest
cd .. && \
node dist/src/seed.js && \
pm2 restart dae-mobile-assignment
"
