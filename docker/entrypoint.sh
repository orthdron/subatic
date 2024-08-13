#!/bin/sh

# Check if ENABLE_TUNNEL is set to true
if [ "${ENABLE_TUNNEL}" = "true" ]; then
    # Remove the scheme (http:// or https://) and extract the host from RAWFILES_S3_ENDPOINT
    RAWFILES_S3_HOST=$(echo "$RAWFILES_S3_ENDPOINT" | sed -E 's|^https?://||; s|/.*||')

    # Replace placeholders in the Nginx config with the actual endpoint and host
    if ! sed "s|\$RAWFILES_S3_ENDPOINT|${RAWFILES_S3_ENDPOINT}|g" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf; then
        echo "Failed to generate Nginx config."
        exit 1
    fi
    
    if ! sed -i "s|\$RAWFILES_S3_HOST|${RAWFILES_S3_HOST}|g" /etc/nginx/conf.d/default.conf; then
        echo "Failed to generate Nginx config."
        exit 1
    fi

    # Output the generated config for debugging
    # cat /etc/nginx/conf.d/default.conf;

    service nginx start
else
    echo "Disabling Nginx as ENABLE_TUNNEL is not true."
    # Stop Nginx if it is running
    if pidof nginx > /dev/null; then
        service nginx stop || { echo "Failed to stop Nginx."; exit 1; }
    else
        echo "Nginx is not running."
    fi
fi

# Start the Node.js application
cd /app || { echo "Failed to change directory to /app"; exit 1; }
npx next telemetry disable || { echo "Failed to disable telemetry"; exit 1; }
npm run migrate || { echo "Migration failed"; exit 1; }
npm run start || { echo "Failed to start Node.js application"; exit 1; }
