#!/bin/bash
# Apex Veritas Frontend GCP Deployment Script
# This script builds the React SPAs and syncs them to your Google Cloud Storage buckets.

set -e

# Configuration - Replace these with your actual GCS bucket names
WEB_BUCKET="gs://apexveritas-web-prod"
PORTAL_BUCKET="gs://apexveritas-portal-prod"

echo "Building and deploying Apex Veritas Frontends..."

# 1. Build and Deploy Web
echo "Building Marketing Web (packages/web)..."
npm run build -w packages/web

echo "Syncing Web to GCS ($WEB_BUCKET)..."
gcloud storage rsync packages/web/dist $WEB_BUCKET --recursive --delete-unmatched-destination-objects

# 2. Build and Deploy Portal
echo "Building Client Portal (packages/portal)..."
npm run build -w packages/portal

echo "Syncing Portal to GCS ($PORTAL_BUCKET)..."
gcloud storage rsync packages/portal/dist $PORTAL_BUCKET --recursive --delete-unmatched-destination-objects

# 3. Optional: Configure bucket to act as a website
# This only needs to be run once, but included here for completeness
# gcloud storage buckets update $WEB_BUCKET --web-main-page-suffix=index.html --web-error-page=index.html
# gcloud storage buckets update $PORTAL_BUCKET --web-main-page-suffix=index.html --web-error-page=index.html

echo "Frontend Deployment Complete!"
