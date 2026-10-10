# Redeploy Apex Veritas to Azure (API to Container Apps, frontends to Storage static websites).
# Usage:  .\infrastructure\scripts\deploy-azure.ps1 [-Api] [-Frontends]   (no switches = both)
# Requires: Azure CLI (logged in) and Docker Desktop running. Azure for Students blocks
# ACR Tasks, so the image is built locally and pushed.
param([switch]$Api, [switch]$Frontends)
$ErrorActionPreference = 'Stop'
if (-not $Api -and -not $Frontends) { $Api = $true; $Frontends = $true }

$RG     = 'rg-apex-veritas'
$SUFFIX = 'p50ai'
$ACR    = "apexveritas$SUFFIX"
$APP    = 'apex-veritas-api'

# Call the CLI's python directly: az.cmd mangles arguments containing '&'.
$py = 'C:\Program Files\Microsoft SDKs\Azure\CLI2\python.exe'
function az { & $py -IBm azure.cli @args; if ($LASTEXITCODE) { throw "az $($args[0..1] -join ' ') failed" } }

$root = Resolve-Path "$PSScriptRoot\..\.."
Push-Location $root
try {
  if ($Api) {
    $tag   = git rev-parse --short HEAD
    $image = "$ACR.azurecr.io/${APP}:$tag"
    az acr login -n $ACR
    docker build -t $image .
    docker push $image
    az containerapp update -g $RG -n $APP --image $image --query properties.latestRevisionName -o tsv
  }

  if ($Frontends) {
    foreach ($site in 'web', 'portal', 'landing') {
      npm run build --workspace=packages/$site
      $acct = "apexv$site$SUFFIX"
      $key  = az storage account keys list -g $RG -n $acct --query '[0].value' -o tsv
      az storage blob upload-batch --account-name $acct --account-key $key -d '$web' -s "packages/$site/dist" --overwrite -o none
      Write-Host "$site -> https://$acct.z1.web.core.windows.net/"
    }
  }
} finally { Pop-Location }
