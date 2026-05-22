#!/usr/bin/env bash
set -euo pipefail

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI is required. Install and configure it before deploying." >&2
  exit 1
fi

bucket="${S3_BUCKET:-}"
prefix="${S3_PREFIX:-}"
profile="${AWS_PROFILE:-}"
region="${AWS_REGION:-}"
dry_run="${S3_DRY_RUN:-}"
upload_mode="${S3_UPLOAD_MODE:-sync}"

if [[ -z "$bucket" ]]; then
  echo "S3_BUCKET is required. Example: S3_BUCKET=my-bucket pnpm deploy:s3" >&2
  exit 1
fi

target="s3://${bucket}"
if [[ -n "$prefix" ]]; then
  prefix="${prefix#/}"
  prefix="${prefix%/}"
  target="${target}/${prefix}"
fi

aws_args=()
if [[ -n "$profile" ]]; then
  aws_args+=(--profile "$profile")
fi
if [[ -n "$region" ]]; then
  aws_args+=(--region "$region")
fi
if [[ "$dry_run" == "1" || "$dry_run" == "true" ]]; then
  aws_args+=(--dryrun)
fi

run_aws() {
  if [[ ${#aws_args[@]} -gt 0 ]]; then
    aws "$@" "${aws_args[@]}"
  else
    aws "$@"
  fi
}

pnpm build

if [[ "$upload_mode" == "copy" ]]; then
  run_aws s3 cp dist "$target" \
    --recursive \
    --exclude "index.html" \
    --cache-control "public,max-age=31536000,immutable"
else
  run_aws s3 sync dist "$target" \
    --delete \
    --exclude "index.html" \
    --cache-control "public,max-age=31536000,immutable"
fi

run_aws s3 cp dist/index.html "$target/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html; charset=utf-8"

echo "Deployed dist to ${target}"
