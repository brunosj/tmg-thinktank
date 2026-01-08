# Payload to Contentful Adapter Implementation Guide

This document provides detailed code examples for implementing the adapter layer that transforms Payload CMS data structures into Contentful-compatible formats.

---

## 🎯 Purpose

The adapter layer ensures **zero code changes** to Svelte components by maintaining the exact Contentful data structure that components expect, while fetching data from Payload CMS.

---

## 📁 File Structure

```
tmg-svelte/src/lib/
├── payloadAdapter.ts          # Main adapter functions
├── dataClient.ts              # Unified CMS client with feature flags
├── payloadClient.ts           # Enhanced with adapted getters
├── contentfulClient.ts        # Existing (keep for fallback)
└── config/
    └── features.ts            # Feature flags
```

---

## 1. Feature Flags Configuration

**File:** `src/lib/config/features.ts`

```typescript
// Feature flags for CMS switching
export const USE_PAYLOAD = process.env.SECRET_USE_PAYLOAD === 'true' || false;
export const PAYLOAD_URL = process.env.SECRET_PAYLOAD_URL || 'http://localhost:3000';
export const PAYLOAD_API_KEY = process.env.SECRET_PAYLOAD_API_KEY || '';

// Debug logging
export const DEBUG_CMS = process.env.DEBUG_CMS === 'true' || false;

// Log which CMS is being used
if (DEBUG_CMS) {
  console.log(`🔧 Using ${USE_PAYLOAD ? 'PAYLOAD' : 'CONTENTFUL'} CMS`);
}
```

---

## 2. Core Adapter Functions

**File:** `src/lib/payloadAdapter.ts`

