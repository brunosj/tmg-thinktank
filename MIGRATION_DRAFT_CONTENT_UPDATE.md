# Migration Script Update: Include Draft Content

This document outlines the changes needed to existing migration scripts to fetch **draft content** from Contentful in addition to published content.

---

## 🎯 Goal

Update all migration scripts in `tmg-cms/migration-scripts-old/` to fetch both published and draft entries from Contentful, ensuring all content (including unpublished items) is migrated to Payload.

---

## 📋 What Needs to Change

### Current Behavior

Migration scripts currently fetch from Contentful's **CDN API** (Production), which only returns **published** entries:

```typescript
const url = `https://${process.env.PUBLIC_CONTENTFUL_HOST}/spaces/${spaceId}/entries?content_type=${contentType}&limit=1000&include=10`;
```

This uses:

- Host: `cdn.contentful.com` (or `api.contentful.com`)
- Token: `SECRET_CONTENTFUL_ACCESS_TOKEN` (Production/Delivery token)
- Result: Only published entries

### Required Behavior

Fetch from Contentful's **Preview API**, which returns **both published and draft** entries:

```typescript
const url = `https://preview.contentful.com/spaces/${spaceId}/entries?content_type=${contentType}&limit=1000&include=10`;
```

This uses:

- Host: `preview.contentful.com`
- Token: `SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN` (Preview token)
- Result: All entries (published + draft)

---

## 🔧 Implementation Options

### Option 1: Environment Variable Flag (RECOMMENDED)

Add a new environment variable to control which API to use:

**1. Update `.env`:**

```bash
# Contentful API Configuration
SECRET_CONTENTFUL_SPACE_ID=your_space_id
SECRET_CONTENTFUL_ACCESS_TOKEN=your_production_token
SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token  # Add this

# Migration Settings
CONTENTFUL_USE_PREVIEW=true  # Set to 'true' to include drafts, 'false' for published only
```

**2. Update each migration script:**

Add this helper function at the top of each script:

```typescript
// Helper to determine which API to use
function getContentfulConfig() {
	const usePreview = process.env.CONTENTFUL_USE_PREVIEW === 'true';

	return {
		host: usePreview
			? 'preview.contentful.com'
			: process.env.PUBLIC_CONTENTFUL_HOST || 'cdn.contentful.com',
		token: usePreview
			? process.env.SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN
			: process.env.SECRET_CONTENTFUL_ACCESS_TOKEN
	};
}
```

**3. Update fetch function:**

```typescript
async function fetchContentfulProgrammes(): Promise<ContentfulProgrammeWithSys[]> {
	const { host, token } = getContentfulConfig();
	const spaceId = process.env.SECRET_CONTENTFUL_SPACE_ID;

	const url = `https://${host}/spaces/${spaceId}/entries?content_type=program&limit=1000&include=10`;

	console.log(
		`📡 Fetching from: ${host} ${process.env.CONTENTFUL_USE_PREVIEW === 'true' ? '(including drafts)' : '(published only)'}`
	);

	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: ContentfulResponse<ContentfulProgrammeWithSys> = await response.json();
		console.log(`✅ Fetched ${data.items.length} programmes (${data.total} total)`);

		return data.items;
	} catch (error) {
		console.error('❌ Error fetching programmes from Contentful:', error);
		throw error;
	}
}
```

### Option 2: Always Use Preview API

Simpler but less flexible - always fetch from preview:

```typescript
async function fetchContentfulProgrammes(): Promise<ContentfulProgrammeWithSys[]> {
  const baseUrl = 'https://preview.contentful.com';  // Hard-coded to preview
  const spaceId = process.env.SECRET_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN;  // Use preview token

  const url = `${baseUrl}/spaces/${spaceId}/entries?content_type=program&limit=1000&include=10`;

  console.log('📡 Fetching from Contentful Preview API (including drafts)');

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // ... rest of code
  }
}
```

---

## 📝 Files to Update

All migration scripts in `tmg-cms/migration-scripts-old/`:

1. ✅ `migrate-programmes.ts`
2. ✅ `migrate-projects.ts`
3. ✅ `migrate-staff.ts`
4. ✅ `migrate-collaborators.ts`
5. ✅ `migrate-speakers.ts`
6. ✅ `migrate-events.ts`
7. ✅ `migrate-news.ts`
8. ✅ `migrate-blog-posts.ts`
9. ✅ `migrate-publications.ts`
10. ✅ `migrate-videos.ts`
11. ✅ `migrate-event-series.ts`
12. ✅ `migrate-publication-features.ts`
13. ✅ `migrate-initiatives.ts`
14. ✅ `migrate-generic-pages.ts`

---

## 🔍 Detailed Example: migrate-programmes.ts

**Before:**

```typescript
async function fetchContentfulProgrammes(): Promise<ContentfulProgrammeWithSys[]> {
	const baseUrl = `https://${process.env.PUBLIC_CONTENTFUL_HOST}`;
	const spaceId = process.env.SECRET_CONTENTFUL_SPACE_ID;
	const accessToken = process.env.SECRET_CONTENTFUL_ACCESS_TOKEN;

	const url = `${baseUrl}/spaces/${spaceId}/entries?content_type=program&limit=1000&include=10`;

	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: ContentfulResponse<ContentfulProgrammeWithSys> = await response.json();
		console.log(`✅ Fetched ${data.items.length} programmes`);

		return data.items;
	} catch (error) {
		console.error('❌ Error fetching programmes:', error);
		throw error;
	}
}
```

**After (Option 1 - Recommended):**

```typescript
// Add helper function
function getContentfulConfig() {
	const usePreview = process.env.CONTENTFUL_USE_PREVIEW === 'true';

	return {
		host: usePreview
			? 'preview.contentful.com'
			: process.env.PUBLIC_CONTENTFUL_HOST || 'cdn.contentful.com',
		token: usePreview
			? process.env.SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN
			: process.env.SECRET_CONTENTFUL_ACCESS_TOKEN
	};
}

