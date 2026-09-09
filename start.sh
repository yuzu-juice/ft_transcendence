#!/usr/bin/env bash

set -eu

docker compose --env-file .env.prod up