```typescript
import type * as PayloadTypes from './types/payload-types';
import type * as ContentfulTypes from './types/types';
import { DEBUG_CMS } from './config/features';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safely get nested property value
 */
function get(obj: any, path: string, defaultValue: any = null): any {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result?.[key] === undefined) return defaultValue;
    result = result[key];
  }
  return result;
}

/**
 * Check if relationship is populated (object) or just an ID (string)
 */
function isPopulated(rel: any): boolean {
  return rel && typeof rel === 'object' && !Array.isArray(rel);
}

/**
 * Convert Payload media to Contentful Image format
 */
function adaptMedia(media: any): ContentfulTypes.Image | null {
  if (!media) return null;
  
  // If it's a string (ID), we can't adapt it properly
  if (typeof media === 'string') {
    console.warn('Media not populated, cannot adapt');
    return null;
  }

  return {
    fields: {
      title: media.alt || media.filename || '',
      description: media.caption || '',
      file: {
        url: media.url || ''
      }
    }
  };
}

/**
 * Convert Cloudinary URL to Contentful ImageCdn format
 */
function adaptCloudinaryMedia(url: string | null | undefined, caption: string = ''): ContentfulTypes.ImageCdn[] {
  if (!url) return [];
  
  return [{
    secure_url: url,
    context: {
      custom: {
        caption: caption
      }
    }
  }];
}

/**
 * Adapt array of media (handles both local uploads and Cloudinary)
 */
function adaptMediaArray(items: any[], cloudinaryField?: string): ContentfulTypes.ImageCdn[] {
  if (!items || !Array.isArray(items)) return [];
  
  return items.map((item, index) => {
    // If item is a Cloudinary URL string
    if (typeof item === 'string') {
      return {
        secure_url: item,
        context: {
          custom: {
            caption: ''
          }
        }
      };
    }
    
    // If item is a media object
    if (isPopulated(item)) {
      return {
        secure_url: item.url || '',
        context: {
          custom: {
            caption: item.caption || item.alt || ''
          }
        }
      };
    }
    
    return null;
  }).filter(Boolean) as ContentfulTypes.ImageCdn[];
}

/**
 * Convert Lexical rich text to Contentful document format
 * This is a simplified version - may need to be more comprehensive
 */
function adaptLexicalToContentfulDoc(lexical: any): any {
  if (!lexical) return null;
  
  // If it's already a string, return as plain text document
  if (typeof lexical === 'string') {
    return {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: lexical,
              marks: [],
              data: {}
            }
          ]
        }
      ]
    };
  }
  
  // TODO: Implement full Lexical → Contentful document conversion
  // For now, extract text content
  return lexical;
}

// ============================================================================
// COLLECTION ADAPTERS
// ============================================================================

/**
 * Adapt Payload Category (type: programme) to Contentful Programme
 */
export function adaptPayloadProgramme(
  payload: PayloadTypes.Category | string
): ContentfulTypes.Programme {
  // If just an ID, return minimal structure
  if (typeof payload === 'string') {
    return {
      fields: {
        title: '',
        actionVerb: '',
        subtitle: '',
        bannerPicture: [],
        quote: '',
        quoteAuthor: '',
        description: '',
        featuredItems: [],
        topics: [],
        slug: '',
        flagshipOutput: null,
        initiatives: []
      }
    };
  }

  return {
    fields: {
      title: payload.title || '',
      actionVerb: get(payload, 'info.actionVerb', ''),
      subtitle: get(payload, 'info.summary', ''),
      bannerPicture: payload.image ? adaptMediaArray([payload.image]) : [],
      quote: get(payload, 'info.valueProposition.content', ''),
      quoteAuthor: '',
      description: adaptLexicalToContentfulDoc(get(payload, 'info.valueProposition.content')),
      featuredItems: [], // Would need separate query
      topics: get(payload, 'info.topics', []).map((t: any) => 
        isPopulated(t) ? adaptPayloadTopic(t) : null
      ).filter(Boolean),
      slug: payload.slug || '',
      flagshipOutput: null, // Would need separate query
      initiatives: [] // Would need separate query
    }
  };
}

/**
 * Adapt Payload Category (type: topic) to Contentful Topic
 */
export function adaptPayloadTopic(
  payload: PayloadTypes.Category | string
): ContentfulTypes.Topic {
  if (typeof payload === 'string') {
    return {
      fields: {
        title: '',
        summary: '',
        programmes: [],
        descriptionIntro: '',
        description: '',
        image: null,
        imageCdn: [],
        projects: [],
        slug: ''
      }
    };
  }

  return {
    fields: {
      title: payload.title || '',
      summary: get(payload, 'info.summary', ''),
      programmes: [],
      descriptionIntro: '',
      description: adaptLexicalToContentfulDoc(get(payload, 'info.valueProposition.content')),
      image: payload.image ? adaptMedia(payload.image) : null,
      imageCdn: payload.image ? adaptMediaArray([payload.image]) : [],
      projects: [],
      slug: payload.slug || ''
    }
  };
}

/**
 * Adapt Payload Project to Contentful Project
 */
export function adaptPayloadProject(
  payload: PayloadTypes.Project | string
): ContentfulTypes.Project {
  if (typeof payload === 'string') {
    return {
      fields: {
        name: '',
        summary: '',
        quote: '',
        quoteAuthor: '',
        description: '',
        programme: null,
        topics: [],
        year: '',
        partnersList: [],
        fundersList: [],
        contractingAuthorityList: [],
        thumbnail: null,
        thumbnailCdn: [],
        gallery: [],
        team: [],
        url: '',
        videos: [],
        relatedProjects: [],
        slug: ''
      }
    };
  }

  const info = get(payload, 'info', {});
  const content = get(payload, 'content', {});
  const relationships = get(payload, 'relationships', {});

  return {
    fields: {
      name: payload.name || '',
      summary: info.summary || '',
      quote: info.quote || '',
      quoteAuthor: info.quoteAuthor || '',
      description: adaptLexicalToContentfulDoc(content.description),
      programme: isPopulated(info.programme) 
        ? adaptPayloadProgramme(info.programme as PayloadTypes.Category)
        : null,
      topics: Array.isArray(info.topics) 
        ? info.topics.map((t: any) => isPopulated(t) ? adaptPayloadTopic(t) : null).filter(Boolean)
        : [],
      year: info.year || '',
      partnersList: Array.isArray(info.partnersList)
        ? info.partnersList.map((p: any) => ({
            fields: {
              partnerOrFunder: 'Partner',
              name: p.partner || '',
              logo: null,
              logoCdn: [],
              url: ''
            }
          }))
        : [],
      fundersList: Array.isArray(info.fundersList)
        ? info.fundersList.map((f: any) => ({
            fields: {
              partnerOrFunder: 'Funder',
              name: f.funder || '',
              logo: null,
              logoCdn: [],
              url: ''
            }
          }))
        : [],
      contractingAuthorityList: Array.isArray(info.contractingAuthorityList)
        ? info.contractingAuthorityList.map((a: any) => ({
            fields: {
              partnerOrFunder: 'Authority',
              name: a.authority || '',
              logo: null,
              logoCdn: [],
              url: ''
            }
          }))
        : [],
      thumbnail: content.thumbnail ? adaptMedia(content.thumbnail) : null,
      thumbnailCdn: payload.thumbnailFromCloudinary 
        ? adaptCloudinaryMedia(payload.thumbnailFromCloudinary)
        : (content.thumbnail ? adaptMediaArray([content.thumbnail]) : []),
      gallery: Array.isArray(content.gallery)
        ? adaptMediaArray(content.gallery.map((g: any) => g.image))
        : [],
      team: Array.isArray(relationships.team)
        ? relationships.team.map((t: any) => isPopulated(t) ? adaptPayloadTeam(t) : null).filter(Boolean)
        : [],
      url: info.url || '',
      videos: Array.isArray(relationships.videos)
        ? relationships.videos.map((v: any) => isPopulated(v) ? adaptPayloadVideo(v) : null).filter(Boolean)
        : [],
      relatedProjects: Array.isArray(relationships.relatedProjects)
        ? relationships.relatedProjects.map((p: any) => isPopulated(p) ? adaptPayloadProject(p) : null).filter(Boolean)
        : [],
      slug: payload.slug || ''
    }
  };
}

/**
 * Adapt Payload Event to Contentful Event
 */
export function adaptPayloadEvent(
  payload: PayloadTypes.Event | string
): ContentfulTypes.Event {
  if (typeof payload === 'string') {
    return {
      fields: {
        title: '',
        summary: '',
        date: '',
        endDate: '',
        location: '',
        type: '',
        programme: null,
        speakers: [],
        facilitators: [],
        slug: '',
        // ... other required fields
      } as any
    };
  }

  const info = get(payload, 'info', {});
  const content = get(payload, 'content', {});
  const relationships = get(payload, 'relationships', {});

  return {
    fields: {
      topBanner: info.topBanner ? adaptMediaArray(info.topBanner) : [],
      featureOnEventsPage: info.featured || false,
      programme: isPopulated(info.programme)
        ? adaptPayloadProgramme(info.programme as PayloadTypes.Category)
        : null,
      title: payload.title || '',
      secondLanguage: info.secondLanguage || '',
      titleSecondLanguage: info.titleSecondLanguage || '',
      summary: info.summary || '',
      keywords: info.keywords || [],
      tmgMainOrganizer: info.tmgMainOrganizer || false,
      organiser: info.organizer || [],
      type: info.type || '',
      date: info.date || '',
      endDate: info.endDate || '',
      location: info.location || '',
      language: info.language || [],
      eventUrl: info.eventUrl || '',
      description: adaptLexicalToContentfulDoc(content.description),
      background: adaptLexicalToContentfulDoc(content.background),
      video: null, // Would need to populate
      speakers: Array.isArray(relationships.speakers)
        ? relationships.speakers.map((s: any) => isPopulated(s) ? adaptPayloadSpeaker(s) : null).filter(Boolean)
        : [],
      facilitators: Array.isArray(relationships.facilitators)
        ? relationships.facilitators.map((f: any) => isPopulated(f) ? adaptPayloadSpeaker(f) : null).filter(Boolean)
        : [],
      image: content.image ? adaptMedia(content.image) : null,
      imageCdn: content.imageCdn ? adaptMediaArray(content.imageCdn) : [],
      contactPerson: Array.isArray(info.contactPerson)
        ? info.contactPerson.map((c: any) => isPopulated(c) ? adaptPayloadTeam(c) : null).filter(Boolean)
        : [],
      contactPersonEmail: info.contactPersonEmail || '',
      imagePosition: info.imagePosition || 'Top',
      news: Array.isArray(relationships.news)
        ? relationships.news.map((n: any) => isPopulated(n) ? adaptPayloadNews(n) : null).filter(Boolean)
        : [],
      relatedEvents: Array.isArray(relationships.relatedEvents)
        ? relationships.relatedEvents.map((e: any) => isPopulated(e) ? adaptPayloadEvent(e) : null).filter(Boolean)
        : [],
      relatedVideos: Array.isArray(relationships.relatedVideos)
        ? relationships.relatedVideos.map((v: any) => isPopulated(v) ? adaptPayloadVideo(v) : null).filter(Boolean)
        : [],
      relatedDocuments: Array.isArray(relationships.relatedDocuments)
        ? relationships.relatedDocuments.map((d: any) => isPopulated(d) ? adaptPayloadPublication(d) : null).filter(Boolean)
        : [],
      eventRecording: null,
      livestreamUrl: info.livestreamUrl || '',
      livestreamPassword: info.livestreamPassword || '',
      livestream: null,
      chat: null,
      thumbnail: content.thumbnail ? adaptMedia(content.thumbnail) : null,
      slug: payload.slug || ''
    }
  };
}

/**
 * Adapt Payload News to Contentful News
 */
export function adaptPayloadNews(
  payload: PayloadTypes.News | string
): ContentfulTypes.News {
  if (typeof payload === 'string') {
    return {
      fields: {
        title: '',
        summary: '',
        dateFormat: '',
        type: 'News',
        programme: null,
        project: [],
        author: '',
        authorTmg: [],
        keywords: [],
        image: null,
        imageCdn: [],
        descriptionRich: '',
        publication: null,
        publicationReferenceTMG: null,
        externalPublicationThumbnail: null,
        externalPublicationUrl: null,
        video: null,
        relatedNews: [],
        relatedPublications: [],
        slug: ''
      }
    };
  }

  const info = get(payload, 'info', {});
  const content = get(payload, 'content', {});
  const relationships = get(payload, 'relationships', {});

  return {
    fields: {
      programme: isPopulated(info.programme)
        ? adaptPayloadProgramme(info.programme as PayloadTypes.Category)
        : null,
      secondProgramme: isPopulated(info.secondProgramme)
        ? adaptPayloadProgramme(info.secondProgramme as PayloadTypes.Category)
        : null,
      project: Array.isArray(info.project)
        ? info.project.map((p: any) => isPopulated(p) ? adaptPayloadProject(p) : null).filter(Boolean)
        : [],
      dateFormat: info.dateFormat || '',
      type: info.type || 'News',
      author: info.author || '',
      authorTmg: Array.isArray(info.authorTmg)
        ? info.authorTmg.map((a: any) => isPopulated(a) ? adaptPayloadTeam(a) : null).filter(Boolean)
        : [],
      title: payload.title || '',
      summary: info.summary || '',
      keywords: info.keywords || [],
      image: content.image ? adaptMedia(content.image) : null,
      imageCdn: content.imageCdn ? adaptMediaArray(content.imageCdn) : [],
      descriptionRich: adaptLexicalToContentfulDoc(content.descriptionRich),
      source: info.source || null,
      sourceUrl: info.sourceUrl || null,
      publication: isPopulated(relationships.publication)
        ? adaptPayloadPublication(relationships.publication as PayloadTypes.Publication)
        : null,
      publicationReferenceTMG: isPopulated(relationships.publicationReferenceTMG)
        ? adaptPayloadPublication(relationships.publicationReferenceTMG as PayloadTypes.Publication)
        : null,
      externalPublicationThumbnail: content.externalPublicationThumbnail 
        ? adaptMedia(content.externalPublicationThumbnail)
        : null,
      externalPublicationUrl: info.externalPublicationUrl || null,
      video: isPopulated(relationships.video)
        ? adaptPayloadVideo(relationships.video as PayloadTypes.Video)
        : null,
      relatedNews: Array.isArray(relationships.relatedNews)
        ? relationships.relatedNews.map((n: any) => isPopulated(n) ? adaptPayloadNews(n) : null).filter(Boolean)
        : [],
      relatedPublications: Array.isArray(relationships.relatedPublications)
        ? relationships.relatedPublications.map((p: any) => isPopulated(p) ? adaptPayloadPublication(p) : null).filter(Boolean)
        : [],
      slug: payload.slug || ''
    }
  };
}

/**
 * Adapt Payload Publication to Contentful Publication
 */
export function adaptPayloadPublication(
  payload: PayloadTypes.Publication | string
): ContentfulTypes.Publication {
  if (typeof payload === 'string') {
    return {
      fields: {
        title: '',
        category: '',
        programme: null,
        project: null,
        author: '',
        authorTmg: [],
        publicationDate: '',
        language: '',
        summary: '',
        keywords: [],
        description: '',
        automatedNewsEntry: '',
        thumbnail: null,
        thumbnailCdn: [],
        pdf: null,
        slug: '',
        doi: false,
        doiNumber: 0,
        doiUrl: '',
        citation: '',
        additionalButtonText: '',
        additionalButtonFile: null,
        additionalButton2Text: '',
        additionalButton2Link: ''
      }
    };
  }

  const info = get(payload, 'info', {});
  const content = get(payload, 'content', {});

  return {
    fields: {
      category: info.category || '',
      programme: isPopulated(info.programme)
        ? adaptPayloadProgramme(info.programme as PayloadTypes.Category)
        : null,
      project: isPopulated(info.project)
        ? adaptPayloadProject(info.project as PayloadTypes.Project)
        : null,
      title: payload.title || '',
      author: info.author || '',
      authorTmg: Array.isArray(info.authorTmg)
        ? info.authorTmg.map((a: any) => isPopulated(a) ? adaptPayloadTeam(a) : null).filter(Boolean)
        : [],
      publicationDate: info.publicationDate || '',
      language: info.language || '',
      summary: info.summary || '',
      keywords: info.keywords || [],
      description: adaptLexicalToContentfulDoc(content.description),
      automatedNewsEntry: info.automatedNewsEntry || '',
      thumbnail: content.thumbnail ? adaptMedia(content.thumbnail) : null,
      thumbnailCdn: content.thumbnailCdn ? adaptMediaArray(content.thumbnailCdn) : [],
      pdf: content.pdf ? {
        fields: {
          file: {
            url: typeof content.pdf === 'string' ? '' : content.pdf.url || ''
          }
        }
      } : null,
      slug: payload.slug || '',
      doi: info.doi || false,
      doiNumber: info.doiNumber || 0,
      doiUrl: info.doiUrl || '',
      citation: info.citation || '',
      additionalButtonText: info.additionalButtonText || '',
      additionalButtonFile: content.additionalButtonFile ? {
        fields: {
          file: {
            url: typeof content.additionalButtonFile === 'string' 
              ? '' 
              : content.additionalButtonFile.url || ''
          }
        }
      } : null,
      additionalButton2Text: info.additionalButton2Text || '',
      additionalButton2Link: info.additionalButton2Link || ''
    }
  };
}

/**
 * Adapt Payload Post (Blog) to Contentful BlogPost
 */
export function adaptPayloadBlogPost(
  payload: PayloadTypes.Post | string
): ContentfulTypes.BlogPost {
  if (typeof payload === 'string') {
    return {
      fields: {
        title: '',
        programme: null,
        secondProgramme: null,
        project: [],
        dateFormat: '',
        author: '',
        authorTmg: [],
        summary: '',
        keywords: [],
        image: null,
        imageCdn: [],
        descriptionRich: '',
        source: null,
        sourceUrl: null,
        relatedNews: [],
        relatedPublications: [],
        video: null,
        slug: ''
      }
    };
  }

  const info = get(payload, 'info', {});
  const content = get(payload, 'content', {});
  const relationships = get(payload, 'relationships', {});

  return {
    fields: {
      programme: isPopulated(info.programme)
        ? adaptPayloadProgramme(info.programme as PayloadTypes.Category)
        : null,
      secondProgramme: isPopulated(info.secondProgramme)
        ? adaptPayloadProgramme(info.secondProgramme as PayloadTypes.Category)
        : null,
      project: Array.isArray(info.project)
        ? info.project.map((p: any) => isPopulated(p) ? adaptPayloadProject(p) : null).filter(Boolean)
        : [],
      dateFormat: payload.publishedAt || '',
      author: info.author || '',
      authorTmg: Array.isArray(info.authorTmg)
        ? info.authorTmg.map((a: any) => isPopulated(a) ? adaptPayloadTeam(a) : null).filter(Boolean)
        : [],
      title: payload.title || '',
      summary: info.summary || '',
      keywords: info.keywords || [],
      image: content.image ? adaptMedia(content.image) : null,
      imageCdn: content.imageCdn ? adaptMediaArray(content.imageCdn) : [],
      descriptionRich: adaptLexicalToContentfulDoc(content.descriptionRich),
      source: info.source || null,
      sourceUrl: info.sourceUrl || null,
      relatedNews: Array.isArray(relationships.relatedNews)
        ? relationships.relatedNews.map((n: any) => isPopulated(n) ? adaptPayloadNews(n) : null).filter(Boolean)
        : [],
      relatedPublications: Array.isArray(relationships.relatedPublications)
        ? relationships.relatedPublications.map((p: any) => isPopulated(p) ? adaptPayloadPublication(p) : null).filter(Boolean)
        : [],
      video: isPopulated(relationships.video)
        ? adaptPayloadVideo(relationships.video as PayloadTypes.Video)
        : null,
      slug: payload.slug || ''
    }
  };
}

/**
 * Adapt Payload Video to Contentful Video
 */
export function adaptPayloadVideo(
  payload: PayloadTypes.Video | string
): ContentfulTypes.Video {
  if (typeof payload === 'string') {
    return {
      fields: {
        title: '',
        date: '',
        description: '',
        automatedNewsEntry: '',
        summary: '',
        keywords: [],
        url: '',
        videoId: '',
        image: null,
        imageCdn: [],
        programmes: [],
        projects: [],
        eventSeries: [],
        slug: ''
      }
    };
  }

  const info = get(payload, 'info', {});
  const content = get(payload, 'content', {});
  const relationships = get(payload, 'relationships', {});

  return {
    fields: {
      title: payload.title || '',
      date: info.date || '',
      description: adaptLexicalToContentfulDoc(content.description),
      automatedNewsEntry: info.automatedNewsEntry || '',
      summary: info.summary || '',
      keywords: info.keywords || [],
      url: info.url || '',
      videoId: info.videoId || '',
      image: content.image ? adaptMedia(content.image) : null,
      imageCdn: content.imageCdn ? adaptMediaArray(content.imageCdn) : [],
      programmes: Array.isArray(relationships.programmes)
        ? relationships.programmes.map((p: any) => isPopulated(p) ? adaptPayloadProgramme(p) : null).filter(Boolean)
        : [],
      projects: Array.isArray(relationships.projects)
        ? relationships.projects.map((p: any) => isPopulated(p) ? adaptPayloadProject(p) : null).filter(Boolean)
        : [],
      eventSeries: Array.isArray(relationships.eventSeries)
        ? relationships.eventSeries.map((e: any) => isPopulated(e) ? adaptPayloadEventSeries(e) : null).filter(Boolean)
        : [],
      slug: payload.slug || ''
    }
  };
}

/**
 * Adapt Payload Team to Contentful Team
 */
export function adaptPayloadTeam(
  payload: PayloadTypes.Team | string
): ContentfulTypes.Team {
  if (typeof payload === 'string') {
    return {
      fields: {
        name: '',
        position: '',
        picture: null,
        pictureCdn: [],
        bio: '',
        linkedin: '',
        twitter: '',
        email: '',
        slug: ''
      }
    };
  }

  const info = get(payload, 'info', {});

  return {
    fields: {
      name: payload.name || '',
      position: info.position || '',
      picture: info.picture ? adaptMedia(info.picture) : null,
      pictureCdn: info.pictureCdn ? adaptMediaArray(info.pictureCdn) : [],
      bio: info.bio || '',
      linkedin: info.linkedin || '',
      twitter: info.twitter || '',
      email: info.email || '',
      slug: payload.slug || ''
    }
  };
}

/**
 * Adapt Payload Speaker to Contentful Speaker
 */
export function adaptPayloadSpeaker(
  payload: PayloadTypes.Speaker | string
): ContentfulTypes.Speaker {
  if (typeof payload === 'string') {
    return {
      fields: {
        name: '',
        position: '',
        organisation: '',
        organisationUrl: '',
        bio: '',
        picture: null,
        pictureCdn: [],
        twitter: '',
        email: '',
        slug: ''
      }
    };
  }

  const info = get(payload, 'info', {});

  return {
    fields: {
      name: payload.name || '',
      position: info.position || '',
      organisation: info.organisation || '',
      organisationUrl: info.organisationUrl || '',
      bio: info.bio || '',
      picture: info.picture ? adaptMedia(info.picture) : null,
      pictureCdn: info.pictureCdn ? adaptMediaArray(info.pictureCdn) : [],
      twitter: info.twitter || '',
      email: info.email || '',
      slug: payload.slug || ''
    }
  };
}

/**
 * Adapt Payload EventSeries to Contentful EventSeries
 */
export function adaptPayloadEventSeries(
  payload: PayloadTypes.EventSery | string
): ContentfulTypes.EventSeries {
  if (typeof payload === 'string') {
    return {
      fields: {
        featuredOnHomepage: false,
        cutoffDate: '',
        title: '',
        summary: '',
        keywords: [],
        description: '',
        quoteText: '',
        quotePerson: '',
        quotePersonOrganization: '',
        text2: '',
        statsTitle: '',
        statsEvents: 0,
        statsSpeakers: 0,
        text3: '',
        text4: '',
        eventFeatured: null,
        events: [],
        news: [],
        relatedDocuments: [],
        additionalEvents: [],
        gallery: [],
        image: null,
        imageCdn: [],
        pageBanner: null,
        pageBannerCdn: [],
        slug: '',
        color1: '',
        color2: ''
      }
    };
  }

  // TODO: Implement full EventSeries adapter
  // This is a complex type with many fields
  
  return {
    fields: {
      featuredOnHomepage: get(payload, 'info.featuredOnHomepage', false),
      cutoffDate: get(payload, 'info.cutoffDate', ''),
      title: payload.title || '',
      summary: get(payload, 'info.summary', ''),
      keywords: get(payload, 'info.keywords', []),
      description: adaptLexicalToContentfulDoc(get(payload, 'content.description')),
      // ... map all other fields
      slug: payload.slug || '',
      color1: get(payload, 'styling.color1', ''),
      color2: get(payload, 'styling.color2', '')
    }
  } as any; // Cast as any for now - complete implementation needed
}

/**
 * Adapt Payload PublicationFeature to Contentful PublicationFeature
 */
export function adaptPayloadPublicationFeature(
  payload: PayloadTypes.PublicationFeature | string
): ContentfulTypes.PublicationFeature {
  if (typeof payload === 'string') {
    return {
      fields: {
        featuredOnHomepage: false,
        cutoffDate: '',
        title: '',
        hideTitle: false,
        heroBannerTitle: '',
        heroBannerSubtitle: '',
        heroBannerPicture: [],
        heroBannerButtonText: '',
        heroBannerButtonLink: '',
        summary: '',
        keywords: [],
        sections: [],
        pageBanner: null,
        pageBannerCdn: [],
        gallery: [],
        events: [],
        news: [],
        relatedDocuments: [],
        partnersLogos: [],
        image: null,
        imageCdn: [],
        slug: '',
        color1: '',
        color2: ''
      },
      sys: {
        id: '',
        createdAt: '',
        updatedAt: ''
      }
    };
  }

  // TODO: Implement full PublicationFeature adapter
  // This is a complex type with sections/content blocks
  
  return {
    fields: {
      featuredOnHomepage: get(payload, 'info.featuredOnHomepage', false),
      cutoffDate: get(payload, 'info.cutoffDate', ''),
      title: payload.title || '',
      summary: get(payload, 'info.summary', ''),
      // ... map all other fields
      slug: payload.slug || '',
      color1: get(payload, 'styling.color1', ''),
      color2: get(payload, 'styling.color2', '')
    },
    sys: {
      id: payload.id || '',
      createdAt: payload.createdAt || '',
      updatedAt: payload.updatedAt || ''
    }
  } as any; // Cast as any for now - complete implementation needed
}

/**
 * Adapt Payload Initiative to Contentful Initiative
 */
export function adaptPayloadInitiative(
  payload: PayloadTypes.Initiative | string
): ContentfulTypes.Initiative {
  if (typeof payload === 'string') {
    return {
      fields: {
        pageBannerCdn: [],
        title: '',
        summary: '',
        section1Heading: '',
        section1Image: [],
        text1: '',
        // ... all other section fields
        slug: ''
      }
    };
  }

  // TODO: Implement full Initiative adapter
  // This has multiple sections (1-5) with complex structure
  
  return {
    fields: {
      title: payload.title || '',
      summary: get(payload, 'info.summary', ''),
      // ... map all sections and relationships
      slug: payload.slug || ''
    }
  } as any; // Cast as any for now - complete implementation needed
}

// ============================================================================
// BATCH ADAPTERS (for arrays)
// ============================================================================

export function adaptPayloadProgrammes(items: (PayloadTypes.Category | string)[]): ContentfulTypes.Programme[] {
  return items.map(adaptPayloadProgramme).filter(Boolean);
}

export function adaptPayloadProjects(items: (PayloadTypes.Project | string)[]): ContentfulTypes.Project[] {
  return items.map(adaptPayloadProject).filter(Boolean);
}

export function adaptPayloadEvents(items: (PayloadTypes.Event | string)[]): ContentfulTypes.Event[] {
  return items.map(adaptPayloadEvent).filter(Boolean);
}

export function adaptPayloadNews(items: (PayloadTypes.News | string)[]): ContentfulTypes.News[] {
  return items.map(adaptPayloadNews).filter(Boolean);
}

export function adaptPayloadPublications(items: (PayloadTypes.Publication | string)[]): ContentfulTypes.Publication[] {
  return items.map(adaptPayloadPublication).filter(Boolean);
}

export function adaptPayloadBlogPosts(items: (PayloadTypes.Post | string)[]): ContentfulTypes.BlogPost[] {
  return items.map(adaptPayloadBlogPost).filter(Boolean);
}

export function adaptPayloadVideos(items: (PayloadTypes.Video | string)[]): ContentfulTypes.Video[] {
  return items.map(adaptPayloadVideo).filter(Boolean);
}

export function adaptPayloadTeams(items: (PayloadTypes.Team | string)[]): ContentfulTypes.Team[] {
  return items.map(adaptPayloadTeam).filter(Boolean);
}

export function adaptPayloadSpeakers(items: (PayloadTypes.Speaker | string)[]): ContentfulTypes.Speaker[] {
  return items.map(adaptPayloadSpeaker).filter(Boolean);
}

// ============================================================================
// DEBUG HELPERS
// ============================================================================

/**
 * Log adapter operation for debugging
 */
function debugLog(type: string, data: any) {
  if (DEBUG_CMS) {
    console.log(`🔄 Adapting ${type}:`, JSON.stringify(data, null, 2).substring(0, 200));
  }
}
```