async function fetchContentfulProgrammes(): Promise<ContentfulProgrammeWithSys[]> {
	const { host, token } = getContentfulConfig();
	const spaceId = process.env.SECRET_CONTENTFUL_SPACE_ID;

	const url = `https://${host}/spaces/${spaceId}/entries?content_type=program&limit=1000&include=10`;

	const mode =
		process.env.CONTENTFUL_USE_PREVIEW === 'true'
			? 'Preview (including drafts)'
			: 'Production (published only)';
	console.log(`📡 Fetching from Contentful ${mode}`);

	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: ContentfulResponse<ContentfulProgrammeWithSys> = await response.json();
		console.log(`✅ Fetched ${data.items.length} programmes from ${host}`);

		// Optional: Log draft vs published counts
		const draftCount = data.items.filter((item) => !item.sys.publishedVersion).length;
		const publishedCount = data.items.length - draftCount;
		console.log(`   📊 Published: ${publishedCount}, Drafts: ${draftCount}`);

		return data.items;
	} catch (error) {
		console.error('❌ Error fetching programmes:', error);
		throw error;
	}
}
```

---

## 🚀 Usage

### Step 1: Get Preview Token

1. Go to Contentful Dashboard
2. Settings → API Keys
3. Copy the **Content Preview API - access token**
4. Add to `.env`:

```bash
SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token_here
```

### Step 2: Update Environment

```bash
# In .env, add:
CONTENTFUL_USE_PREVIEW=true
```

### Step 3: Run Migrations

```bash
# Make sure to run in order (respecting dependencies):

# Foundation
pnpm migrate:staff
pnpm migrate:collaborators
pnpm migrate:speakers

# Programmes (required by most content)
pnpm migrate:programmes

# Projects (depend on programmes)
pnpm migrate:projects

# Content (depend on programmes/projects)
pnpm migrate:videos
pnpm migrate:publications
pnpm migrate:events
pnpm migrate:news
pnpm migrate:blog-posts

# Complex pages
pnpm migrate:initiatives
pnpm migrate:publication-features
pnpm migrate:event-series
pnpm migrate:generic-pages
```

### Step 4: Verify

After migration, check Payload dashboard:

- Go to each collection
- Filter by `_status: draft` to see draft entries
- Verify counts match Contentful

---

## 🔒 Draft Content Handling in Payload

When migrating draft content, set the Payload status field:

```typescript
// In migration script, when creating/updating entry:

const payloadData = {
	title: contentfulEntry.fields.title,
	slug: contentfulEntry.fields.slug,
	// ... other fields ...

	// Set status based on Contentful publish state
	_status: contentfulEntry.sys.publishedVersion ? 'published' : 'draft',

	// Track migration
	contentfulId: contentfulEntry.sys.id,
	migrationNotes: `Migrated from Contentful on ${new Date().toISOString()}. Original status: ${contentfulEntry.sys.publishedVersion ? 'published' : 'draft'}`
};

// Create or update in Payload
const result = await payload.create({
	collection: 'programmes',
	data: payloadData
});
```

This ensures:

- Draft items stay as drafts in Payload
- Published items are published in Payload
- You can review drafts before publishing

---

## 📊 Verification Queries

### Check Draft Content in Contentful

Use Contentful's API to count drafts:

```bash
# Get all entries (including drafts) from Preview API
curl -X GET \
  "https://preview.contentful.com/spaces/YOUR_SPACE_ID/entries?content_type=program&limit=1" \
  -H "Authorization: Bearer YOUR_PREVIEW_TOKEN" | jq '.total'

