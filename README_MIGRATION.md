# Contentful → Payload CMS Migration - Quick Start

🎯 **Goal:** Migrate TMG website from Contentful to Payload CMS with zero visual changes

---

## 📚 Documentation Index

This migration project includes 4 comprehensive documents:

1. **[CONTENTFUL_TO_PAYLOAD_MIGRATION_ROADMAP.md](./CONTENTFUL_TO_PAYLOAD_MIGRATION_ROADMAP.md)** ⭐ **START HERE**
   - Complete migration strategy (5 phases, 4-5 weeks)
   - Current state analysis
   - Risk assessment and mitigation
   - Timeline and success criteria

2. **[ADAPTER_IMPLEMENTATION_GUIDE.md](./ADAPTER_IMPLEMENTATION_GUIDE.md)** 🔧 **TECHNICAL REFERENCE**
   - Complete code for adapter layer
   - payloadAdapter.ts implementation
   - dataClient.ts unified CMS interface
   - Example route updates

3. **[MIGRATION_DRAFT_CONTENT_UPDATE.md](./MIGRATION_DRAFT_CONTENT_UPDATE.md)** 📝 **BACKEND TASKS**
   - How to update migration scripts for draft content
   - Environment configuration
   - Testing and verification

4. **THIS FILE** - Quick start and overview

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required environment variables
DATABASE_URI=mongodb://...
PAYLOAD_SECRET=your_secret
SECRET_CONTENTFUL_SPACE_ID=your_space_id
SECRET_CONTENTFUL_ACCESS_TOKEN=your_token
SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token  # NEW - get from Contentful
SECRET_PAYLOAD_URL=http://localhost:3000
SECRET_PAYLOAD_API_KEY=your_api_key

# Feature flags
CONTENTFUL_USE_PREVIEW=true   # Include draft content in migration
SECRET_USE_PAYLOAD=false      # Switch between Contentful/Payload (false = Contentful, true = Payload)
DEBUG_CMS=false              # Enable detailed logging
```

### Phase 1: Backend Migration (Week 1)

**Goal:** Get all Contentful content (including drafts) into Payload

```bash
# 1. Update .env with preview token
echo "SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token" >> .env
echo "CONTENTFUL_USE_PREVIEW=true" >> .env

# 2. Update migration scripts (see MIGRATION_DRAFT_CONTENT_UPDATE.md)
# Add getContentfulConfig() helper to each script

# 3. Run migrations in order
cd /path/to/tmg-cms
pnpm migrate:staff
pnpm migrate:collaborators
pnpm migrate:speakers
pnpm migrate:programmes
pnpm migrate:projects
pnpm migrate:videos
pnpm migrate:publications
pnpm migrate:events
pnpm migrate:news
pnpm migrate:blog-posts
pnpm migrate:initiatives
pnpm migrate:publication-features
pnpm migrate:event-series

# 4. Verify in Payload admin
# Check counts match Contentful
# Verify relationships work
```

### Phase 2: Adapter Layer (Week 1-2)

**Goal:** Create transformation layer that makes Payload data look like Contentful

```bash
cd /path/to/tmg-svelte

# 1. Create adapter files
# - src/lib/config/features.ts
# - src/lib/payloadAdapter.ts (see ADAPTER_IMPLEMENTATION_GUIDE.md)
# - src/lib/dataClient.ts

# 2. Update payloadClient.ts
# Add adapted getter functions

# 3. Test adapter
npm run dev
# Access http://localhost:5173
# Still using Contentful (SECRET_USE_PAYLOAD=false)
```

### Phase 3: Frontend Integration (Week 2-3)

**Goal:** Update all routes to use unified data client

```bash
# Update all route load functions (28 files)
# Replace:
#   import { fetchContentfulData } from '$lib/contentfulClient'
# With:
#   import { fetchProgrammes, fetchEvents, ... } from '$lib/dataClient'

