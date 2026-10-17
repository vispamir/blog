#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
image="koulivand/blog:production"
container="koulivand-blog"
expected="$(docker image inspect "$image" --format '{{.Id}}')"
directory="/opt/koulivand/blog"
mkdir -p "$directory"
install -m 644 docker-compose.yml "$directory/docker-compose.yml"
install -m 644 proxy.conf "$directory/proxy.conf"
rm -rf "$directory/html" "$directory/nginx.conf" "$directory/publish.sh"

conf_dir="$(docker inspect nginx --format '{{range .Mounts}}{{if eq .Destination "/etc/nginx/conf.d"}}{{.Source}}{{end}}{{end}}')"
if [[ -z "${conf_dir}" || ! -d "${conf_dir}" ]]; then
  echo "nginx conf.d mount was not found" >&2
  exit 1
fi
install -m 644 proxy.conf "${conf_dir}/koulivand.conf"
docker exec nginx nginx -t
docker exec nginx nginx -s reload

current="$(docker inspect "$container" --format '{{.Config.Image}}' 2>/dev/null || true)"
if [[ -n "$current" && "$current" != koulivand/blog:* ]]; then
  docker rm -f "$container"
fi

# Compose creates the container only when it is missing. Watchtower replaces it after the local production tag moves.
docker compose -p koulivand -f "$directory/docker-compose.yml" up -d --no-build --pull never --no-recreate

for _ in $(seq 1 90); do
  actual="$(docker inspect "$container" --format '{{.Image}}' 2>/dev/null || true)"
  health="$(docker inspect "$container" --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' 2>/dev/null || true)"
  if [[ "$actual" == "$expected" && "$health" == healthy ]] && curl -fsS -H "Host: koulivand.ir" http://127.0.0.1/ | grep -q "امیر کولیوند"; then
    echo "$container is healthy on $expected"
    exit 0
  fi
  sleep 2
done

docker inspect "$container" --format '{{json .State}}' || true
docker logs --tail 80 "$container" || true
echo "Timed out waiting for Watchtower to deploy the built image" >&2
exit 1
