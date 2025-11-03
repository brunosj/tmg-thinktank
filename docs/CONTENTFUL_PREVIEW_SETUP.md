# Contentful Preview Mode Setup

This guide explains how to set up and deploy a preview environment for your TMG Svelte site that can handle draft content from Contentful.

## Environment Variables

For your preview deployment, you need to set these environment variables:

### Required Variables
```bash
# Standard Contentful variables (same as production)
SECRET_CONTENTFUL_SPACE_ID=your_space_id
SECRET_CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token
PUBLIC_CONTENTFUL_HOST=cdn.contentful.com

# Preview-specific variables
SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_api_token
```

### Optional Preview Detection Variables
You can also use these to explicitly enable preview mode:
```bash
VERCEL_ENV=preview
# OR
NODE_ENV=preview
# OR
PUBLIC_CONTENTFUL_HOST=preview.contentful.com
```

## How It Works

The system automatically detects preview mode based on:

1. **Preview Access Token**: If `SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN` is set
2. **Environment Detection**: Development mode, or `VERCEL_ENV=preview`, or `NODE_ENV=preview`
3. **Host Detection**: If `PUBLIC_CONTENTFUL_HOST=preview.contentful.com`

When preview mode is detected:
- ✅ Uses Contentful Preview API (`preview.contentful.com`)
- ✅ Fetches draft/unpublished content
- ✅ Disables prerendering for dynamic routes
- ✅ Handles missing slugs gracefully
- ✅ Skips entries generation to prevent build failures

## Getting Your Preview Access Token

1. Go to your Contentful space
2. Navigate to **Settings > API keys**
3. Find your existing API key or create a new one
4. Copy the **Content Preview API - access token** (not the Content Delivery API token)

## Deployment Setup

### Vercel
1. Go to your project settings
2. Add the environment variables above
3. Deploy to a preview branch or environment
4. The system will automatically detect preview mode

### Other Platforms
Set the environment variables in your deployment platform and ensure `NODE_ENV=preview` or use one of the other detection methods.

## Content Preview in Contentful

1. In Contentful, go to **Settings > Content preview**
2. Add a new preview platform
3. Set the preview URL to your preview deployment:
   ```
   https://your-preview-domain.com/blog/{entry.fields.slug}
   https://your-preview-domain.com/events/{entry.fields.slug}
   https://your-preview-domain.com/programmes/{entry.fields.slug}
   ```
4. Select the content types you want to preview

## Troubleshooting

### Build Fails with "Missing parameter 'slug'"
This happens when draft entries don't have slugs yet. The updated code now:
- Filters out entries without slugs during prerendering
- Disables prerendering entirely in preview mode
- Logs warnings for missing slugs instead of failing

### Preview Content Not Showing
- Verify `SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN` is set correctly
- Check the console logs for "PREVIEW mode" confirmation
- Ensure the content is actually in draft status in Contentful

### Performance Considerations
- Preview mode disables caching for dynamic content
- Only use preview deployments for content review, not production traffic
- Consider separate preview and production deployments

## Routes Affected

The following dynamic routes now support preview mode:
- `/blog/[slug]`
- `/events/[slug]`
- `/programmes/[slug]`
- `/projects/[slug]`
- `/legal/[slug]`
- `/publication-feature/[slug]`
- `/speaker/[slug]`
- `/initiatives/[slug]`

All routes will gracefully handle missing slugs and disable prerendering in preview mode.

## Summary of Changes Made

### 1. Enhanced Contentful Client (`src/lib/contentfulClient.ts`)
- Added automatic preview mode detection
- Uses preview API when appropriate environment variables are set
- Falls back to production mode for builds
- Exports `isPreviewMode` for use in other modules

### 2. Updated Dynamic Routes
- Modified all `[slug]` routes to handle missing slugs gracefully
- Added conditional prerendering based on preview mode
- Enhanced `entries()` functions to filter out incomplete entries

### 3. Environment Variable Handling
- Uses `process.env` directly for preview token to avoid build errors
- Updated TypeScript declarations in `app.d.ts`

### 4. Build Safety
- Production builds always use production mode regardless of preview token
- Graceful error handling for missing or incomplete content
- Comprehensive logging for debugging

The implementation ensures that:
- ✅ Production builds work reliably
- ✅ Preview deployments can handle draft content
- ✅ Missing slugs don't break the build process
- ✅ Clear logging helps with debugging
- ✅ Follows Svelte 5 best practices