---

## 3. Enhanced Payload Client

**File:** `src/lib/payloadClient.ts` (additions)

```typescript
// ... existing code ...

import * as Adapter from './payloadAdapter';

// Add adapted getter functions

export async function getAdaptedProgrammes(): Promise<ContentfulTypes.Programme[]> {
  const programmes = await getProgrammes();
  return Adapter.adaptPayloadProgrammes(programmes);
}

export async function getAdaptedProjects(): Promise<ContentfulTypes.Project[]> {
  const projects = await getProjects();
  return Adapter.adaptPayloadProjects(projects);
}

export async function getAdaptedEvents(): Promise<ContentfulTypes.Event[]> {
  const events = await getEvents();
  return Adapter.adaptPayloadEvents(events);
}

export async function getAdaptedNews(): Promise<ContentfulTypes.News[]> {
  const news = await getNews();
  return Adapter.adaptPayloadNews(news);
}

export async function getAdaptedPublications(): Promise<ContentfulTypes.Publication[]> {
  const publications = await getPublications();
  return Adapter.adaptPayloadPublications(publications);
}

export async function getAdaptedBlogPosts(): Promise<ContentfulTypes.BlogPost[]> {
  const posts = await getBlogPosts();
  return Adapter.adaptPayloadBlogPosts(posts);
}

export async function getAdaptedVideos(): Promise<ContentfulTypes.Video[]> {
  const videos = await getVideos();
  return Adapter.adaptPayloadVideos(videos);
}

export async function getAdaptedTeams(): Promise<ContentfulTypes.Team[]> {
  const teams = await getTeamMembers();
  return Adapter.adaptPayloadTeams(teams);
}

export async function getAdaptedSpeakers(): Promise<ContentfulTypes.Speaker[]> {
  const speakers = await getSpeakers();
  return Adapter.adaptPayloadSpeakers(speakers);
}

// Adapted single entry getters

export async function getAdaptedProgrammeBySlug(slug: string): Promise<ContentfulTypes.Programme | null> {
  const programme = await getPayloadEntryBySlug<PayloadTypes.Category>(slug, 'categories');
  return programme ? Adapter.adaptPayloadProgramme(programme) : null;
}

export async function getAdaptedProjectBySlug(slug: string): Promise<ContentfulTypes.Project | null> {
  const project = await getProjectBySlug(slug);
  return project ? Adapter.adaptPayloadProject(project) : null;
}

export async function getAdaptedEventBySlug(slug: string): Promise<ContentfulTypes.Event | null> {
  const event = await getEventBySlug(slug);
  return event ? Adapter.adaptPayloadEvent(event) : null;
}

export async function getAdaptedNewsBySlug(slug: string): Promise<ContentfulTypes.News | null> {
  const news = await getNewsBySlug(slug);
  return news ? Adapter.adaptPayloadNews(news) : null;
}

export async function getAdaptedPublicationBySlug(slug: string): Promise<ContentfulTypes.Publication | null> {
  const publication = await getPublicationBySlug(slug);
  return publication ? Adapter.adaptPayloadPublication(publication) : null;
}

export async function getAdaptedBlogPostBySlug(slug: string): Promise<ContentfulTypes.BlogPost | null> {
  const post = await getBlogPostBySlug(slug);
  return post ? Adapter.adaptPayloadBlogPost(post) : null;
}

export async function getAdaptedVideoBySlug(slug: string): Promise<ContentfulTypes.Video | null> {
  const video = await getVideoBySlug(slug);
  return video ? Adapter.adaptPayloadVideo(video) : null;
}

export async function getAdaptedTeamBySlug(slug: string): Promise<ContentfulTypes.Team | null> {
  const team = await getTeamMemberBySlug(slug);
  return team ? Adapter.adaptPayloadTeam(team) : null;
}

export async function getAdaptedSpeakerBySlug(slug: string): Promise<ContentfulTypes.Speaker | null> {
  const speaker = await getSpeakerBySlug(slug);
  return speaker ? Adapter.adaptPayloadSpeaker(speaker) : null;
}
```

