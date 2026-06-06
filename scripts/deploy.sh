#!/usr/bin/env bash
set -euo pipefail

AWS_PROFILE=landing_user \
S3_BUCKET=apps.icube-x.com-465768368057-ap-northeast-2-an \
S3_UPLOAD_MODE=copy \
pnpm deploy:s3
