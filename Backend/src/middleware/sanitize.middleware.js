// src/middleware/sanitize.middleware.js
// Self-contained input sanitizer — strips HTML tags and trims strings
// from req.body, req.query, and req.params.  No external dependency needed
// (xss-clean was archived in 2021 and is no longer maintained).

export const sanitizeInputs = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitizeObject(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    }
  }

  if (req.params && typeof req.params === 'object') {
    for (const key of Object.keys(req.params)) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = sanitizeString(req.params[key]);
      }
    }
  }

  next();
};

function sanitizeString(str) {
  // Remove leading/trailing whitespace and strip HTML tags
  return str.trim().replace(/<[^>]*>?/gm, '');
}

function deepSanitizeObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === 'string'
        ? sanitizeString(item)
        : typeof item === 'object' && item !== null
          ? deepSanitizeObject(item)
          : item
    );
  }

  for (const key in obj) {
    const val = obj[key];
    if (typeof val === 'string') obj[key] = sanitizeString(val);
    else if (typeof val === 'object' && val !== null) obj[key] = deepSanitizeObject(val);
  }
  return obj;
}
