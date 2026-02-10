# Sentry Error Tracking Test Guide

## Prerequisites

- ✅ Sentry DSNs added to `.env` files
- ✅ Dev servers running (Frontend: 5173, Admin: 5174, Backend: 5000)
- ✅ Sentry projects created and configured

---

## Test 1: Frontend Error Tracking

### Steps:

1. **Open Frontend in browser:**

   ```
   http://localhost:5173
   ```

2. **Open Browser Console** (Press F12)

3. **Trigger a test error:**

   ```javascript
   throw new Error("Frontend Sentry Test - " + new Date().toISOString());
   ```

4. **Check Sentry Dashboard:**
   - Go to your Sentry project for Frontend
   - Navigate to "Issues"
   - You should see the error appear within 5-10 seconds
   - Click on the error to see stack trace and context

### Expected Result:

✅ Error appears in Sentry with:

- Error message: "Frontend Sentry Test - [timestamp]"
- Stack trace showing browser console
- Environment: development
- Release info (if configured)

---

## Test 2: Admin Error Tracking

### Steps:

1. **Open Admin Panel in browser:**

   ```
   http://localhost:5174
   ```

2. **Open Browser Console** (Press F12)

3. **Trigger a test error:**

   ```javascript
   throw new Error("Admin Sentry Test - " + new Date().toISOString());
   ```

4. **Check Sentry Dashboard:**
   - Go to your Sentry project for Admin
   - Navigate to "Issues"
   - Verify the error appears

### Expected Result:

✅ Error appears in Sentry with admin-specific context

---

## Test 3: Backend Error Tracking

### Method 1: Using Test Endpoint (Recommended)

1. **Add temporary test endpoint** to `Backend/server.js`:

   ```javascript
   // Add after health check endpoint
   app.get("/test-sentry", (req, res) => {
     const error = new Error(
       "Backend Sentry Test - " + new Date().toISOString(),
     );
     logger.error("Test error triggered");
     throw error;
   });
   ```

2. **Restart backend server** (Ctrl+C and `npm run dev`)

3. **Trigger the error:**

   ```bash
   curl http://localhost:5000/test-sentry
   # Or open in browser: http://localhost:5000/test-sentry
   ```

4. **Check Sentry Dashboard:**
   - Go to your Sentry project for Backend
   - Navigate to "Issues"
   - Verify the error appears

5. **Remove test endpoint** after verification

### Method 2: Using Existing Error Handler

1. **Trigger an invalid API request:**

   ```bash
   curl http://localhost:5000/api/v1/nonexistent-endpoint
   ```

2. **Check backend logs** for error capture

3. **Check Sentry** for 404 errors (if configured to capture)

### Expected Result:

✅ Error appears in Sentry with:

- Error message from backend
- Server-side stack trace
- Request context (URL, method, headers)
- Environment: development

---

## Test 4: Error Boundary (Frontend/Admin)

### Frontend Test:

1. **Navigate to any page** in the frontend

2. **In browser console, trigger a React error:**

   ```javascript
   // This will be caught by Error Boundary
   const element = document.querySelector("button");
   if (element) {
     element.addEventListener("click", () => {
       throw new Error("React Error Boundary Test");
     });
   }
   ```

3. **Click the button** you added the listener to

4. **Check Sentry** for the error caught by Error Boundary

### Expected Result:

✅ Error Boundary catches the error
✅ Fallback UI is displayed
✅ Error is sent to Sentry

---

## Verification Checklist

- [ ] Frontend errors appear in Sentry
- [ ] Admin errors appear in Sentry
- [ ] Backend errors appear in Sentry
- [ ] Error Boundary works in Frontend
- [ ] Error Boundary works in Admin
- [ ] Stack traces are complete
- [ ] Environment is correctly tagged
- [ ] Errors include context (user, request data)

---

## Troubleshooting

### Errors Not Appearing in Sentry

**Check 1: Verify DSN**

```bash
# Frontend
cat frontend/.env | grep SENTRY_DSN

# Admin
cat admin/.env | grep SENTRY_DSN

# Backend
cat Backend/.env | grep SENTRY_DSN
```

**Check 2: Check Browser Console**

- Look for Sentry initialization messages
- Look for network requests to Sentry (should see POST requests)

**Check 3: Verify Sentry Project Settings**

- Ensure project is active
- Check rate limits
- Verify DSN is correct

**Check 4: Check Backend Logs**

```bash
# Should see Sentry initialization
npm run dev
# Look for: "Sentry initialized" or similar
```

### Network Issues

If Sentry requests are blocked:

- Check firewall settings
- Verify network can reach `sentry.io`
- Check for corporate proxy/VPN issues

---

## Next Steps After Verification

Once all Sentry tests pass:

1. ✅ Mark Sentry testing as complete
2. 🔄 Proceed to Docker testing
3. 🔄 Test production deployment
