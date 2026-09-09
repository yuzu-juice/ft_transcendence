#!/usr/bin/env bash

set -eu

./scripts/generate-cert.sh

docker compose --env-file .env.prod up
