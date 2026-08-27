#!/bin/bash
# Deploy infosec portfolio to VPS
# Usage: ./deploy-vps.sh

set -e

echo "🔨 Building Hugo site..."
hugo --gc --minify --cleanDestinationDir

echo "📤 Deploying to VPS..."
rsync -avz --delete -e "ssh -i ~/.ssh/finalkey" public/ root@45.128.75.202:/var/www/mahmoudouf.com/

echo "✅ Deployment complete!"
echo "🌐 Site live at: https://mahmoudouf.com"
