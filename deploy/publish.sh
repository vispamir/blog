#!/usr/bin/env bash
set -euo pipefail

cd /opt/koulivand/blog

docker compose -p koulivand -f docker-compose.yml up -d

conf_dir="$(docker inspect nginx --format '{{range .Mounts}}{{if eq .Destination "/etc/nginx/conf.d"}}{{.Source}}{{end}}{{end}}')"
if [[ -z "${conf_dir}" || ! -d "${conf_dir}" ]]; then
  echo "nginx conf.d mount was not found" >&2
  exit 1
fi

install -m 644 proxy.conf "${conf_dir}/koulivand.conf"
docker exec nginx nginx -t
docker exec nginx nginx -s reload

for _ in $(seq 1 30); do
  if curl -fsS -H "Host: koulivand.ir" http://127.0.0.1/ | grep -q "امیر کولیوند"; then
    echo "koulivand.ir is serving the blog"
    exit 0
  fi
  sleep 1
done

echo "blog did not become reachable" >&2
docker logs --tail 40 koulivand-blog || true
exit 1