---

## 4. Unified Data Client

**File:** `src/lib/dataClient.ts`

```typescript
import { USE_PAYLOAD } from './config/features';
import * as ContentfulClient from './contentfulClient';
import * as PayloadClient from './payloadClient';
import type * as Types from './types/types';

// ============================================================================
// COLLECTION FETCHERS
// ============================================================================

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

export async function fetchPublications(): Promise<Types.Publication[]> {
  if (USE_PAYLOAD) {
    return PayloadClient.getAdaptedPublications();
  }
  return ContentfulClient.fetchContentfulData<Types.Publication>('publications');
}

export async function fetchBlogPosts(): Promise<Types.BlogPost[]> {
  if (USE_PAYLOAD) {
    return PayloadClient.getAdaptedBlogPosts();
  }
  return ContentfulClient.fetchContentfulData<Types.BlogPost>('blogPost');
}

export async function fetchVideos(): Promise<Types.Video[]> {
  if (USE_PAYLOAD) {
    return PayloadClient.getAdaptedVideos();
  }
  return ContentfulClient.fetchContentfulData<Types.Video>('video');
}

export async function fetchTeams(): Promise<Types.Team[]> {
  if (USE_PAYLOAD) {
    return PayloadClient.getAdaptedTeams();
  }
  return ContentfulClient.fetchContentfulData<Types.Team>('staff');
}

export async function fetchSpeakers(): Promise<Types.Speaker[]> {
  if (USE_PAYLOAD) {
    return PayloadClient.getAdaptedSpeakers();
  }
  return ContentfulClient.fetchContentfulData<Types.Speaker>('speaker');
}

// ... similar for other collections ...

// ============================================================================
// SINGLE ENTRY FETCHERS (by slug)
// ============================================================================

export async function getEntryBySlug<T>(
  slug: string,
  collection: string
): Promise<T | null> {
  if (USE_PAYLOAD) {
    const payloadCollection = mapContentfulToPayloadCollection(collection);
    
    // Route to correct adapted getter
    switch (collection) {
      case 'program':
        return PayloadClient.getAdaptedProgrammeBySlug(slug) as Promise<T | null>;
      case 'portfolio':
        return PayloadClient.getAdaptedProjectBySlug(slug) as Promise<T | null>;
      case 'event':
        return PayloadClient.getAdaptedEventBySlug(slug) as Promise<T | null>;
      case 'news':
        return PayloadClient.getAdaptedNewsBySlug(slug) as Promise<T | null>;
      case 'publications':
        return PayloadClient.getAdaptedPublicationBySlug(slug) as Promise<T | null>;
      case 'blogPost':
        return PayloadClient.getAdaptedBlogPostBySlug(slug) as Promise<T | null>;
      case 'video':
        return PayloadClient.getAdaptedVideoBySlug(slug) as Promise<T | null>;
      case 'staff':
        return PayloadClient.getAdaptedTeamBySlug(slug) as Promise<T | null>;
      case 'speaker':
        return PayloadClient.getAdaptedSpeakerBySlug(slug) as Promise<T | null>;
      default:
        console.warn(`No adapter for collection: ${collection}`);
        return null;
    }
  }
  
  return ContentfulClient.getEntryBySlug<T>(slug, collection);
}

// ============================================================================
// HELPERS
// ============================================================================

function mapContentfulToPayloadCollection(contentfulType: string): string {
  const mapping: Record<string, string> = {
    'program': 'categories',
    'portfolio': 'projects',
    'event': 'events',
    'news': 'news',
    'blogPost': 'posts',
    'publications': 'publications',
    'video': 'videos',
    'publicationFeature': 'publication-features',
    'unfssCop26': 'event-series',
    'staff': 'teams',
    'speaker': 'speakers',
    'initiative': 'initiatives',
    'partners': 'collaborators',
    'job': 'jobs',
    'page': 'pages'
  };
  
  return mapping[contentfulType] || contentfulType;
}

// ============================================================================
// RE-EXPORT SPECIFIC FUNCTIONS (optional for convenience)
// ============================================================================

export {
  fetchProgrammes as getProgrammes,
  fetchProjects as getProjects,
  fetchEvents as getEvents,
  fetchNews as getNews,
  fetchPublications as getPublications,
  fetchBlogPosts as getBlogPosts,
  fetchVideos as getVideos,
  fetchTeams as getTeams,
  fetchSpeakers as getSpeakers
};
```

