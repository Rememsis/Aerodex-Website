#!/usr/bin/env bash
# Sets Netlify environment variables for AeroDex (requires Netlify CLI & login)
# Optionally pass SITE_ID as first argument to target a specific Netlify site.
SITE_ID="$1"
SFLAG=""
if [ -n "$SITE_ID" ]; then
  SFLAG="--site $SITE_ID"
fi

# Read values from environment to avoid embedding secrets in the script.
# Export these variables in your shell or set them in a local .env (not committed).
CLIENT_ID="${ROBLOX_CLIENT_ID:-}"
CLIENT_SECRET="${ROBLOX_CLIENT_SECRET:-}"
SESSION_SECRET_VAL="${SESSION_SECRET:-}"
# FIXED: Updated default fallback URL to match the live backend serverless function path
REDIRECT_URI="${ROBLOX_REDIRECT_URI:-https://netlify.app}"

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ] || [ -z "$SESSION_SECRET_VAL" ]; then
  echo "Missing one or more required environment variables: ROBLOX_CLIENT_ID, ROBLOX_CLIENT_SECRET, SESSION_SECRET"
  echo "Set them in your shell or use a local .env and 'export' before running this script."
  exit 1
fi

netlify env:set $SFLAG ROBLOX_CLIENT_ID "$CLIENT_ID"
netlify env:set $SFLAG ROBLOX_CLIENT_SECRET "$CLIENT_SECRET"
netlify env:set $SFLAG SESSION_SECRET "$SESSION_SECRET_VAL"
netlify env:set $SFLAG ROBLOX_REDIRECT_URI "$REDIRECT_URI"

echo "Done. Use 'netlify env:list $SFLAG' to verify."
