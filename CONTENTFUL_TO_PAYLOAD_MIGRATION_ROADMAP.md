# Contentful to Payload CMS Migration Roadmap

**Project:** TMG Think Tank Website  
**Goal:** Migrate from Contentful CMS to Payload CMS with zero visual/functional changes  
**Status:** Analysis Complete - Ready for Implementation

---

## 📊 Executive Summary

This document outlines a complete migration strategy from Contentful to Payload CMS for the TMG Svelte frontend. The migration involves:

- **26 collection types** to migrate
- **28+ route files** to update
- **Data structure transformation layer** (Contentful's `fields` wrapper → Payload's flat structure)
- **Relationship re-mapping** (especially Programme/Project aggregations)
- **Draft content inclusion** from Contentful
- **Zero downtime** deployment strategy

---

## 🎯 Current State Analysis

### Frontend Architecture (tmg-svelte)

**Data Fetching Pattern:**

- Uses `contentfulClient.ts` for all Contentful API calls
- Implements in-memory caching (5-30 min TTLs)
- All data loading happens in `+page.server.ts/js` files (SSR)
- Data structure: `item.fields.propertyName` (Contentful wrapper)

**Key Data Aggregation Points:**

1. **Programmes** (`/programmes/[slug]`) - Aggregates events, news, publications, videos by programme
2. **Projects** (`/projects/[slug]`) - Aggregates events, news, publications, videos by project
3. **Homepage** (`/`) - Featured content, upcoming events, latest blog
4. **Search** (`/search.json`) - All searchable content types
5. **News/Publications/Events listings** - Filtered and sorted collections

**Content Types in Use:**

```
Contentful Type          → Payload Collection       Status
─────────────────────────────────────────────────────────────
program                  → categories (type: programme)  ✅ Mapped
portfolio (projects)     → projects                     ✅ Mapped
event                    → events                       ✅ Mapped
news                     → news                         ✅ Mapped
blogPost                 → posts                        ✅ Mapped
publications             → publications                 ✅ Mapped
video                    → videos                       ✅ Mapped
publicationFeature       → publication-features         ✅ Mapped
unfssCop26 (event series)→ event-series                 ✅ Mapped
staff (team)             → teams                        ✅ Mapped
speaker                  → speakers                     ✅ Mapped
initiative               → initiatives                  ✅ Mapped
partners                 → collaborators                ✅ Mapped
newsletter               → (no equivalent - static?)    ⚠️ Needs Review
landingPage              → homepage                     ✅ Mapped
job                      → jobs                         ✅ Mapped
page (generic)           → pages                        ✅ Mapped
```

### Backend Architecture (tmg-cms - Payload)

**Collections Structure:**

- 26 collections organized in logical groups
- Tab-based data organization (Info/Content/Meta/SEO)
- Relationships properly configured
- Migration tracking fields (`contentfulId`, `migrationNotes`)
- Both published and draft states supported

**Data Structure:**

- Direct property access: `item.propertyName` (no `fields` wrapper)
- Nested tabs: `item.info.date`, `item.content.description`, `item.meta.title`
- Relationships: Can be full objects or IDs depending on depth

---

## 🔄 Data Structure Transformation Challenge

### The Critical Difference

**Contentful:**

```typescript
interface Event extends ContentfulEntry {
	fields: {
		title: string;
		date: string;
		programme: Programme; // Also has .fields wrapper
		speakers: Speaker[];
	};
}
// Access: event.fields.title
```

**Payload:**

```typescript
interface Event {
	title: string;
	info: {
		date: string;
		programme: Category | string; // Can be populated or just ID
	};
	relationships: {
		speakers: Speaker[] | string[];
	};
}
// Access: event.title, event.info.date
```

### Solution Approaches

**Option 1: Transform at API Level (RECOMMENDED)**
Create adapter functions in `payloadClient.ts` that wrap Payload responses:

```typescript
function adaptPayloadToContentful<T>(payloadData: T): ContentfulLike<T> {
	// Wrap in fields structure
	// Flatten nested tabs
	// Ensure consistent relationship structure
}
```

