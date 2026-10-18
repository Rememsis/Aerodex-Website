# PowerShell helper to set Netlify environment variables for AeroDex
param(
    [string]$SiteId
)

$siteArg = ""
if ($SiteId) { $siteArg = "--site $SiteId" }

# Read secrets from environment variables to avoid committing them.
$clientId = $env:ROBLOX_CLIENT_ID
$clientSecret = $env:ROBLOX_CLIENT_SECRET
$sessionSecret = $env:SESSION_SECRET
# FIXED: Updated fallback URL to target the actual Netlify serverless function callback endpoint
$redirectUri = if ($env:ROBLOX_REDIRECT_URI) { $env:ROBLOX_REDIRECT_URI } else { 'https://netlify.app' }

if (-not $clientId -or -not $clientSecret -or -not $sessionSecret) {
    Write-Host "Missing required environment variables: ROBLOX_CLIENT_ID, ROBLOX_CLIENT_SECRET, SESSION_SECRET"
    Write-Host "Set them in your shell or load a local .env (do NOT commit it), then run this script."
    exit 1
}

netlify env:set $siteArg ROBLOX_CLIENT_ID $clientId
netlify env:set $siteArg ROBLOX_CLIENT_SECRET $clientSecret
netlify env:set $siteArg SESSION_SECRET $sessionSecret
netlify env:set $siteArg ROBLOX_REDIRECT_URI $redirectUri

Write-Host "Done. Run 'netlify env:list $siteArg' to verify."
