#!/usr/bin/env bash
# validate-api-contract.sh — enforces versioned API endpoints and Swagger coverage
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
INDEX_FILE="${ROOT}/server/src/index.ts"
SWAGGER_FILE="${ROOT}/server/swagger/swagger.json"

fail() {
  echo "API CONTRACT FAIL: $*" >&2
  exit 1
}

[[ -f "$INDEX_FILE" ]] || fail "missing server/src/index.ts"
[[ -f "$SWAGGER_FILE" ]] || fail "missing server/swagger/swagger.json"

if grep -Eq "app\.use\([[:space:]]*['\"]\/api['\"]" "$INDEX_FILE"; then
  fail "feature routes must be mounted under /api/v1 or a later version, not bare /api"
fi

if ! grep -Eq "app\.use\([[:space:]]*['\"]\/api\/v[0-9]+['\"]" "$INDEX_FILE"; then
  fail "server/src/index.ts must mount feature routes under a versioned prefix such as /api/v1"
fi

node --input-type=module - "$SWAGGER_FILE" <<'NODE'
import fs from 'node:fs';

const swaggerPath = process.argv[2];
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
const basePath = typeof swagger.basePath === 'string' ? swagger.basePath : '';
const paths = swagger.paths && typeof swagger.paths === 'object' ? Object.keys(swagger.paths) : [];
const baseIsVersioned = /^\/api\/v\d+$/.test(basePath);
const allowedSystemPaths = new Set(['/health', '/']);

if (!baseIsVersioned && basePath !== '/api') {
  throw new Error(`Swagger basePath must be /api/vN for feature APIs; found ${basePath || '<missing>'}`);
}

for (const routePath of paths) {
  if (allowedSystemPaths.has(routePath)) {
    continue;
  }

  if (baseIsVersioned) {
    if (!routePath.startsWith('/')) {
      throw new Error(`Swagger path must start with /: ${routePath}`);
    }
    continue;
  }

  if (!/^\/v\d+(\/|$)/.test(routePath)) {
    throw new Error(`Swagger feature path must be versioned when basePath is /api: ${routePath}`);
  }
}
NODE

echo "API CONTRACT OK: backend routes are versioned and Swagger paths are compatible"
