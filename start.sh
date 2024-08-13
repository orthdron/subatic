#!/bin/sh
# Rebuild platform-specific dependencies if necessary
npm rebuild

# Start the application
exec npm start