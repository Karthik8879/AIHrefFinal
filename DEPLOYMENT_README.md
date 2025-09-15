# AIHref Deployment Setup

This deployment setup follows the same pattern as GregMatPlusMaster and includes all necessary components for a production-ready deployment.

## Architecture

- **Frontend**: Next.js application (AIHrefFrontend)
- **Backend**: Spring Boot application (AIHrefBackend)
- **Nginx**: Reverse proxy and load balancer
- **Cloudflared**: Cloudflare tunnel for secure access

## Prerequisites

1. Docker and Docker Compose installed
2. Cloudflare account with tunnel access
3. Domain name (aihref.com) configured in Cloudflare

## Setup Instructions

### 1. Cloudflare Tunnel Setup

1. Install cloudflared locally:
   ```bash
   # macOS
   brew install cloudflared
   
   # Or download from https://github.com/cloudflare/cloudflared/releases
   ```

2. Login to Cloudflare:
   ```bash
   cloudflared tunnel login
   ```

3. Create a new tunnel:
   ```bash
   cloudflared tunnel create aihref-tunnel
   ```

4. Update the tunnel configuration:
   - Replace `YOUR_TUNNEL_ID_HERE` in `cloudflared/config.yml` with your actual tunnel ID
   - Replace `YOUR_TUNNEL_ID_HERE.json` filename with your actual tunnel ID
   - Update the credentials file with your actual tunnel credentials

5. Configure DNS:
   ```bash
   cloudflared tunnel route dns aihref-tunnel aihref.com
   cloudflared tunnel route dns aihref-tunnel www.aihref.com
   ```

### 2. Environment Configuration

Update the following files with your specific configuration:

- `docker-compose.yml`: Update domain names if different from aihref.com
- `nginx/conf.d/default.conf`: Update server_name if using different domains
- `cloudflared/config.yml`: Update hostname entries

### 3. Backend Configuration

Ensure your Spring Boot application has:
- Health check endpoint at `/actuator/health`
- CORS configuration for the frontend domain
- Production profile configuration

### 4. Frontend Configuration

The frontend is configured to:
- Use `http://backend:8080` for API calls
- Build with production optimizations
- Run on port 3000

## Deployment Commands

### Start the application:
```bash
npm start
# or
docker-compose up -d
```

### Stop the application:
```bash
npm run stop
# or
docker-compose down
```

### View logs:
```bash
npm run logs
# or
docker-compose logs -f
```

### Rebuild and restart:
```bash
npm run rebuild
# or
docker-compose down && docker-compose build && docker-compose up -d
```

## Service URLs

- **Frontend**: http://localhost:3000 (internal), https://aihref.com (external)
- **Backend API**: http://localhost:8080/api (internal), https://aihref.com/api (external)
- **Nginx**: http://localhost:80 (internal)

## Health Checks

All services include health checks:
- Frontend: `curl -f http://localhost:3000`
- Backend: `curl -f http://localhost:8080/actuator/health`
- Nginx: `curl -f http://localhost:80`

## Troubleshooting

1. **Check service status**:
   ```bash
   docker-compose ps
   ```

2. **View service logs**:
   ```bash
   docker-compose logs [service-name]
   ```

3. **Test connectivity**:
   ```bash
   # Test frontend
   curl http://localhost:3000
   
   # Test backend
   curl http://localhost:8080/actuator/health
   
   # Test nginx
   curl http://localhost:80
   ```

4. **Cloudflare tunnel issues**:
   - Verify tunnel credentials
   - Check DNS configuration
   - Ensure tunnel is running: `cloudflared tunnel list`

## Security Notes

- All services run as non-root users
- SSL/TLS is handled by Cloudflare
- CORS is configured for production domains
- Health checks are enabled for monitoring

## Monitoring

The deployment includes health checks for all services. You can monitor the application using:
- Docker health check status
- Cloudflare analytics
- Application logs via `docker-compose logs`