# Get only published from CDN API
curl -X GET \
  "https://cdn.contentful.com/spaces/YOUR_SPACE_ID/entries?content_type=program&limit=1" \
  -H "Authorization: Bearer YOUR_PRODUCTION_TOKEN" | jq '.total'

# Difference = draft count
```

### Check Draft Content in Payload

After migration:

```typescript
// In Payload admin or via API:
const draftProgrammes = await payload.find({
	collection: 'categories',
	where: {
		and: [{ type: { equals: 'programme' } }, { _status: { equals: 'draft' } }]
	}
});

console.log(`Found ${draftProgrammes.totalDocs} draft programmes`);
```

---

## ⚠️ Important Notes

### 1. Preview API Rate Limits

Contentful's Preview API has rate limits (same as CDN, but separate):

- **Free tier:** 5 requests/second
- **Paid tier:** Higher limits

If hitting rate limits, add throttling:

```typescript
function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// In migration loop:
for (const item of contentfulItems) {
	await migrateItem(item);
	await delay(200); // 200ms delay = max 5 req/sec
}
```

### 2. Sys.publishedVersion Field

To check if an entry is published in Contentful:

```typescript
const isPublished = !!contentfulEntry.sys.publishedVersion;
const isDraft = !contentfulEntry.sys.publishedVersion;

// publishedVersion is present only on published entries
// It contains the version number of the last publish
```

### 3. Updated vs Published

Note the difference:

- `sys.updatedAt`: Last modification time (draft or published)
- `sys.publishedVersion`: Present only if published
- An entry can be published but have unpublished changes (new draft version)

For migration, we care about whether it's ever been published:

```typescript
const status = contentfulEntry.sys.publishedVersion ? 'published' : 'draft';
```

### 4. Content Links

Draft entries may reference other draft entries. Ensure:

- All dependencies migrated first
- Relationship resolution handles both published and draft refs

---

## 🧪 Testing

Before full migration:

### 1. Test with Single Collection

```bash
# Update just one script (e.g., migrate-programmes.ts)
# Run it with preview enabled
CONTENTFUL_USE_PREVIEW=true pnpm migrate:programmes

# Check results in Payload
# Verify draft count matches Contentful
```

### 2. Compare Counts

Create a comparison script:

```typescript
// scripts/compare-content-counts.ts

async function compareCounts() {
	// Fetch from Production API
	const prodResponse = await fetch(
		`https://cdn.contentful.com/spaces/${SPACE_ID}/entries?content_type=program&limit=1`,
		{ headers: { Authorization: `Bearer ${PROD_TOKEN}` } }
	);
	const prodData = await prodResponse.json();

	// Fetch from Preview API
	const previewResponse = await fetch(
		`https://preview.contentful.com/spaces/${SPACE_ID}/entries?content_type=program&limit=1`,
		{ headers: { Authorization: `Bearer ${PREVIEW_TOKEN}` } }
	);
	const previewData = await previewResponse.json();

	console.log(`📊 Programmes:`);
	console.log(`   Published: ${prodData.total}`);
	console.log(`   Total (including drafts): ${previewData.total}`);
	console.log(`   Draft only: ${previewData.total - prodData.total}`);
}

compareCounts();
```

### 3. Spot Check Drafts

Manually verify a few draft entries:

1. Find a draft in Contentful (unpublished entry)
2. After migration, find it in Payload
3. Verify status is `draft`
4. Verify content matches

---

## ✅ Checklist

Before running full migration:

- [ ] Preview token added to `.env`
- [ ] `CONTENTFUL_USE_PREVIEW=true` set in `.env`
- [ ] Migration scripts updated with config helper
- [ ] Test migration on single collection
- [ ] Verify draft detection works
- [ ] Verify Payload status field set correctly
- [ ] Count comparison shows expected numbers
- [ ] Spot-check some draft entries
- [ ] Ready to run full migration suite

---

## 🔄 Rollback

If issues occur:

1. **Clear migrated data:**

   ```bash
   # Drop collections in MongoDB or use Payload admin
   # Re-run migrations with CONTENTFUL_USE_PREVIEW=false
   ```

2. **Re-run with published only:**

   ```bash
   CONTENTFUL_USE_PREVIEW=false pnpm migrate:programmes
   ```

3. **Selective re-migration:**

   ```typescript
   // Update script to skip already-migrated items
   const existing = await payload.find({
   	collection: 'categories',
   	where: { contentfulId: { equals: contentfulId } }
   });

   if (existing.docs.length > 0) {
   	console.log(`Skipping ${contentfulId}, already migrated`);
   	continue;
   }
   ```

---

**Document Version:** 1.0  
**Last Updated:** January 6, 2026  
**Critical:** Ensure preview token is valid and has proper permissions
