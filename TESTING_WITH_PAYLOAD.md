# Testing Frontend with Payload CMS

This guide walks you through testing the tmg-svelte frontend with Payload CMS instead of Contentful.

## 🏗️ Current Architecture

The frontend uses a **unified data client** (`src/lib/dataClient.ts`) that:
- Switches between Contentful and Payload based on `USE_PAYLOAD` feature flag
- Maintains consistent return types using adapters
- Allows gradual migration without breaking the frontend

## ✅ What's Ready to Test

These collections are fully adapted and ready:

- ✅ **Programmes** (`/programmes`)
- ✅ **Projects** (`/projects`)  
- ✅ **Events** (`/events`)
- ✅ **News** (`/news`)
- ✅ **Blog Posts** (`/blog`)
- ✅ **Publications** (`/publications`)
- ✅ **Videos** (`/videos`)
- ✅ **Team** (`/team`)
- ✅ **Speakers** (`/speaker`)

## ⚠️ What's Not Migrated Yet

These content types don't exist in Payload (homepage will show empty sections):

- ❌ **Landing Page** content
- ❌ **Partners**
- ❌ **Newsletter** signup data
- ❌ **Publication Features**
- ❌ **Event Series**

---

## 🚀 Step-by-Step Testing

### **1. Set Up Environment Variables**

In `tmg-svelte/.env`:

```bash
# Enable Payload CMS
SECRET_USE_PAYLOAD=true

# Payload API Configuration
SECRET_PAYLOAD_URL=http://localhost:3000
SECRET_PAYLOAD_API_KEY=your-api-key-here

# Optional: Debug mode
DEBUG_CMS=true
```

To get your API key:
1. Go to `http://localhost:3000/admin`
2. Navigate to Settings → API Keys
3. Create a new key or use existing one

---

### **2. Start Payload CMS**

```bash
cd tmg-cms
pnpm dev
```

✅ Payload should be running on `http://localhost:3000`

---

### **3. Migrate Data to Payload**

If you haven't already:

```bash
cd tmg-cms

# Run all migrations
pnpm migrate:all

# Or specific migrations
pnpm migrate:blog-posts
pnpm migrate:events
pnpm migrate:news
# etc.
```

Verify data in admin: `http://localhost:3000/admin`

---

### **4. Start Frontend**

```bash
cd tmg-svelte
pnpm dev
```

✅ Frontend should be running on `http://localhost:5173`

---

### **5. Test Pages**

#### **Homepage (`/`)**
- ✅ **Will work**: Blog posts, events, programmes
- ⚠️ **Will be empty**: Landing page hero, partners, newsletter, publication features, event series
- **Expected**: Page renders but some sections are missing/empty

#### **Blog (`/blog`)**
```bash
# Should display all migrated blog posts from Payload
http://localhost:5173/blog
```

#### **Events (`/events`)**
```bash
# Should display all migrated events from Payload
http://localhost:5173/events
```

#### **News (`/news`)**
```bash
# Should display all migrated news from Payload
http://localhost:5173/news
```

#### **Publications (`/publications`)**
```bash
# Should display all migrated publications from Payload
http://localhost:5173/publications
```

#### **Individual Post**
```bash
# Replace with actual slug from your migrated data
http://localhost:5173/blog/[slug]
```

---

## 🔍 Debugging

### **Check Which CMS is Active**

With `DEBUG_CMS=true`, you'll see in server logs:

```
🔧 CMS Mode: PAYLOAD
   Payload URL: http://localhost:3000
```

### **Common Issues**

**1. Data Not Loading**
```bash
# Check Payload is running
curl http://localhost:3000/api/posts

# Check API key is correct
# Verify in tmg-svelte/.env
```

**2. Type Errors**
```bash
# The adapters transform Payload types → Contentful types
# If you see type errors, check src/lib/payloadAdapter.ts
```

**3. Missing Collections**
```bash
# Some content types aren't migrated yet
# Check console for warnings like:
⚠️  Content type "landingPage" not yet migrated to Payload
```

---

## 📊 Testing Checklist

### Basic Functionality
- [ ] Homepage loads without errors
- [ ] Blog listing page shows posts
- [ ] Individual blog post page works
- [ ] Events listing shows events
- [ ] News listing shows news
- [ ] Publications listing works
- [ ] Team page displays staff
- [ ] Videos page works

### Data Integrity
- [ ] Images load correctly
- [ ] Rich text content renders properly
- [ ] Relationships (authors, programmes, etc.) work
- [ ] Dates format correctly
- [ ] Slugs generate URLs properly

### Performance
- [ ] Pages load in reasonable time
- [ ] No N+1 query issues
- [ ] Caching works as expected

---

## 🔄 Switching Back to Contentful

To switch back to Contentful:

```bash
# In tmg-svelte/.env
SECRET_USE_PAYLOAD=false
```

Restart the dev server and it will use Contentful again.

---

## 📝 Next Steps

To complete the migration:

1. **Create Missing Collections** in Payload:
   - Landing Page (or use existing `pages` collection)
   - Partners (or decide if needed)
   - Newsletter signups (different approach needed)

2. **Add Adapters** for new collections in:
   - `src/lib/payloadClient.ts`
   - `src/lib/payloadAdapter.ts`
   - `src/lib/dataClient.ts`

3. **Update Components** that depend on Contentful-specific fields

4. **Test Production Build**:
   ```bash
   cd tmg-svelte
   pnpm build
   pnpm preview
   ```

---

## 🐛 Known Limitations

1. **Homepage Hero Section**: Will be empty until Landing Page is migrated
2. **Partners Section**: Not implemented in Payload yet
3. **Newsletter**: May need different approach (form submission vs. CMS content)
4. **Preview Mode**: Not yet implemented for Payload
5. **Incremental Static Regeneration**: May need adjustment for Payload

---

## 💡 Tips

- **Start with individual pages** (blog, events, news) before testing homepage
- **Use DEBUG_CMS=true** to see which CMS is being used
- **Check Payload admin** to verify data structure matches expectations
- **Compare Contentful vs Payload** responses to debug adapter issues
- **Test in incognito** to avoid cache issues

---

## 📚 Helpful Commands

```bash
# Check Payload API directly
curl http://localhost:3000/api/posts?limit=5

# Check specific post
curl http://localhost:3000/api/posts?where[slug][equals]=my-post-slug

# View all collections
curl http://localhost:3000/api/

# Clear SvelteKit cache
rm -rf .svelte-kit
```

---

## 🆘 Getting Help

If you encounter issues:

1. Check server logs (both Payload and SvelteKit)
2. Verify data exists in Payload admin
3. Test Payload API directly with curl
4. Check adapter functions in `payloadAdapter.ts`
5. Compare with Contentful structure in browser DevTools