**Option 2: Update All Components**
Rewrite every component to use Payload structure directly - HIGH RISK

**Option 3: Hybrid Approach**

- New utility: `payloadAdapter.ts` with collection-specific adapters
- Gradual component updates
- Maintain backward compatibility during transition

---

## 📋 Migration Phases

### Phase 1: Backend Data Migration (WEEK 1)

#### 1.1 Environment Setup

- [ ] Set up `.env` with both Contentful (including preview token) and Payload configs
- [ ] Verify MongoDB connection
- [ ] Test Payload API accessibility
- [ ] Configure Contentful to include draft content

#### 1.2 Run All Migration Scripts (Updated)

**Priority Order (respecting relationships):**

```bash
# Foundation - no dependencies
pnpm migrate:staff              # Team members (referenced by many)
pnpm migrate:collaborators      # Partners/funders
pnpm migrate:speakers          # Event speakers

# Programmes & Topics (referenced by most content)
pnpm migrate:programmes        # Creates categories with type='programme'

# Projects (depend on programmes)
pnpm migrate:projects          # Needs programmes

# Content (depend on programmes/projects)
pnpm migrate:videos
pnpm migrate:publications      # Creates auto news entries
pnpm migrate:events            # Links speakers, programmes
pnpm migrate:news              # Links programmes, projects
pnpm migrate:blog-posts        # Links programmes, projects

# Complex pages (depend on above)
pnpm migrate:initiatives       # Rich content with relationships
pnpm migrate:publication-features
pnpm migrate:event-series      # Links events

# Utilities
pnpm migrate:jobs
pnpm migrate:generic-pages
```

#### 1.3 Update Migration Scripts for Draft Content

**Modify each script to fetch drafts:**

```typescript
// In each migrate-*.ts file
const url = `${baseUrl}/spaces/${spaceId}/entries?content_type=${contentType}&limit=1000&include=10`;
// Change to:
const url = `${baseUrl}/spaces/${spaceId}/entries?content_type=${contentType}&limit=1000&include=10&select=sys,fields`;
// And use preview API token instead of production token
```

**Or create new environment variable:**

```bash
SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
```

#### 1.4 Data Validation

- [ ] Run count verification for each collection
- [ ] Spot-check relationships (programmes → projects, events → speakers)
- [ ] Verify media uploads (thumbnails, PDFs, images)
- [ ] Check draft vs published status mapping

### Phase 2: Adapter Layer Development (WEEK 1-2)

#### 2.1 Create Payload Adapter Utilities

**File:** `tmg-svelte/src/lib/payloadAdapter.ts`

