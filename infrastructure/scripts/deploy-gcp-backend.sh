#!/bin/bash
# Apex Veritas Backend Deployment Script for Google Cloud Run
# This script builds the Docker image and deploys it to Cloud Run.

set -e

# Configuration
PROJECT_ID="apexveritas"
REGION="us-central1"
SERVICE_NAME="apex-veritas-api"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "Starting Apex Veritas API GCP Deployment..."

# 1. Build the Docker image using Cloud Build
echo "Submitting build to Google Cloud Build..."
gcloud builds submit --tag $IMAGE_NAME .

# 2. Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances apexveritas:us-central1:apex-db \
  --set-env-vars="NODE_ENV=production" \
  --set-secrets="DATABASE_URL=DATABASE_URL:latest,JWT_ACCESS_SECRET=JWT_ACCESS_SECRET:latest,JWT_REFRESH_SECRET=JWT_REFRESH_SECRET:latest"

# Note: You should have created these secrets in Google Secret Manager beforehand.

echo "=========================================="
echo "Deployment Complete!"
echo "Your API is now running on Google Cloud Run."
echo "=========================================="
