#!/bin/bash
export SESSION_SECRET=edupair_secret_key
export NODE_ENV=development

# Setup database if needed
npm run db:push

# Start the application
npm run dev