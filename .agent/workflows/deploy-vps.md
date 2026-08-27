---
description: Deploy Hugo site to VPS (mahmoudouf.com)
---

# Deploy to VPS Workflow

// turbo-all

## Prerequisites
- SSH access to VPS configured
- Hugo installed locally
- Domain DNS pointing to VPS IP

## Steps

1. Build the Hugo site:
```bash
hugo --minify
```

2. Create the site directory on VPS:
```bash
ssh admin@mybabe.vps.webdock.cloud "sudo mkdir -p /var/www/mahmoudouf.com && sudo chown admin:admin /var/www/mahmoudouf.com"
```

3. Deploy the built site:
```bash
rsync -avz --delete public/ admin@mybabe.vps.webdock.cloud:/var/www/mahmoudouf.com/
```

4. Create Nginx configuration:
```bash
ssh admin@mybabe.vps.webdock.cloud "sudo tee /etc/nginx/sites-available/mahmoudouf.com > /dev/null << 'EOF'
server {
    listen 80;
    server_name mahmoudouf.com www.mahmoudouf.com;
    root /var/www/mahmoudouf.com;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF"
```

5. Enable the site:
```bash
ssh admin@mybabe.vps.webdock.cloud "sudo ln -sf /etc/nginx/sites-available/mahmoudouf.com /etc/nginx/sites-enabled/"
```

6. Test and reload Nginx:
```bash
ssh admin@mybabe.vps.webdock.cloud "sudo nginx -t && sudo systemctl reload nginx"
```

7. Set up SSL with Certbot:
```bash
ssh admin@mybabe.vps.webdock.cloud "sudo certbot --nginx -d mahmoudouf.com -d www.mahmoudouf.com --non-interactive --agree-tos -m contact@mahmoudouf.com"
```

8. Verify deployment:
```bash
curl -I https://mahmoudouf.com
```