---

## 5. Example Route Update

**File:** `src/routes/programmes/[slug]/+page.server.js`

**Before:**
```javascript
import { fetchContentfulData, getEntryBySlug } from '$lib/contentfulClient';
import {
	transformPublicationToNews,
	transformVideoToNews,
	transformBlogPostToNews
} from '$utils/utils';

export async function entries() {
	const programmes = await fetchContentfulData('program');
	return programmes.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const item = await getEntryBySlug(slug, 'program');

		if (!item) {
			throw new Error('Entry not found');
		}

		const [publications, events, videos, blogPosts, news] = await Promise.all([
			fetchContentfulData('publications'),
			fetchContentfulData('event'),
			fetchContentfulData('video'),
			fetchContentfulData('blogPost'),
			fetchContentfulData('news')
		]);

		// Rest of code...
```

**After:**
```javascript
import { 
  fetchProgrammes,
  fetchPublications, 
  fetchEvents, 
  fetchVideos,
  fetchBlogPosts,
  fetchNews,
  getEntryBySlug 
} from '$lib/dataClient';
import {
	transformPublicationToNews,
	transformVideoToNews,
	transformBlogPostToNews
} from '$utils/utils';

export async function entries() {
	const programmes = await fetchProgrammes();
	return programmes.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const item = await getEntryBySlug(slug, 'program');

		if (!item) {
			throw new Error('Entry not found');
		}

		const [publications, events, videos, blogPosts, news] = await Promise.all([
			fetchPublications(),
			fetchEvents(),
			fetchVideos(),
			fetchBlogPosts(),
			fetchNews()
		]);

		// Rest of code remains EXACTLY the same - no changes needed!
```