```typescript
import type * as PayloadTypes from './types/payload-types';
import type * as ContentfulTypes from './types/types';

// Generic wrapper to mimic Contentful structure
export function wrapInFields<T>(data: T): { fields: T } {
	return { fields: data };
}

// Collection-specific adapters
export function adaptPayloadProgramme(payload: PayloadTypes.Category): ContentfulTypes.Programme {
	return {
		fields: {
			title: payload.title || '',
			actionVerb: payload.info?.actionVerb || '',
			subtitle: payload.info?.summary || '',
			bannerPicture: payload.image ? [adaptMediaToCloudinary(payload.image)] : [],
			quote: payload.info?.valueProposition?.content || '',
			quoteAuthor: '',
			description: payload.info?.valueProposition?.content || '',
			featuredItems: [], // Would need to be populated
			topics: payload.info?.topics || [],
			slug: payload.slug || '',
			flagshipOutput: null,
			initiatives: []
		}
	};
}

export function adaptPayloadProject(payload: PayloadTypes.Project): ContentfulTypes.Project {
	return {
		fields: {
			name: payload.name || '',
			summary: payload.info?.summary || '',
			quote: payload.info?.quote || '',
			quoteAuthor: payload.info?.quoteAuthor || '',
			description: payload.content?.description || '',
			programme: payload.info?.programme
				? adaptPayloadProgramme(payload.info.programme as PayloadTypes.Category)
				: null,
			topics: [],
			year: payload.info?.year || '',
			partnersList: payload.info?.partnersList || [],
			fundersList: payload.info?.fundersList || [],
			contractingAuthorityList: payload.info?.contractingAuthorityList || [],
			thumbnail: payload.content?.thumbnail,
			thumbnailCdn: payload.thumbnailFromCloudinary
				? [{ secure_url: payload.thumbnailFromCloudinary }]
				: [],
			gallery: payload.content?.gallery || [],
			team: payload.relationships?.team || [],
			url: payload.info?.url || '',
			videos: payload.relationships?.videos || [],
			relatedProjects: payload.relationships?.relatedProjects || [],
			slug: payload.slug || ''
		}
	};
}

export function adaptPayloadEvent(payload: PayloadTypes.Event): ContentfulTypes.Event {
	return {
		fields: {
			title: payload.title || '',
			summary: payload.info?.summary || '',
			date: payload.info?.date || '',
			endDate: payload.info?.endDate || '',
			location: payload.info?.location || '',
			type: payload.info?.type || '',
			programme: payload.info?.programme
				? adaptPayloadProgramme(payload.info.programme as PayloadTypes.Category)
				: null,
			speakers: payload.relationships?.speakers || [],
			facilitators: payload.relationships?.facilitators || [],
			// ... map all other fields
			slug: payload.slug || ''
		}
	};
}

// Similar adapters for:
// - adaptPayloadNews
// - adaptPayloadPublication
// - adaptPayloadVideo
// - adaptPayloadBlogPost
// - adaptPayloadPublicationFeature
// - adaptPayloadEventSeries
// - adaptPayloadInitiative
// - adaptPayloadTeam
// - adaptPayloadSpeaker
```

#### 2.2 Update payloadClient.ts

Add wrapper functions that automatically adapt:

```typescript
export async function getAdaptedEvents(): Promise<ContentfulTypes.Event[]> {
	const payloadEvents = await fetchPayloadData<PayloadTypes.Event>('events');
	return payloadEvents.map(adaptPayloadEvent);
}

export async function getAdaptedProgrammes(): Promise<ContentfulTypes.Programme[]> {
	const payloadProgrammes = await getProgrammes();
	return payloadProgrammes.map(adaptPayloadProgramme);
}

// Etc for all collections...
```

### Phase 3: Frontend Integration (WEEK 2-3)

#### 3.1 Create Feature Flag System

**File:** `tmg-svelte/src/lib/config/features.ts`

```typescript
export const USE_PAYLOAD = process.env.SECRET_USE_PAYLOAD === 'true' || false;
export const PAYLOAD_URL = process.env.SECRET_PAYLOAD_URL || 'http://localhost:3000';
```

#### 3.2 Create Unified Data Client

**File:** `tmg-svelte/src/lib/dataClient.ts`

```typescript
import { USE_PAYLOAD } from './config/features';
import * as ContentfulClient from './contentfulClient';
import * as PayloadClient from './payloadClient';
import * as PayloadAdapter from './payloadAdapter';
import type * as Types from './types/types';

export async function fetchProgrammes(): Promise<Types.Programme[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedProgrammes();
	}
	return ContentfulClient.fetchContentfulData<Types.Programme>('program');
}

export async function fetchProjects(): Promise<Types.Project[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedProjects();
	}
	return ContentfulClient.fetchContentfulData<Types.Project>('portfolio');
}

export async function fetchEvents(): Promise<Types.Event[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedEvents();
	}
	return ContentfulClient.fetchContentfulData<Types.Event>('event');
}

export async function fetchNews(): Promise<Types.News[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedNews();
	}
	return ContentfulClient.fetchContentfulData<Types.News>('news');
}

export async function getEntryBySlug<T>(slug: string, collection: string): Promise<T | null> {
	if (USE_PAYLOAD) {
		const payloadCollection = mapContentfulToPayloadCollection(collection);
		const entry = await PayloadClient.getPayloadEntryBySlug(slug, payloadCollection);
		return entry ? adaptPayloadEntry(entry, collection) : null;
	}
	return ContentfulClient.getEntryBySlug<T>(slug, collection);
}

// Helper to map collection names
function mapContentfulToPayloadCollection(contentfulType: string): string {
	const mapping: Record<string, string> = {
		program: 'categories',
		portfolio: 'projects',
		event: 'events',
		news: 'news',
		blogPost: 'posts',
		publications: 'publications',
		video: 'videos',
		publicationFeature: 'publication-features',
		unfssCop26: 'event-series',
		staff: 'teams',
		speaker: 'speakers',
		initiative: 'initiatives',
		partners: 'collaborators',
		job: 'jobs',
		page: 'pages'
	};
	return mapping[contentfulType] || contentfulType;
}

function adaptPayloadEntry(entry: any, contentfulType: string): any {
	switch (contentfulType) {
		case 'program':
			return PayloadAdapter.adaptPayloadProgramme(entry);
		case 'portfolio':
			return PayloadAdapter.adaptPayloadProject(entry);
		case 'event':
			return PayloadAdapter.adaptPayloadEvent(entry);
		// ... all other types
		default:
			return entry;
	}
}
```

