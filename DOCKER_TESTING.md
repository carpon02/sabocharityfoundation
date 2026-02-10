# Docker Deployment Testing Guide

## Prerequisites

- ✅ Docker and Docker Compose installed
- ✅ All `.env` files configured
- ✅ Dev servers stopped (to free up ports)

---

## Step 1: Stop Development Servers

Before running Docker, stop all running dev servers:

```bash
# In each terminal running npm run dev, press Ctrl+C
# Or close the terminals
```

**Verify ports are free:**

```bash
# Windows PowerShell
netstat -ano | findstr ":5000"
netstat -ano | findstr ":5173"
netstat -ano | findstr ":5174"

# Should return nothing if ports are free
```

---

## Step 2: Build Docker Images

### Using Makefile (Recommended):

```bash
make build
```

### Or using Docker Compose directly:

```bash
docker-compose up --build -d
```

### What This Does:

- Builds multi-stage Docker images for:
  - Frontend (with Nginx)
  - Admin (with Nginx)
  - Backend (Node.js)
- Pulls MongoDB image
- Creates network for inter-service communication

### Expected Output:

```
[+] Building 45.2s (frontend)
[+] Building 42.1s (admin)
[+] Building 38.7s (backend)
[+] Running 4/4
 ✔ Network charity_project_default  Created
 ✔ Container mongo                   Started
 ✔ Container backend                 Started
 ✔ Container frontend                Started
 ✔ Container admin                   Started
```

---

## Step 3: Verify Services Are Running

### Check Service Status:

```bash
docker-compose ps
```

### Expected Output:

```
NAME                COMMAND                  SERVICE    STATUS              PORTS
admin               "/docker-entrypoint.…"   admin      Up (healthy)        0.0.0.0:5174->80/tcp
backend             "docker-entrypoint.s…"   backend    Up (healthy)        0.0.0.0:5000->5000/tcp
frontend            "/docker-entrypoint.…"   frontend   Up (healthy)        0.0.0.0:5173->80/tcp
mongo               "docker-entrypoint.s…"   mongo      Up                  0.0.0.0:27017->27017/tcp
```

**Key Points:**

- ✅ All services should show "Up"
- ✅ Backend should show "(healthy)" after ~30 seconds
- ✅ Frontend/Admin should show "(healthy)" after backend is healthy

---

## Step 4: Test Health Checks

### Backend Health Check:

```bash
make health
# Or:
curl http://localhost:5000/health
```

### Expected Response:

```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": "2026-02-10T14:00:00.000Z"
}
```

### Check Docker Health Status:

```bash
docker inspect backend | grep -A 10 Health
```

---

## Step 5: Access Applications

### Frontend:

```
http://localhost:5173
```

### Admin Panel:

```
http://localhost:5174
```

### Backend API:

```
http://localhost:5000/api/v1
```

### Test API Endpoints:

```bash
# Health check
curl http://localhost:5000/health

# API root (should return 404 or API info)
curl http://localhost:5000/api/v1

# Test specific endpoint (example)
curl http://localhost:5000/api/v1/campaigns
```

---

## Step 6: View Logs

### All Services:

```bash
make logs
# Or:
docker-compose logs -f
```

### Specific Service:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f admin
docker-compose logs -f mongo
```

### Check for Errors:

Look for:

- ✅ "Server started on port 5000"
- ✅ "MongoDB connected successfully"
- ✅ No error stack traces
- ✅ Sentry initialization messages

---

## Step 7: Test Inter-Service Communication

### Verify Frontend Can Reach Backend:

1. Open browser: `http://localhost:5173`
2. Open browser console (F12)
3. Check Network tab for API calls
4. Should see requests to `http://localhost:5000/api/v1`

### Verify Backend Can Reach MongoDB:

```bash
# Check backend logs
docker-compose logs backend | grep -i mongo

# Should see: "MongoDB connected successfully"
```

---

## Step 8: Test Nginx Optimizations

### Check Gzip Compression:

```bash
curl -I -H "Accept-Encoding: gzip" http://localhost:5173

# Should see:
# Content-Encoding: gzip
```

### Check Caching Headers:

```bash
curl -I http://localhost:5173/assets/index.js

# Should see:
# Cache-Control: public, max-age=31536000
```

---

## Step 9: Stop Services

### Using Makefile:

```bash
make down
```

### Or using Docker Compose:

```bash
docker-compose down
```

### To Remove Volumes (Clean Slate):

```bash
docker-compose down -v
```

---

## Troubleshooting

### Services Won't Start

**Check logs:**

```bash
docker-compose logs
```

**Common issues:**

- Port already in use (stop dev servers)
- Missing `.env` files
- Invalid environment variables

### Backend Shows "Unhealthy"

**Check health endpoint:**

```bash
curl http://localhost:5000/health
```

**Check backend logs:**

```bash
docker-compose logs backend
```

**Common causes:**

- MongoDB not connected
- Missing environment variables
- Application crashed on startup

### Frontend/Admin Can't Reach Backend

**Check network:**

```bash
docker network ls
docker network inspect charity_project_default
```

**Verify backend is accessible:**

```bash
docker exec -it frontend curl http://backend:5000/health
```

### Build Fails

**Clear Docker cache:**

```bash
docker-compose build --no-cache
```

**Check Dockerfile syntax:**

```bash
docker-compose config
```

### MongoDB Connection Issues

**Check MongoDB is running:**

```bash
docker-compose ps mongo
```

**Check MongoDB logs:**

```bash
docker-compose logs mongo
```

**Test MongoDB connection:**

```bash
docker exec -it mongo mongosh
```

---

## Verification Checklist

- [ ] All Docker images built successfully
- [ ] All 4 services are running
- [ ] Backend shows "healthy" status
- [ ] Frontend/Admin show "healthy" status
- [ ] Health endpoint returns 200 OK
- [ ] Frontend accessible at :5173
- [ ] Admin accessible at :5174
- [ ] Backend API accessible at :5000
- [ ] MongoDB connected successfully
- [ ] Gzip compression enabled
- [ ] Caching headers present
- [ ] No errors in logs
- [ ] Inter-service communication works

---

## Performance Benchmarks

### Image Sizes (Expected):

- Frontend: ~50-100 MB (multi-stage)
- Admin: ~50-100 MB (multi-stage)
- Backend: ~200-300 MB (with dependencies)
- MongoDB: ~700 MB (official image)

### Startup Times (Expected):

- MongoDB: 5-10 seconds
- Backend: 10-15 seconds (waiting for MongoDB)
- Frontend: 2-5 seconds (after backend healthy)
- Admin: 2-5 seconds (after backend healthy)

---

## Next Steps After Verification

Once all Docker tests pass:

1. ✅ Mark Docker testing as complete
2. 🔄 Consider deploying to staging environment
3. 🔄 Set up production environment variables
4. 🔄 Configure SSL certificates for production
5. 🔄 Set up monitoring and alerts
