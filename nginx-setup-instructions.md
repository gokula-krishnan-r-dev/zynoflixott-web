# Nginx Configuration for Zynoflix OTT Platform

Follow these steps to configure Nginx to handle large file uploads for the Zynoflix application.

## 1. Install Nginx (if not already installed)

```bash
sudo apt update
sudo apt install nginx
```

## 2. Configure Nginx

### Step 1: Edit the main Nginx configuration

```bash
sudo nano /etc/nginx/nginx.conf
```

Replace the content with the following or merge the important settings:

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Set a higher value for client_max_body_size
    client_max_body_size 100M;

    # Optimize for file uploads
    client_body_buffer_size 100M;
    client_body_timeout 300s;
    
    # Logging settings
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip settings
    gzip on;
    gzip_disable "msie6";
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Include server configurations
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### Step 2: Create a site-specific configuration

```bash
sudo nano /etc/nginx/sites-available/zynoflix-site.conf
```

Add the following content:

```nginx
server {
    listen 80;
    server_name zynoflixott.com www.zynoflixott.com;

    # Root directory and index file
    root /home/ubuntu/zynoflix-ott-web;
    index index.html;

    # Set client max body size for this specific server
    client_max_body_size 100M;

    # Handle API requests with increased timeout and body size
    location /api/upload/media {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Specific settings for file uploads
        client_max_body_size 100M;
        client_body_buffer_size 100M;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
    }

    # Handle all other requests
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files directly
    location /_next/static {
        alias /home/ubuntu/zynoflix-ott-web/.next/static;
        expires 365d;
        access_log off;
    }

    # Error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### Step 3: Enable the site configuration

```bash
sudo ln -s /etc/nginx/sites-available/zynoflix-site.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site if needed
```

### Step 4: Test and reload Nginx

```bash
# Test the configuration
sudo nginx -t

# If the test is successful, reload Nginx
sudo systemctl reload nginx
```

## 3. Verify the Changes

After making these changes, try uploading a large file to test if the issue is resolved.

## 4. Troubleshooting

If you still encounter issues, check the Nginx error logs:

```bash
sudo tail -f /var/log/nginx/error.log
```

You might also need to adjust the systemd service timeout if Nginx is managed by systemd:

```bash
sudo systemctl edit nginx
```

Add the following content:

```
[Service]
TimeoutStartSec=300
TimeoutStopSec=300
```

Save and reload systemd:

```bash
sudo systemctl daemon-reload
``` 