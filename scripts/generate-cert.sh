#!/usr/bin/env bash

set -eu

CERT_DIR="./secrets/nginx"

mkdir -p "$CERT_DIR"

if [ -f "$CERT_DIR/server.crt" ] && [ -f "$CERT_DIR/server.key" ]; then
	exit 0
fi

openssl genpkey \
    -algorithm RSA \
    -pkeyopt rsa_keygen_bits:4096 \
    -out "$CERT_DIR/server.key"

openssl req \
    -new \
    -x509 \
    -sha256 \
    -days 365 \
    -key "$CERT_DIR/server.key" \
    -out "$CERT_DIR/server.crt" \
    -subj "/C=JP/ST=Tokyo/L=Shinjuku-ku/O=42Tokyo/OU=still_alive/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" \

chmod 600 "$CERT_DIR/server.key"
chmod 644 "$CERT_DIR/server.crt"
