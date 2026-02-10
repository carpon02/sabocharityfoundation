# Sentry Integration Test Script

## ✅ Sentry Configuration Checklist

Before testing, verify:

- [ ] Backend `.env` has `SENTRY_DSN=your_backend_dsn`
- [ ] Frontend `.env` has `VITE_SENTRY_DSN=your_frontend_dsn`
- [ ] Admin `.env` has `VITE_SENTRY_DSN=your_admin_dsn`
- [ ] All dev servers restarted after changes

---

## Test 1: Backend Error Capture

### Step 1: Add Test Endpoint

Add this to `Backend/server.js` after the health check endpoint (around line 19):

```javascript
// Test Sentry Error Capture
app.get("/test-sentry", (req, res) => {
  throw new Error("Backend Sentry Test Error - " + new Date().toISOString());
});
```

### Step 2: Trigger the Error

```bash
# Using curl
curl http://localhost:5000/test-sentry

# Or open in browser:
# http://localhost:5000/test-sentry
```

### Step 3: Verify in Sentry

1. Go to your Sentry Backend project
2. Navigate to **Issues**
3. You should see "Backend Sentry Test Error" within 5-10 seconds
4. Click on it to see stack trace and context

**Expected Result:** ✅ Error appears with full stack trace

---

## Test 2: Frontend Error Capture

### Method A: Browser Console Test

1. Open http://localhost:5173 in your browser
2. Press F12 to open Developer Console
3. Run this command:

```javascript
throw new Error("Frontend Sentry Test Error - " + new Date().toISOString());
```

4. Check your Sentry Frontend project for the error

### Method B: Using Logger Service

1. In any React component, import Logger:

```javascript
import Logger from "./services/logger.js";

// Trigger test error
Logger.error(new Error("Frontend Test via Logger"));
```

### Method C: Error Boundary Test

1. Create a button that throws an error:

```jsx
<button
  onClick={() => {
    throw new Error("Error Boundary Test");
  }}
>
  Test Error Boundary
</button>
```

2. Click the button
3. The Error Boundary should catch it and send to Sentry

**Expected Result:** ✅ Error appears in Sentry Frontend project

---

## Test 3: Admin Error Capture

### Same as Frontend

1. Open http://localhost:5174
2. Press F12
3. Run:

```javascript
throw new Error("Admin Sentry Test Error - " + new Date().toISOString());
```

4. Check Sentry Admin project

**Expected Result:** ✅ Error appears in Sentry Admin project

---

## Test 4: Verify Environment Variables

### Backend

```bash
cd Backend
cat .env | grep SENTRY_DSN
```

Should show: `SENTRY_DSN=https://...@sentry.io/...`

### Frontend

```bash
cd frontend
cat .env | grep VITE_SENTRY_DSN
```

Should show: `VITE_SENTRY_DSN=https://...@sentry.io/...`

### Admin

```bash
cd admin
cat .env | grep VITE_SENTRY_DSN
```

Should show: `VITE_SENTRY_DSN=https://...@sentry.io/...`

---

## Test 5: Check Sentry Initialization

### Backend

Look for this in backend logs when it starts:

```
✅ MongoDB connected successfully
🚀 Server running in DEVELOPMENT mode
```

No Sentry errors should appear. If Sentry fails to initialize, you'll see errors.

### Frontend/Admin

Open browser console on http://localhost:5173 or http://localhost:5174

Look for Sentry initialization messages (might not be visible, but check for errors)

---

## Troubleshooting

### Errors Not Appearing in Sentry

**1. Check DSN is correct:**

- Go to Sentry.io
- Click on your project
- Settings → Client Keys (DSN)
- Copy the DSN and verify it matches your `.env` file

**2. Check network requests:**

- Open browser DevTools → Network tab
- Trigger an error
- Look for POST requests to `sentry.io`
- If you see 403/401, your DSN is wrong
- If you see no requests, Sentry isn't initialized

**3. Check console for Sentry errors:**

- Look for "Sentry" in console logs
- Any init errors will show here

**4. Verify environment variable is loaded:**

**Frontend/Admin:**

```javascript
console.log("Sentry DSN:", import.meta.env.VITE_SENTRY_DSN);
```

**Backend:**

```javascript
console.log("Sentry DSN:", process.env.SENTRY_DSN);
```

If it shows `undefined`, the env variable isn't loading.

**5. Restart dev servers:**
After changing `.env` files, ALWAYS restart:

```bash
# Stop with Ctrl+C, then:
npm run dev
```

---

## Expected Sentry Dashboard Features

Once errors are captured, you should see in Sentry:

1. **Error Message** - The error text
2. **Stack Trace** - Full JavaScript stack trace
3. **Breadcrumbs** - User actions leading to error
4. **Environment** - development/production
5. **Device Info** - Browser, OS (for frontend/admin)
6. **Request Info** - URL, method, headers (for backend)
7. **User IP** - If sendDefaultPii is true

---

## Success Criteria

- [ ] Backend test endpoint returns error and appears in Sentry
- [ ] Frontend console error appears in Sentry
- [ ] Admin console error appears in Sentry
- [ ] Error Boundaries catch errors and send to Sentry
- [ ] All errors show full stack traces
- [ ] Errors appear within 10 seconds of triggering

---

## Quick Test Commands

```bash
# Test Backend
curl http://localhost:5000/test-sentry

# Check if errors exist in Sentry (you need to do this manually)
# Go to: https://sentry.io/organizations/YOUR_ORG/issues/
```

---

## Clean Up

After testing, remove the test endpoint from `server.js`:

```javascript
// Remove this block:
app.get("/test-sentry", (req, res) => {
  throw new Error("Backend Sentry Test Error - " + new Date().toISOString());
});
```
