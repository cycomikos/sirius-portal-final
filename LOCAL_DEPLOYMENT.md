# Local Deployment Guide - Sirius Portal

This guide walks you through deploying the Sirius Portal React application locally on macOS using nginx.

## Prerequisites

- Node.js and npm installed
- Homebrew installed
- macOS terminal access

## Quick Start (For Next Time)

### Option 1: Vite Preview (Recommended)
```bash
npm run build
npm run preview
```
Access at: **http://localhost:4173** (or next available port)

### Option 2: nginx Server
```bash
npm run build
nginx -c /Volumes/MyProjects/Petronas/Sirius/sirius-portal-final/nginx-local.conf
```
Access at: **http://localhost:8081**

To stop nginx: `nginx -s stop`

## Step-by-Step Deployment

### 1. Install nginx

```bash
brew install nginx
```

### 2. Build the Application

Navigate to your project directory and build the production version:

```bash
cd /Volumes/MyProjects/Petronas/Sirius/sirius-portal-final
npm install
npm run build
```

This creates a `dist/` folder with your built application.

### 3. Configure nginx

The project includes a local nginx configuration file: `nginx-local.conf`

This configuration:
- Serves the app on port 3000
- Handles SPA routing (serves `index.html` for all routes)
- Includes basic security headers
- Enables gzip compression
- Caches static assets

### 4. Test nginx Configuration

```bash
sudo nginx -t -c /Volumes/MyProjects/Petronas/Sirius/sirius-portal-final/nginx-local.conf
```

You should see: `nginx: configuration file ... test is successful`

### 5. Start nginx

```bash
sudo nginx -c /Volumes/MyProjects/Petronas/Sirius/sirius-portal-final/nginx-local.conf
```

### 6. Access Your Application

Open your browser and navigate to:
**http://localhost:3000**

## Managing Your Deployment

### Stop the Server
```bash
sudo nginx -s stop
```

### Restart After Code Changes
```bash
npm run build
sudo nginx -s reload
```

### Check if nginx is Running
```bash
ps aux | grep nginx
```

### Kill All nginx Processes (if needed)
```bash
sudo pkill nginx
```

## Development vs Production

### Development Mode (Hot Reload)
For development with live updates:
```bash
npm run dev
```
This typically runs on port 5173 with hot reload.

### Production Mode (nginx)
For testing the production build locally:
```bash
nginx -c /Volumes/MyProjects/Petronas/Sirius/sirius-portal-final/nginx-local.conf
```
This serves the built files from the `dist/` folder on port 8081.

## Troubleshooting

### Port Already in Use
If port 3000 is busy, edit `nginx-local.conf` and change:
```nginx
listen 3000;
```
to another port like:
```nginx
listen 8080;
```

### Permission Issues
Make sure nginx has read access to your project directory. If needed, adjust file permissions:
```bash
chmod -R 755 /Volumes/MyProjects/Petronas/Sirius/sirius-portal-final/dist
```

### nginx Won't Start
Check nginx error logs:
```bash
tail -f /opt/homebrew/var/log/nginx/error.log
```

## File Structure

```
sirius-portal-final/
├── dist/                 # Built application files
├── nginx-local.conf      # Local nginx configuration
├── package.json          # Project dependencies
└── src/                  # Source code
```

## Security Notes

The local configuration includes basic security headers but is simplified for development. For production deployment, use the full `nginx.conf` with SSL and enhanced security settings.

## Next Steps

- For production deployment, configure SSL certificates
- Set up a proper domain name
- Configure firewall rules
- Set up monitoring and logging
- Consider using a process manager like PM2 for Node.js applications