#### 3.3 Update All Route Load Functions

**Example:** `tmg-svelte/src/routes/+page.server.ts`

```typescript
// Before:
import { fetchContentfulData } from '$lib/contentfulClient';

// After:
import { fetchProgrammes, fetchEvents, fetchBlogPosts } from '$lib/dataClient';

export async function load({ setHeaders }) {
  try {
    const today = new Date();

    setHeaders({
      'Cache-Control': 'public, max-age=300, s-maxage=900',
      Vary: 'Accept-Encoding'
    });

    const [programmes, events, blogPosts] = await Promise.all([
      fetchProgrammes(),
      fetchEvents(),
      fetchBlogPosts()
    ]);

    // Rest of logic remains the same...
  }
}
```

**Files to Update (28 total):**

1. ✅ `+layout.server.ts`
2. ✅ `+page.server.ts`
3. ✅ `about/+page.server.ts`
4. ✅ `blog/+page.server.ts`
5. ✅ `blog/[slug]/+page.server.js`
6. ✅ `contact/+page.server.ts`
7. ✅ `events/+page.server.js`
8. ✅ `events/[slug]/+page.server.js`
9. ✅ `event-series/[slug]/+page.server.js`
10. ✅ `featured/human-rights-land-navigator/+page.server.js`
11. ✅ `initiatives/[slug]/+page.server.ts`
12. ✅ `jobs/+page.server.js`
13. ✅ `legal/[slug]/+page.server.js`
14. ✅ `news/+page.server.js`
15. ✅ `news/[slug]/+page.server.ts`
16. ✅ `newsletter/+page.server.ts`
17. ✅ `programmes/[slug]/+page.server.js`
18. ✅ `projects/[slug]/+page.server.js`
19. ✅ `publication-feature/+page.server.js`
20. ✅ `publication-feature/[slug]/+page.server.js`
21. ✅ `publications/+page.server.ts`
22. ✅ `publications/[slug]/+page.server.ts`
23. ✅ `reports/+page.server.ts`
24. ✅ `reports/[slug]/+page.server.ts`
25. ✅ `search.json/+server.ts`
26. ✅ `speaker/[slug]/+page.server.js`
27. ✅ `team/+page.server.ts`
28. ✅ `team/[slug]/+page.server.js`
29. ✅ `video/[slug]/+page.server.js`
30. ✅ `videos/+page.server.js`

### Phase 4: Testing & Validation (WEEK 3-4)

#### 4.1 Local Testing

**Test Scenarios:**

1. Homepage loads with correct featured content
2. Programme pages show filtered events/news/publications/videos
3. Project pages show filtered content by project
4. Search functionality returns all content types
5. Individual detail pages (events, news, publications, etc.)
6. Team member and speaker profiles
7. Publication features and event series
8. Related content shows correctly
9. Media (images, PDFs, videos) load properly
10. Rich text rendering works

**Test with both flags:**

