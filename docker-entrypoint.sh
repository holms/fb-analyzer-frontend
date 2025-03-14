#!/bin/bash
set -e

# Generate runtime config.js with environment variables
# This allows us to change environment variables without rebuilding the image
echo "window.env = {" > /usr/share/nginx/html/config/config.js
echo "  REACT_APP_API_BASE_URL: \"${REACT_APP_API_BASE_URL:-http://localhost:8000}\"," >> /usr/share/nginx/html/config/config.js
echo "  REACT_APP_FACEBOOK_API_VERSION: \"${REACT_APP_FACEBOOK_API_VERSION:-v18.0}\"," >> /usr/share/nginx/html/config/config.js
echo "  REACT_APP_FACEBOOK_APP_ID: \"${REACT_APP_FACEBOOK_APP_ID:-}\"" >> /usr/share/nginx/html/config/config.js
echo "};" >> /usr/share/nginx/html/config/config.js

# Execute the CMD
exec "$@"
