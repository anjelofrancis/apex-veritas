$ErrorActionPreference = "Stop"

$WEB_BUCKET = "s3://apex-veritas"
$PORTAL_BUCKET = "s3://apex-veritas-portal"

Write-Host "Building and deploying Apex Veritas Frontends..."

Write-Host "Building Marketing Web (packages/web)..."
npm run build -w packages/web

Write-Host "Syncing Web to S3 ($WEB_BUCKET)..."
aws s3 sync packages/web/dist $WEB_BUCKET --delete

Write-Host "Building Client Portal (packages/portal)..."
npm run build -w packages/portal

Write-Host "Syncing Portal to S3 ($PORTAL_BUCKET)..."
aws s3 sync packages/portal/dist $PORTAL_BUCKET --delete

Write-Host "Frontend Deployment Complete!"
