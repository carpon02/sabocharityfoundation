   // src/middleware/sanitize.middleware.js
   import xss from 'xss-clean';

   export const sanitizeInputs = (req, res, next) => {
   // Apply xss-clean to req.body, req.query, req.params
   xss()(req, res, (err) => {
      if (err) return next(err);

      // Clean all strings in body
      Object.keys(req.body).forEach((key) => {
         const value = req.body[key];
         // Remove dangerous characters and trim all strings
         if (typeof value === 'string') {
         req.body[key] = sanitizeString(value);
         } else if (typeof value === 'object' && value !== null) {
         req.body[key] = deepSanitizeObject(value);
         }
      });

      // Clean strings in query
      Object.keys(req.query).forEach((key) => {
         if (typeof req.query[key] === 'string') {
         req.query[key] = sanitizeString(req.query[key]);
         }
      });

      next();
   });
   };

   function sanitizeString(str) {
   // Remove leading/trailing whitespace and strip out dangerous HTML
   return str.trim().replace(/<[^>]*>?/gm, '');
   }

   function deepSanitizeObject(obj) {
   for (const key in obj) {
      const val = obj[key];
      if (typeof val === 'string') obj[key] = sanitizeString(val);
      else if (typeof val === 'object' && val !== null) obj[key] = deepSanitizeObject(val);
   }
   return obj;
   }
