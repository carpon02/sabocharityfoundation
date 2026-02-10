# ✅ Sentry Manual Verification Checklist

## Backend Test - COMPLETED ✅

**Status:** Backend test endpoint works! The curl command returned an error response, which means:

- ✅ Error was thrown
- ✅ Sentry error handler caught it
- ✅ Error should now be in your Sentry dashboard

**Next Step:** Check your Sentry Backend project for the error:

1. Go to https://sentry.io
2. Select your Backend project
3. Click "Issues"
4. Look for "Backend Sentry Test Error" with recent timestamp

---

## Frontend Test - MANUAL REQUIRED

### Step 1: Open Frontend

1. Open browser and go to: **http://localhost:5173**
2. Press **F12** to open Developer Tools

### Step 2: Trigger Test Error

In the Console tab, paste and run:

```javascript
throw new Error("Frontend Sentry Test - " + new Date().toISOString());
```

### Step 3: Verify Network Request

1. Go to **Network** tab in DevTools
2. Filter by "sentry" or look for POST requests
3. You should see requests to `ingest.sentry.io` or `sentry.io`
4. Status should be **200** or **204** (success)

### Step 4: Check Sentry Dashboard

1. Go to https://sentry.io
2. Select your **Frontend** project
3. Click "Issues"
4. Look for "Frontend Sentry Test" error
5. Should appear within 5-10 seconds

---

## Admin Test - MANUAL REQUIRED

### Step 1: Open Admin

1. Open browser and go to: **http://localhost:5174**
2. Press **F12** to open Developer Tools

### Step 2: Trigger Test Error

In the Console tab, paste and run:

```javascript
throw new Error("Admin Sentry Test - " + new Date().toISOString());
```

### Step 3: Verify Network Request

1. Go to **Network** tab in DevTools
2. Filter by "sentry"
3. You should see POST requests to Sentry
4. Status should be **200** or **204**

### Step 4: Check Sentry Dashboard

1. Go to https://sentry.io
2. Select your **Admin** project
3. Click "Issues"
4. Look for "Admin Sentry Test" error

---

## Troubleshooting Guide

### If Backend Error NOT in Sentry:

**Check DSN:**

```bash
cd Backend
cat .env | grep SENTRY_DSN
```

Should show: `SENTRY_DSN=https://...@sentry.io/...`

**Check backend logs** for Sentry initialization errors:

- Look in the terminal where `npm run dev` is running
- Should NOT see any errors mentioning Sentry

**Verify instrument.js is loaded:**
Add this line temporarily to `Backend/instrument.js` at the top:

```javascript
console.log("✅ Sentry instrument.js loaded!");
```

Restart backend and check logs.

---

### If Frontend/Admin Errors NOT in Sentry:

**Check DSN in browser console:**

```javascript
console.log("Sentry DSN:", import.meta.env.VITE_SENTRY_DSN);
```

Should show your DSN, NOT `undefined`

**Check for Sentry errors in console:**

- Look for red errors mentioning "Sentry"
- Common: DSN invalid, network blocked

**Verify .env file exists:**

```bash
# Frontend
ls frontend/.env

# Admin
ls admin/.env
```

**Check Network tab:**

- Filter by "sentry"
- If NO requests appear, Sentry isn't initialized
- If requests show **403/401**, DSN is wrong
- If requests show **429**, rate limited (wait a bit)

---

## Success Criteria

- [ ] **Backend:** Error appears in Sentry Backend project Issues
- [ ] **Frontend:** Error appears in Sentry Frontend project Issues
- [ ] **Frontend:** Network tab shows successful POST to sentry.io
- [ ] **Admin:** Error appears in Sentry Admin project Issues
- [ ] **Admin:** Network tab shows successful POST to sentry.io
- [ ] **All:** Errors include stack traces and timestamps
- [ ] **All:** Errors appear within 10 seconds of triggering

---

## Screenshot Examples

When you check Sentry Issues, you should see:

**Issue Title:** "Backend Sentry Test Error" (or Frontend/Admin)
**Environment:** development
**First Seen:** Just now
**Last Seen:** Just now
**Events:** 1 (or more if you tested multiple times)

Click on the issue to see:

- Full error message
- Stack trace
- Breadcrumbs (user actions before error)
- Device/browser info (for frontend/admin)
- Request details (for backend)

---

## Clean Up After Testing

Once verification is complete, remove the test endpoint:

**Backend** - Edit `server.js`, remove lines 22-25:

```javascript
// Remove this:
app.get("/test-sentry", (req, res) => {
  throw new Error("Backend Sentry Test Error - " + new Date().toISOString());
});
```

**Commit changes:**

```bash
git add .
git commit -m "chore: remove Sentry test endpoint"
git push
```

---

## ✅ Final Verification

Once all tests pass:

- **All 3 projects** should have test errors in Sentry
- **Network requests** should show 200/204 status
- **Error details** should include stack traces

This confirms Sentry is properly integrated and will capture real errors in production!