# Files to update:
# - src/routes/+layout.server.ts
# - src/routes/+page.server.ts
# - src/routes/about/+page.server.ts
# - src/routes/blog/+page.server.ts
# - src/routes/blog/[slug]/+page.server.js
# ... (25 more - see roadmap for full list)
```

### Phase 4: Testing (Week 3-4)

**Goal:** Verify Payload mode produces identical output

```bash
# 1. Test with Contentful (baseline)
SECRET_USE_PAYLOAD=false npm run dev
# Browse site, take screenshots

# 2. Test with Payload
SECRET_USE_PAYLOAD=true npm run dev
# Browse site, compare

# 3. Run comparison tests
npx tsx scripts/compare-cms-responses.ts

# 4. Check for:
# - Visual differences (should be ZERO)
# - Console errors (should be ZERO)
# - Missing images
# - Broken relationships
# - Search functionality
# - Programme/project filtering
```

### Phase 5: Deployment (Week 4)

**Goal:** Roll out to production safely

```bash
# 1. Deploy to staging
SECRET_USE_PAYLOAD=true
# Test thoroughly

# 2. Deploy to production
SECRET_USE_PAYLOAD=false  # Start with Contentful
# Deploy

# 3. Switch to Payload (canary)
SECRET_USE_PAYLOAD=true
# Monitor for errors

# 4. Full rollout
# If stable after 24-48 hours, done!
# Keep Contentful as fallback for 1 week
```

---

## 🎯 Key Concepts

### The Adapter Pattern

**Problem:** Contentful and Payload have different data structures

```typescript
// Contentful: Nested in .fields
event.fields.title;
event.fields.programme.fields.title;

// Payload: Flat with tabs
event.title;
event.info.programme.title;
```

**Solution:** Adapter layer transforms Payload → Contentful format

```typescript
// payloadAdapter.ts
export function adaptPayloadEvent(payload: PayloadEvent): ContentfulEvent {
	return {
		fields: {
			title: payload.title,
			date: payload.info.date,
			programme: adaptPayloadProgramme(payload.info.programme)
			// ... all fields
		}
	};
}
```

**Result:** Components unchanged! They still access `event.fields.title`

### Feature Flag System

```typescript
// config/features.ts
export const USE_PAYLOAD = process.env.SECRET_USE_PAYLOAD === 'true';

// dataClient.ts
export async function fetchEvents() {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedEvents(); // Payload → adapted to Contentful format
	}
	return ContentfulClient.fetchContentfulData('event'); // Original Contentful
}
```

Switch between CMSs with one environment variable!

### Relationship Handling

**Critical:** Payload relationships must be populated (not just IDs)

```typescript
// In payloadClient.ts - use depth parameter
const response = await fetchFromPayload(
	`/events?where[slug][equals]=${slug}&limit=1&depth=3` // depth=3 populates nested relationships
);
```

---

## 📊 Current State vs Target State

### Current (Contentful)

```
Frontend (Svelte)
    ↓
contentfulClient.ts
    ↓
Contentful API
    ↓
Contentful CMS
```

### Target (Payload)

```
Frontend (Svelte) [UNCHANGED]
    ↓
dataClient.ts [NEW - feature flag]
    ↓
payloadAdapter.ts [NEW - transforms data]
    ↓
payloadClient.ts [ENHANCED]
    ↓
Payload API
    ↓
Payload CMS
```

**Components don't know the difference!** They still get `item.fields.propertyName`

---

## ⚠️ Common Pitfalls

### 1. Relationships Return IDs

**Problem:** `event.fields.programme` is `"abc123"` instead of object

**Fix:** Increase depth in Payload query

```typescript
fetchPayloadData('events', 3); // Use depth 3 or 4
```

### 2. Missing Nested Properties

**Problem:** `Cannot read property 'summary' of undefined`

**Fix:** Use safe navigation in adapter

```typescript
summary: get(payload, 'info.summary', ''); // Helper with fallback
```

### 3. Images Not Loading

**Problem:** Wrong media URL format

**Fix:** Adapter handles both Cloudinary and local uploads

```typescript
thumbnailCdn: payload.thumbnailFromCloudinary
  ? [{ secure_url: payload.thumbnailFromCloudinary, ... }]
  : adaptMediaArray([payload.content.thumbnail])
