#!/bin/bash
# Apex Veritas Backend Deployment Script for Ubuntu EC2
# Run this script on your fresh EC2 instance to initialize the API server.

set -e

echo "Starting Apex Veritas API Infrastructure Deployment..."

# 1. Update system & install dependencies
sudo apt-get update
sudo apt-get install -y curl nginx git

# 2. Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 globally
sudo npm install -g pm2

# 4. Clone repository (Replace with your actual GitHub repo URL if it's private, you'll need SSH keys)
echo "Cloning repository..."
cd ~
if [ ! -d "apex-veritas" ]; then
  # Assuming public repo for this template, otherwise use SSH.
  git clone https://github.com/anjelofrancis/apex-veritas.git
fi

cd apex-veritas
git pull origin main

# 5. Install API Dependencies
echo "Installing NPM dependencies..."
npm install
npm install -w packages/api

# 6. Configure NGINX Reverse Proxy
echo "Configuring Nginx..."
sudo cp infrastructure/nginx/api.conf /etc/nginx/sites-available/apexveritas
if [ ! -L /etc/nginx/sites-enabled/apexveritas ]; then
  sudo ln -s /etc/nginx/sites-available/apexveritas /etc/nginx/sites-enabled/
fi
# Remove default nginx site
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 7. Start the API with PM2
echo "Starting Node.js server via PM2..."
cd packages/api
# Generate Prisma Client
npx prisma generate

# REMINDER: The .env file must exist in ~/apex-veritas/packages/api/.env with DATABASE_URL, etc.
# If .env is missing, the API will fail to connect.
if [ ! -f ".env" ]; then
  echo "WARNING: .env file not found in packages/api! PM2 will start, but the app may crash."
  echo "Please create the .env file and run 'pm2 restart apex-veritas-api'."
fi

pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -n 1 | bash

echo "=========================================="
echo "Deployment Complete!"
echo "Your API is now running and managed by PM2."
echo "Accessible via your EC2 Public IP address."
echo "=========================================="
