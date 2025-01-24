<script>
  // @ts-ignore
  import hash from 'object-hash';

  
  

  
  /**
   * @typedef {Object} Props
   * @property {any} author
   * @property {{ name: string; slug: string }[]} breadcrumbs
   * @property {any} entity
   * @property {any} featuredImage
   * @property {any} metaDescription
   * @property {any} siteLanguage
   * @property {any} siteTitle
   * @property {any} siteTitleAlt
   * @property {any} siteUrl
   * @property {any} title
   * @property {any} url
   * @property {any} githubPage
   * @property {{ url: string; faviconWidth: number; faviconHeight: number } | null} [entityMeta]
   */

  /** @type {Props} */
  let {
    author,
    breadcrumbs,
    entity,
    featuredImage,
    metaDescription,
    siteLanguage,
    siteTitle,
    siteTitleAlt,
    siteUrl,
    title,
    url,
    githubPage,
    entityMeta = null
  } = $props();

  const entityHash = hash({ author }, { algorithm: 'md5' });

  const schemaOrgEntity =
    entityMeta !== null
      ? {
          '@type': ['Person', 'Organization'],
          '@id': `${siteUrl}/#/schema/person/${entityHash}`,
          name: author,
          image: {
            '@type': 'ImageObject',
            '@id': `${siteUrl}/#personlogo`,
            inLanguage: siteLanguage,
            url: entityMeta.url,
            width: entityMeta.faviconWidth,
            height: entityMeta.faviconHeight,
            caption: author,
          },
          logo: {
            '@id': `${siteUrl}/#personlogo`,
          },
          sameAs: [`https://github.com/${githubPage}`],
        }
      : null;

  const schemaOrgWebsite = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: siteTitle,
    description: siteTitleAlt,
    publisher: {
      '@id': `${siteUrl}/#/schema/person/${entityHash}`,
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: `${siteUrl}/?s={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    ],
    inLanguage: siteLanguage,
  };

  const schemaOrgImageObject = {
    '@type': 'ImageObject',
    '@id': `${url}#priimage`,
    inLanguage: siteLanguage,
    url: featuredImage.url,
    contentUrl: featuredImage.url,
    width: featuredImage.width,
    height: featuredImage.height,
    caption: featuredImage.caption,
  };

  const schemaOrgBreadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: breadcrumbs.map((element, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'WebPage',
        // @ts-ignore
        '@id': `${siteUrl}/${element.slug}`,
        // @ts-ignore
        url: `${siteUrl}/${element.slug}`,
        name: element.name,
      },
    })),
  };

  const schemaOrgWebPage = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    priImageOfPage: {
      '@id': `${url}#priimage`,
    },

    author: {
      '@id': `${siteUrl}/#/schema/person/${entityHash}`,
    },
    description: metaDescription,
    breadcrumb: {
      '@id': `${url}#breadcrumb`,
    },
    inLanguage: siteLanguage,
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: [url],
      },
    ],
  };

  const schemaOrgPublisher = {
    '@type': ['Person', 'Organization'],
    '@id': `${siteUrl}/#/schema/person/${entityHash}`,
    name: entity,
    image: {
      '@type': 'ImageObject',
      '@id': `${siteUrl}/#personlogo`,
      inLanguage: siteLanguage,
      url: `${siteUrl}/header_grand_cru.jpg`,
      contentUrl: `${siteUrl}/header_grand_cru.jpg`,
      width: 512,
      height: 512,
      caption: entity,
    },
    logo: {
      '@id': `${siteUrl}/#personlogo`,
    },
    sameAs: [`https://github.com/${githubPage}`],
  };

  const schemaOrgArray = [
    schemaOrgEntity,
    schemaOrgWebsite,
    schemaOrgImageObject,
    schemaOrgWebPage,
    schemaOrgBreadcrumbList,
    schemaOrgPublisher,
  ];
  const schemaOrgObject = {
    '@context': 'https://schema.org',
    '@graph': schemaOrgArray,
  };
  let jsonLdString = JSON.stringify(schemaOrgObject);
  let jsonLdScript = `
		<script type="application/ld+json">
			${jsonLdString}
		${'<'}/script>
	`;
</script>

<svelte:head>
  {@html jsonLdScript}
</svelte:head>