```

### 4. Programme/Project Filtering Breaks

**Problem:** Components filter by comparing nested `.fields`

**Fix:** Ensure adapter maintains nested structure

```typescript
// This must work:
events.filter((e) => e.fields.programme.fields.title === programme.fields.title);
// Adapter must create full nested structure, not shortcuts
```

### 5. Draft Content Missing

**Problem:** Only published content migrated

**Fix:** Use Preview API with preview token

```typescript
const { host, token } = getContentfulConfig();
// host = 'preview.contentful.com' (not 'cdn.contentful.com')
// token = PREVIEW_ACCESS_TOKEN (not production token)
```

---

## 🔍 Debugging

### Check Which CMS is Active

```typescript
// In browser console:
console.log('USE_PAYLOAD:', USE_PAYLOAD);

// Or check server logs:
// Should see: "🔧 Using PAYLOAD CMS" or "🔧 Using CONTENTFUL CMS"
```

### Compare Data Structures

```typescript
// In dataClient.ts, add logging:
export async function fetchEvents() {
	const events = USE_PAYLOAD
		? await PayloadClient.getAdaptedEvents()
		: await ContentfulClient.fetchContentfulData('event');

	console.log('First event structure:', JSON.stringify(events[0], null, 2));
	return events;
}
```

### Verify Adapter Output

```bash
# Run comparison script:
npx tsx scripts/test-cms-parity.ts

# Should output:
# ✅ Contentful: 45 programmes
# ✅ Payload: 45 programmes
# ✅ Structures match
```

---

## 📈 Success Metrics

Migration is complete when:

- ✅ All content migrated (published + drafts)
- ✅ Visual comparison shows zero differences
- ✅ All relationships working
- ✅ Programme/project filtering working
- ✅ Search returning correct results
- ✅ Images/PDFs loading correctly
- ✅ Rich text rendering identically
- ✅ No console errors
- ✅ Performance equal or better
- ✅ Successfully deployed to production
- ✅ Contentful can be deactivated

---

## 🆘 Need Help?

### Documentation References

- **Backend:** `/tmg-cms/guides/MIGRATION_GUIDE.md` - Original migration guide
- **Frontend:** This folder - All migration documents
- **Payload Types:** `/tmg-svelte/src/lib/types/payload-types.ts` - Auto-generated
- **Contentful Types:** `/tmg-svelte/src/lib/types/types.ts` - Manual definitions

### Key Files to Understand

```
Frontend (tmg-svelte):
├── src/lib/
│   ├── contentfulClient.ts          # Current Contentful client
│   ├── payloadClient.ts             # Existing Payload client (to enhance)
│   ├── payloadAdapter.ts            # TO CREATE - transforms data
│   ├── dataClient.ts                # TO CREATE - unified interface
│   ├── config/features.ts           # TO CREATE - feature flags
│   └── types/
│       ├── types.ts                 # Contentful types (keep)
│       └── payload-types.ts         # Payload types (auto-generated)
└── src/routes/
    └── **/+page.server.{ts,js}      # TO UPDATE - 28 files

Backend (tmg-cms):
└── migration-scripts-old/
    └── migrate-*.ts                 # TO UPDATE - add draft support