**Key Point:** Only the import and function calls change. All component code, filtering logic, and UI remain unchanged.

---

## 6. Environment Variables

**File:** `.env` (add these)

```bash
# Feature flags
SECRET_USE_PAYLOAD=false  # Set to 'true' to use Payload instead of Contentful
DEBUG_CMS=false          # Set to 'true' for detailed logging

# Existing Contentful vars (keep)
SECRET_CONTENTFUL_SPACE_ID=...
SECRET_CONTENTFUL_ACCESS_TOKEN=...
SECRET_CONTENTFUL_PREVIEW_ACCESS_TOKEN=...  # Add if not present
PUBLIC_CONTENTFUL_HOST=cdn.contentful.com

# Existing Payload vars (keep)
SECRET_PAYLOAD_URL=http://localhost:3000
SECRET_PAYLOAD_API_KEY=...
```

---

## 7. Testing Strategy

### Automated Comparison Test

**File:** `scripts/test-cms-parity.ts`

```typescript
import { fetchContentfulData } from '../src/lib/contentfulClient';
import { getAdaptedProgrammes } from '../src/lib/payloadClient';
import * as assert from 'assert';

async function testParity() {
  console.log('🧪 Testing CMS Parity...\n');
  
  const contentfulProgrammes = await fetchContentfulData('program');
  const payloadProgrammes = await getAdaptedProgrammes();
  
  console.log(`Contentful: ${contentfulProgrammes.length} programmes`);
  console.log(`Payload: ${payloadProgrammes.length} programmes`);
  
  assert.strictEqual(
    payloadProgrammes.length, 
    contentfulProgrammes.length,
    'Programme count mismatch'
  );
  
  // Test structure of first item
  const cf = contentfulProgrammes[0];
  const pl = payloadProgrammes[0];
  
  console.log('\n✅ Contentful programme structure:');
  console.log(`   - has .fields: ${!!cf.fields}`);
  console.log(`   - title: ${cf.fields?.title}`);
  console.log(`   - slug: ${cf.fields?.slug}`);
  
  console.log('\n✅ Payload adapted programme structure:');
  console.log(`   - has .fields: ${!!pl.fields}`);
  console.log(`   - title: ${pl.fields?.title}`);
  console.log(`   - slug: ${pl.fields?.slug}`);
  
  assert.ok(pl.fields, 'Payload item should have .fields wrapper');
  assert.strictEqual(typeof pl.fields.title, 'string', 'Title should be string');
  assert.strictEqual(typeof pl.fields.slug, 'string', 'Slug should be string');
  
  console.log('\n✅ All tests passed!');
}

testParity().catch(console.error);
```