```bash
# Test with Contentful (baseline)
SECRET_USE_PAYLOAD=false pnpm dev

# Test with Payload (new)
SECRET_USE_PAYLOAD=true pnpm dev
```

#### 4.2 Comparison Testing

Create a test script to compare responses:

**File:** `tmg-svelte/scripts/compare-cms-responses.ts`

```typescript
import { fetchContentfulData } from '../src/lib/contentfulClient';
import { fetchPayloadData } from '../src/lib/payloadClient';
import { adaptPayloadProgramme } from '../src/lib/payloadAdapter';

async function compare() {
	console.log('Comparing CMS responses...\n');

	// Compare programmes
	const contentfulProgrammes = await fetchContentfulData('program');
	const payloadCategories = await fetchPayloadData('categories');
	const adaptedPayload = payloadCategories.map(adaptPayloadProgramme);

	console.log(`Contentful Programmes: ${contentfulProgrammes.length}`);
	console.log(`Payload Programmes: ${adaptedPayload.length}`);

	// Compare structure
	if (contentfulProgrammes.length > 0 && adaptedPayload.length > 0) {
		console.log('\nContentful structure:', JSON.stringify(contentfulProgrammes[0], null, 2));
		console.log('\nPayload structure:', JSON.stringify(adaptedPayload[0], null, 2));
	}

	// Repeat for other collections...
}

compare().catch(console.error);
```

#### 4.3 Visual Regression Testing

Use browser tools to compare:

1. Take screenshots of key pages with Contentful
2. Take screenshots of same pages with Payload
3. Compare pixel-by-pixel

Tools: Playwright, Percy, or manual comparison

### Phase 5: Deployment Strategy (WEEK 4)

#### 5.1 Staged Rollout

**Stage 1: Beta Environment**

- Deploy to staging/preview environment
- Set `SECRET_USE_PAYLOAD=true`
- Internal team testing
- Fix any issues

**Stage 2: Canary Deployment**

- Deploy to production with `SECRET_USE_PAYLOAD=false` (still Contentful)
- Verify production environment stable
- Switch flag to `true` for 10% of traffic
- Monitor errors, performance

**Stage 3: Full Rollout**

- Increase to 50% traffic
- Monitor for 24 hours
- If stable, move to 100%
- Keep Contentful as fallback for 1 week

**Stage 4: Cleanup**

- Remove Contentful dependencies
- Remove adapter layer (optional - can keep for abstraction)
- Remove feature flags
- Archive Contentful data

#### 5.2 Rollback Plan

If issues arise:

1. Set `SECRET_USE_PAYLOAD=false`
2. Redeploy
3. Investigate issues
4. Fix and re-test in staging

---

## 🔧 Technical Implementation Details

### Relationship Handling

**Programme/Project Filtering Pattern:**

Current Contentful approach in components:

```typescript
// Filter events by programme
filteredEvents = events.filter(
	(event) => event.fields?.programme?.fields?.title === programme?.fields?.title
);

// Filter by project
filteredNews = news.filter((newsItem) =>
	newsItem.fields.project?.some((p) => p?.fields?.name === project?.fields?.name)
);
```

Must maintain this pattern - adapter needs to ensure:

- Relationships are fully populated (depth=2 minimum)
- Nested `.fields` structure maintained
- Array relationships return full objects, not just IDs

### Media Handling

**Contentful:**

- Images: `item.fields.image.fields.file.url` (Contentful CDN)
- Cloudinary: `item.fields.imageCdn[0].secure_url`

**Payload:**

- Local: `item.content.thumbnail.url` (uploaded to Payload)
- Cloudinary: `item.thumbnailFromCloudinary` (string URL)

**Adapter must:**

- Convert Payload media to Contentful structure
- Support both local uploads and Cloudinary URLs
- Maintain thumbnail URLs for PDFs

### Rich Text Rendering

**Contentful:** Document format (requires `@contentful/rich-text-html-renderer`)
**Payload:** Lexical format (requires custom renderer or Lexical → HTML)

**Solution:**

1. Keep Contentful rich text renderer
2. Adapter converts Lexical to Contentful document format
3. Or: Create new Lexical renderer matching current output

