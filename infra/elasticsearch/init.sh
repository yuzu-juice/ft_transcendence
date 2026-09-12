#!/usr/bin/env bash

set -eu

chown 1000:0 /usr/share/elasticsearch/snapshots

es() {
	curl -sS --fail-with-body --retry 10 --retry-delay 10 --retry-all-errors \
		-u "elastic:$ELASTIC_PASSWORD" -H "Content-Type: application/json" \
		-X PUT "http://elasticsearch:9200$1" -d @-
}

es /_security/user/kibana_system/_password <<EOF
{ "password": "$KIBANA_PASSWORD" }
EOF

es /_component_template/logs@custom <<'EOF'
{
  "template": {
    "settings": { "index.lifecycle.prefer_ilm": false },
    "lifecycle": { "data_retention": "7d" }
  }
}
EOF

es /_snapshot/logs <<'EOF'
{ "type": "fs", "settings": { "location": "logs" } }
EOF

es /_slm/policy/logs <<'EOF'
{
  "schedule": "0 0 1 * * ?",
  "name": "<logs-{now/d}>",
  "repository": "logs",
  "config": { "indices": "logs-*-*", "include_global_state": false },
  "retention": { "expire_after": "30d" }
}
EOF