Run with:
```bash
npx tsx scripts/test-cms-parity.ts
```

---

## 8. Troubleshooting

### Issue: Relationships Return IDs Instead of Objects

**Problem:** `event.fields.programme` is a string (ID) instead of object

**Solution:** Increase depth in Payload query

```typescript
// In payloadClient.ts
export async function getEvents(): Promise<Event[]> {
  return fetchPayloadData<Event>('events', 4); // Increase depth to 3 or 4
}
```

### Issue: Nested Fields Not Found

**Problem:** `Cannot read property 'summary' of undefined`

**Solution:** Use safe navigation in adapter

```typescript
// Instead of:
summary: payload.info.summary

// Use:
summary: get(payload, 'info.summary', '')
```

### Issue: Images Not Loading

**Problem:** Media URLs are malformed or missing

**Solution:** Check adapter handles both Cloudinary and local uploads

```typescript
// Adapter should check for both
thumbnailCdn: payload.thumbnailFromCloudinary 
  ? adaptCloudinaryMedia(payload.thumbnailFromCloudinary)
  : (content.thumbnail ? adaptMediaArray([content.thumbnail]) : [])
```

---

## 9. Performance Considerations

### Caching

The adapter adds overhead. Maintain caching at the Payload client level:

```typescript
// In payloadClient.ts
const cache = new Map<string, { data: any; expires: number }>();

export async function getCachedPayloadData<T>(
  collection: string,
  ttl = 300000 // 5 minutes
): Promise<T[]> {
  const key = `collection:${collection}`;
  const cached = cache.get(key);
  
  if (cached && Date.now() < cached.expires) {
    return cached.data;
  }
  
  const data = await fetchPayloadData<T>(collection);
  cache.set(key, {
    data,
    expires: Date.now() + ttl
  });
  
  return data;
}
```

### Prefetching

Consider prefetching related data to avoid N+1 queries:

```typescript
// For programme pages, prefetch all related content
export async function prefetchProgrammeData(programmeId: string) {
  return Promise.all([
    fetchEvents(),
    fetchNews(),
    fetchPublications(),
    fetchVideos()
  ]);
}
```

---

## ✅ Checklist

Before deploying:

- [ ] All adapter functions implemented
- [ ] Feature flag system working
- [ ] All routes updated to use dataClient
- [ ] Local testing passes with both CMSs
- [ ] Comparison tests show parity
- [ ] No console errors with Payload mode
- [ ] Images loading correctly
- [ ] Rich text rendering correctly
- [ ] Relationships populating correctly
- [ ] Search working
- [ ] Programme/project filtering working

---

**Document Version:** 1.0  
**Last Updated:** January 6, 2026