**File:** `tmg-svelte/src/lib/utils/lexicalToHtml.ts`

```typescript
export function convertLexicalToContentfulDoc(lexical: any): any {
	// Convert Lexical JSON to Contentful document structure
	// This maintains compatibility with existing renderRichText()
}
```

### Caching Strategy

**Current:** In-memory cache in `contentfulClient.ts`
**New:**

- Keep in-memory cache in `dataClient.ts`
- Payload has built-in caching
- Consider Redis for production

**Cache invalidation:**

- Payload webhook → clear cache
- Or time-based (current 5-30 min TTLs)

---

## 📊 Data Completeness Checklist

After migration, verify these data points:

### Critical Fields by Collection

**Programmes (Categories):**

- [ ] Title, slug, summary
- [ ] Banner images (convert to imageCdn format)
- [ ] Topics (nested array)
- [ ] Value proposition, aim & service content

**Projects:**

- [ ] Name, slug, summary, description
- [ ] Programme relationship (single)
- [ ] Topics relationship (array)
- [ ] Partners, funders, contracting authorities
- [ ] Team members relationship
- [ ] Videos, related projects relationships
- [ ] Thumbnail (local or Cloudinary)
- [ ] Gallery images

**Events:**

- [ ] Title, slug, summary, type
- [ ] Date, end date, location
- [ ] Programme relationship
- [ ] Speakers, facilitators relationships
- [ ] News, related events relationships
- [ ] Video relationships
- [ ] Images (banner, thumbnail)

**News:**

- [ ] Title, slug, summary, type
- [ ] Date (dateFormat field)
- [ ] Programme (primary), secondProgramme
- [ ] Projects relationship (array)
- [ ] Author (text), authorTmg (relationship)
- [ ] Related news, publications
- [ ] External publication handling
- [ ] Video relationship

**Publications:**

- [ ] Title, slug, summary, category
- [ ] Programme, project relationships
- [ ] Author, authorTmg
- [ ] Publication date
- [ ] Keywords
- [ ] PDF file
- [ ] Thumbnail
- [ ] DOI information
- [ ] Citation text
- [ ] automatedNewsEntry flag

**Blog Posts (Posts):**

- [ ] Title, slug, summary
- [ ] Date (publishedAt)
- [ ] Programme, secondProgramme
- [ ] Projects relationship (array)
- [ ] Author, authorTmg
- [ ] Rich text content
- [ ] Related news, publications
- [ ] Video relationship

**Videos:**

- [ ] Title, slug, summary
- [ ] Date
- [ ] Video ID (YouTube)
- [ ] URL
- [ ] Programmes, projects relationships
- [ ] Event series relationship
- [ ] automatedNewsEntry flag

**Event Series:**

- [ ] Title, slug, summary
- [ ] Featured on homepage flag
- [ ] Cutoff date
- [ ] Events relationship (array)
- [ ] News, publications relationships
- [ ] Gallery images
- [ ] Colors

**Publication Features:**

- [ ] Title, slug, summary
- [ ] Featured on homepage flag
- [ ] Hero banner content
- [ ] Sections (content blocks)
- [ ] Events, news, documents relationships
- [ ] Partner logos
- [ ] Gallery, page banner images
- [ ] Colors

**Initiatives:**

- [ ] Title, slug, summary
- [ ] Multiple sections (1-5) with headings, text, images
- [ ] Events, news, publications relationships
- [ ] Partners relationship
- [ ] Multiple quotes (1-6)
- [ ] Gallery, slides
- [ ] Video relationship
- [ ] Colors

**Team Members (Teams):**

- [ ] Name, slug, position
- [ ] Bio
- [ ] Picture
- [ ] LinkedIn, Twitter, Email

**Speakers:**

- [ ] Name, slug, position
- [ ] Organisation, organisationUrl
- [ ] Bio
- [ ] Picture
- [ ] Twitter, Email

**Collaborators (Partners):**

- [ ] Name
- [ ] Logo
- [ ] URL
- [ ] Partner or Funder type

---

