# Run this script with:
#
#  scalingo --region osc-secnum-fr1 -a pix-int-to-bigint-test run --silent -s XL "base64 -d <<<'$((cat ./scripts/rewrite-ke.sh; echo 'exec < /dev/tty')|base64)'|bash -i"

set -e
userinstall() {
  local pkg=$1
  apt-get -qq download $pkg
  dpkg --extract $pkg_*.deb /tmp/$pkg
  mkdir -p /app/bin
  mv /tmp/$pkg/usr/bin/* /app/bin
}
userinstall pv
dbclient-fetcher psql 12
set +e

limit=$((900 * 1000 * 1000))

fixed_columns='source, status, "answerId", "assessmentId", "skillId", "createdAt", "earnedPix", "competenceId"'

source_query='(SELECT lpad("userId"::text, 10), lpad(id::text, 12), '$fixed_columns' FROM "knowledge-elements" LIMIT '$limit')'

create_query='
  DROP TABLE IF EXISTS ke_sorted;
  CREATE TABLE "ke_sorted" (
      id bigint NOT NULL,
      "userId" integer,
      source character varying(255),
      status character varying(255),
      "answerId" bigint,
      "assessmentId" integer,
      "skillId" character varying(255),
      "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "earnedPix" real DEFAULT '0'::real NOT NULL,
      "competenceId" character varying(255)
  );'
target_query='COPY ke_sorted("userId", id, '$fixed_columns') FROM STDIN'

tmpdir=/tmp/sort-tmp
mkdir -p $tmpdir

# set -euo pipefail

psql $SCALINGO_POSTGRESQL_URL -c "$create_query"

time psql $SCALINGO_POSTGRESQL_URL -c "COPY $source_query TO STDOUT" \
  | pv --name "COPY_OUT" --interval 10 --line-mode -F '%N %t %b %r %a %b %e' -s $limit --force 2>pv.out \
  | LC_ALL=C GZIP=--fast sort --temporary-directory=$tmpdir --compress-program='gzip' \
    --batch-size=1024 --parallel=8 --buffer-size=1G \
  | pv --name "COPY_IN" --interval 10 --line-mode -F '%N %t %b %r %a %b %e' -s $limit --force 2>pv2.out \
  | psql $SCALINGO_POSTGRESQL_URL -c "$target_query" &

sleep 1

shopt -s nullglob
while ps u -C sort ; do
  tr '\r' '\n' < pv.out | tail -1
  tr '\r' '\n' < pv2.out | tail -1
  if [ -n "$(echo $tmpdir/*)" ]; then du -h $tmpdir/*; fi
  df -h /tmp
  sleep 10;
done
