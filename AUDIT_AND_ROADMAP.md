# Audit & Roadmap — Archived

> [!WARNING]
> This file previously contained stale findings from an earlier audit.
> Many items it listed (Docker/k8s manifests, Settings.js clone, fat payment controller,
> missing volunteer queue, webhook idempotency) were either already fixed or never existed
> in this repo.

## Current audit

See the verified repo audit dated **Aug 28, 2026** for an accurate, source-verified
assessment of the codebase:

- Webhook parsing, idempotency, and signature verification — ✅ correct
- httpOnly cookie auth with no localStorage JWT — ✅ correct
- Admin ProtectedRoute backed by Redux auth state — ✅ correct
- CI workflows with real test commands, no continue-on-error — ✅ correct

### Remaining items (from the verified audit)

1. Add distributed lock to recurring donation cron to prevent double-charging across replicas
2. Extract `settingsController.js` (772 lines) into a service layer
3. Consolidate the two frontend event Redux slices (old one bypasses shared API client)
4. Replace unmaintained `xss-clean` dependency
5. Expand test coverage (currently ~8 backend / 2 frontend tests)

---

*This file will be removed in a future cleanup pass. It is kept temporarily so
existing bookmarks and references don't break.*
