#!/bin/bash
# Apex Veritas Frontend S3 Deployment Script
# This script builds the React SPAs and syncs them to your AWS S3 buckets.

set -e

# Configuration - Replace these with your actual S3 bucket names
WEB_BUCKET="s3://your-web-bucket-name"
PORTAL_BUCKET="s3://your-portal-bucket-name"

# CloudFront Distribution IDs (Optional - for cache invalidation)
# CLOUDFRONT_WEB_ID="E1XXXXXXXXXXXX"
# CLOUDFRONT_PORTAL_ID="E2XXXXXXXXXXXX"

echo "Building and deploying Apex Veritas Frontends..."

# 1. Build and Deploy Web
echo "Building Marketing Web (packages/web)..."
npm run build -w packages/web

echo "Syncing Web to S3 ($WEB_BUCKET)..."
aws s3 sync packages/web/dist $WEB_BUCKET --delete

# 2. Build and Deploy Portal
echo "Building Client Portal (packages/portal)..."
npm run build -w packages/portal

echo "Syncing Portal to S3 ($PORTAL_BUCKET)..."
aws s3 sync packages/portal/dist $PORTAL_BUCKET --delete

# 3. Optional: Invalidate CloudFront Cache
# if [ ! -z "$CLOUDFRONT_WEB_ID" ]; then
#   echo "Invalidating CloudFront cache for Web..."
#   aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_WEB_ID --paths "/*"
# fi

# if [ ! -z "$CLOUDFRONT_PORTAL_ID" ]; then
#   echo "Invalidating CloudFront cache for Portal..."
#   aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_PORTAL_ID --paths "/*"
# fi

echo "Frontend Deployment Complete!"