## 🚨 Risk Mitigation

### High-Risk Areas

1. **Relationship Population**
   - Risk: IDs returned instead of full objects
   - Mitigation: Always use `depth=2` or higher in Payload queries
   - Test: Verify nested relationships load in adapters

2. **Rich Text Rendering**
   - Risk: Lexical format doesn't match Contentful
   - Mitigation: Build robust converter or dual renderer
   - Test: Compare HTML output on detail pages

3. **Image URLs**
   - Risk: Broken images after migration
   - Mitigation: Adapter handles both local and Cloudinary
   - Test: Visual check on all pages

4. **Search Functionality**
   - Risk: Different data structure breaks search
   - Mitigation: Adapter normalizes all content types
   - Test: Search for content from each type

5. **Programme/Project Filtering**
   - Risk: Nested comparison breaks
   - Mitigation: Ensure adapters maintain `.fields` nesting
   - Test: Check all filtered sections on programme/project pages

### Monitoring

Post-deployment monitoring:

- Server errors (500s)
- Client errors (console errors)
- Missing images (404s)
- Slow API calls (>2s)
- Memory usage (cache growth)

---

## 📅 Timeline Summary

| Phase                         | Duration | Key Deliverables                                    |
| ----------------------------- | -------- | --------------------------------------------------- |
| Phase 1: Backend Migration    | Week 1   | All content migrated to Payload, including drafts   |
| Phase 2: Adapter Layer        | Week 1-2 | Complete adapter library, all collections supported |
| Phase 3: Frontend Integration | Week 2-3 | All routes updated, feature flag implemented        |
| Phase 4: Testing              | Week 3-4 | Comprehensive testing, bug fixes                    |
| Phase 5: Deployment           | Week 4   | Staged rollout, monitoring, cleanup                 |

**Total Estimated Time:** 4-5 weeks

---

## ✅ Success Criteria

Migration is successful when:

1. ✅ All content types migrated (including drafts)
2. ✅ Zero visual differences between Contentful and Payload versions
3. ✅ All relationships working correctly
4. ✅ Search returns expected results
5. ✅ Programme/project filtering works
6. ✅ Media (images, PDFs) load correctly
7. ✅ Rich text renders identically
8. ✅ Performance is equal or better
9. ✅ SEO metadata unchanged
10. ✅ No console errors
11. ✅ Successful production deployment
12. ✅ Zero downtime during switch

---

## 📝 Next Steps

1. **Get approval** on this roadmap
2. **Set up tracking** (GitHub project, Jira, etc.)
3. **Create git branch** for migration work
4. **Begin Phase 1** - Update migration scripts for drafts
5. **Schedule** regular check-ins during migration

---

## 🔗 Key Files Reference

### To Create:

- `tmg-svelte/src/lib/payloadAdapter.ts` - All adapter functions
- `tmg-svelte/src/lib/dataClient.ts` - Unified CMS client
- `tmg-svelte/src/lib/config/features.ts` - Feature flags
- `tmg-svelte/scripts/compare-cms-responses.ts` - Testing tool

### To Update:

- All 28+ route `+page.server.ts/js` files
- `tmg-svelte/src/lib/payloadClient.ts` - Add adapted getters
- Migration scripts in `tmg-cms/migration-scripts-old/` - Add draft support
- `.env` files - Add `SECRET_USE_PAYLOAD` and preview token

### Key Dependencies:

- `@contentful/rich-text-html-renderer` - Keep for now
- Consider: `@payloadcms/richtext-lexical` for future

---

## 💡 Optimization Opportunities

While migrating, consider:

1. **Remove transformation overhead** - Publications/videos → news transformations
2. **Improve caching** - Redis instead of in-memory
3. **Reduce API calls** - Payload's depth feature is powerful
4. **Static generation** - Some pages can be pre-rendered
5. **Incremental static regeneration** - SvelteKit supports this
6. **Better type safety** - Leverage Payload's auto-generated types

---

**Document Version:** 1.0  
**Last Updated:** January 6, 2026  
**Author:** AI Assistant  
**Status:** Ready for Review