```

### Testing Checklist

Before switching to Payload in production:

- [ ] Run all migrations successfully
- [ ] Verify counts in Payload admin match Contentful
- [ ] Spot-check 5-10 entries from each collection
- [ ] Test with `SECRET_USE_PAYLOAD=true` locally
- [ ] Browse all major pages
- [ ] Test search functionality
- [ ] Test programme pages (filter by programme)
- [ ] Test project pages (filter by project)
- [ ] Check detail pages (events, news, publications, etc.)
- [ ] Verify images load
- [ ] Verify PDFs download
- [ ] Check related content sections
- [ ] Test on mobile
- [ ] Run Lighthouse tests (performance shouldn't drop)
- [ ] Deploy to staging
- [ ] Get stakeholder approval
- [ ] Deploy to production (Contentful first)
- [ ] Switch flag to Payload
- [ ] Monitor for 24-48 hours
- [ ] Deactivate Contentful

---

## 📅 Timeline at a Glance

| Week | Phase                | Key Tasks                                   | Deliverables                 |
| ---- | -------------------- | ------------------------------------------- | ---------------------------- |
| 1    | Backend Migration    | Update scripts, run migrations, verify data | All content in Payload       |
| 1-2  | Adapter Layer        | Create adapters, enhanced client, test      | Transformation layer working |
| 2-3  | Frontend Integration | Update 28 routes, test locally              | Routes use dataClient        |
| 3-4  | Testing              | Visual comparison, fix bugs                 | Zero differences             |
| 4    | Deployment           | Staging → Production rollout                | Live on Payload              |

---

## 🎓 Learning Resources

### Understanding Payload

- [Payload Docs - Collections](https://payloadcms.com/docs/configuration/collections)
- [Payload Docs - Relationships](https://payloadcms.com/docs/fields/relationship)
- [Payload Docs - Depth](https://payloadcms.com/docs/queries/depth)

### Understanding SvelteKit

- [SvelteKit - Load Functions](https://kit.svelte.dev/docs/load)
- [SvelteKit - Server-only Modules](https://kit.svelte.dev/docs/server-only-modules)

### Contentful vs Payload

```
Contentful                    →    Payload
─────────────────────────────────────────────
entry.fields.title            →    entry.title
entry.fields.date             →    entry.info.date
entry.fields.programme        →    entry.info.programme (populated)
entry.sys.id                  →    entry.id
entry.sys.createdAt           →    entry.createdAt
entry.fields.image.fields...  →    entry.content.image.url
```

---

## 🚦 Status Dashboard

Track progress:

| Task                      | Status     | Notes                         |
| ------------------------- | ---------- | ----------------------------- |
| Preview token configured  | ⏳ Pending | Get from Contentful dashboard |
| Migration scripts updated | ⏳ Pending | Add getContentfulConfig()     |
| All content migrated      | ⏳ Pending | Run migration suite           |
| Adapter layer created     | ⏳ Pending | Create 3 new files            |
| Routes updated            | ⏳ Pending | Update 28 route files         |
| Local testing passed      | ⏳ Pending | Test with both CMSs           |
| Staging deployed          | ⏳ Pending | Deploy with Payload flag      |
| Production deployed       | ⏳ Pending | Staged rollout                |
| Contentful deactivated    | ⏳ Pending | After 1 week stable           |

Legend: ⏳ Pending | 🔄 In Progress | ✅ Complete | ⚠️ Blocked

---

## 💬 Final Notes

**This is a complex but achievable migration.** The key insights:

1. **Adapter pattern** eliminates need to rewrite components
2. **Feature flags** allow safe testing and rollout
3. **Draft content** ensures nothing is lost
4. **Relationships** require careful attention (use depth parameter)
5. **Testing** is critical - visual comparison must show zero differences

**Take it step by step:**

- Week 1: Backend (just run scripts)
- Week 2: Adapter (copy from guide, adapt to your needs)
- Week 3: Routes (find-replace imports, mechanical work)
- Week 4: Test and deploy (careful validation)

**You've got this!** The roadmap is comprehensive, the code examples are complete, and the testing strategy is solid.

---

**Questions?** Review the detailed guides linked at the top of this document.

**Ready to start?** Begin with [CONTENTFUL_TO_PAYLOAD_MIGRATION_ROADMAP.md](./CONTENTFUL_TO_PAYLOAD_MIGRATION_ROADMAP.md)

---

**Document Version:** 1.0  
**Last Updated:** January 6, 2026  
**Project:** TMG Think Tank - CMS Migration
