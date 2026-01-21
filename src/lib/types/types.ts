// Pages

export interface AboutPage {
	fields: {
		title: string;
		description: string;
		teamSectionText: string;
		slug: string;
		quote: string;
		quoteAuthor: string;
		quotePicture: Image;
	};
}

export interface LandingPage {
	fields: {
		title: string;
		heroTitle: string;
		heroPicture: ImageCdn[];
		heroPictureAspectRatio: boolean;
		heroText: string;
		heroSubtitle: string;
		heroLink: string;
		heroBackgroundColor: string;
		latestSectionTitle: string;
		latestSectionSubtitle: string;
		featuredItems: (News | Event)[];
		programmeSectionTitle: string;
		eventSectionTitle: string;
		eventSectionSubtitle: string;
		eventSeriesBanner: Image;
		blogSectionTitle: string;
		blogSectionSubtitle: string;
		newsletterBanner: Banner;
		networksSectionTitle: string;
		networksSectionSubtitle: string;
	};
}

export interface Legal {
	title: string;
	entryTitle: string;
	summary: string;
	description: string;
	events: Event[];
	news: News[];
	slug: string;
}

// Components

export interface ContentfulEntry {
	fields: any;
}

export interface Banner {
	fields: {
		title: string;
		subtitle: string;
		buttonText: string;
		buttonPath: string;
		imageCdn: ImageCdn[];
		publications: Publication[];
	};
}

export interface LandingPageBanner {
	fields: {
		title: string;
		cutoffDate: string;
		image: Image;
		item: Event | News | Publication | EventSeries | FlagshipOutput;
		imageCdn: ImageCdn[];
	};
}

export interface Event extends ContentfulEntry {
	fields: {
		topBanner: ImageCdn[];
		featureOnEventsPage: boolean;
		programme: Programme;
		title: string;
		secondLanguage: string;
		titleSecondLanguage: string;
		summary: string;
		keywords: string[];
		tmgMainOrganizer: boolean;
		organiser: string[];
		type: string;
		date: string;
		endDate: string;
		location: string;
		language: string[];
		eventUrl: string;
		description: string;
		background: string;
		video: Video;
		speakers: Speaker[];
		facilitators: Speaker[];
		image: Image;
		imageCdn: ImageCdn[];
		contactPerson: Team[];
		contactPersonEmail: string;
		imagePosition: 'Top' | 'Bottom';
		news: News[];
		relatedEvents: Event[];
		relatedVideos: Video[];
		relatedDocuments: Publication[];
		eventRecording: Video;
		livestreamUrl: string;
		livestreamPassword: string;
		livestream: Video;
		chat: Video;
		thumbnail: Image;
		slug: string;
	};
}

export interface CalendarEvent {
	start: Date;
	end: Date;
	title: string;
	subtitle: string;
	slug: string;
	isMultiDay: boolean;
	type: string;
	category: string;
	rawStart: string;
	rawEnd: string;
}

export interface EventSeries extends ContentfulEntry {
	fields: {
		featuredOnHomepage: boolean;
		cutoffDate: string;
		title: string;
		summary: string;
		keywords: string[];
		description: string;
		quoteText: string;
		quotePerson: string;
		quotePersonOrganization: string;
		text2: string;
		statsTitle: string;
		statsEvents: number;
		statsSpeakers: number;
		text3: string;
		text4: string;
		eventFeatured: Event;
		events: Event[];
		news: News[];
		relatedDocuments: Publication[];
		additionalEvents: Event[];
		gallery: ImageCdn[];
		image: Image;
		imageCdn: ImageCdn[];
		pageBanner: Image;
		pageBannerCdn: ImageCdn[];
		slug: string;
		color1: string;
		color2: string;
	};
}

export interface Initiative extends ContentfulEntry {
	fields: {
		pageBannerCdn: ImageCdn[];
		title: string;
		summary: string;

		section1Heading: string;
		section1Image: ImageCdn[];
		text1: string;
		section2Heading: string;
		section2Image: ImageCdn[];
		text2: string;
		section3Heading: string;
		text3: string;
		section3Image: ImageCdn[];
		section4Heading: string;
		text4: string;
		section4Image: ImageCdn[];
		section5Heading: string;
		text5: string;
		section5Image: ImageCdn[];
		slidesHeading: string;
		slides: ImageCdn[];
		galleryText: string;
		gallery: ImageCdn[];
		events: Event[];
		news: News[];
		publications: Publication[];
		partners: Partner[];
		quoteText: string;
		quotePerson: string;
		quotePersonOrganization: string;
		quote2Text: string;
		quote2Person: string;
		quote2PersonOrganization: string;
		quote3Text: string;
		quote3Person: string;
		quote3PersonOrganization: string;
		quote4Text: string;
		quote4Person: string;
		quote4PersonOrganization: string;
		quote5Text: string;
		quote5Person: string;
		quote5PersonOrganization: string;
		quote6Text: string;
		quote6Person: string;
		quote6PersonOrganization: string;
		quotesPictures: ImageCdn[];
		color1: string;
		color2: string;
		videoTitle: string;
		videoItem: Video;
		slug: string;
	};
}

export interface FlagshipOutput extends ContentfulEntry {
	fields: {
		programme: Programme;
		project: Project;
		logo: ImageCdn[];
		title: string;
		subtitle: string;
		text1: string;
		text2: string;
		image: Image;
		imageCdn: ImageCdn[];
		video: Video;
		news: News[];
		publications: Publication[];
		slug: string;
	};
}

export interface BlogPost extends ContentfulEntry {
	fields: {
		programme: Programme;
		secondProgramme?: Programme | null;
		project: Project[];
		dateFormat: string;
		author: string;
		authorTmg: Team[];
		title: string;
		summary: string;
		keywords: string[];
		image: Image;
		imageCdn: ImageCdn[];
		descriptionRich: string;
		source?: string | null;
		sourceUrl?: string | null;
		relatedNews: News[];
		relatedPublications: Publication[];
		video: Video | null;
		slug: string;
	};
}

export interface News extends ContentfulEntry {
	fields: {
		programme: Programme;
		secondProgramme?: Programme | null;
		project: Project[];
		dateFormat: string;
		type: 'Media Coverage' | 'Press Release' | 'News' | 'Publication' | 'Video';
		author: string;
		authorTmg: Team[];
		title: string;
		summary: string;
		keywords: string[];
		image: Image;
		imageCdn: ImageCdn[];
		descriptionRich: string;
		source?: string | null;
		sourceUrl?: string | null;
		publication: Publication;
		publicationReferenceTMG: Publication;
		externalPublicationThumbnail: Image | null;
		externalPublicationUrl: string | null;
		video: Video | null;
		relatedNews: News[];
		relatedPublications: Publication[];
		slug: string;
	};
}

export interface Job extends ContentfulEntry {
	fields: {
		applicationFile?: {
			fields: {
				file: {
					url: string;
				};
			};
		};
		applicationLink: string;
		deadlineDate: string;
		slug: string;
		url: string;
		title: string;
		summary: string;
		category: string;
		date: string;
	};
}

export interface Newsletter extends ContentfulEntry {
	fields: {
		number: number;
		date: string;
		thumbnail: Image;
		thumbnailCdn: ImageCdn[];
		url: string;
		id: number;
	};
}

export interface Team extends ContentfulEntry {
	fields: {
		name: string;
		position: string;
		picture: Image;
		pictureCdn: ImageCdn[];
		bio: string;
		linkedin: string;
		twitter: string;
		email: string;
		slug: string;
	};
}

export interface Publication extends ContentfulEntry {
	fields: {
		category: string;
		programme: Programme;
		project: Project;
		title: string;
		author: string;
		authorTmg: Team[];
		publicationDate: string;
		language: string;
		summary: string;
		keywords: string[];
		description: string;
		automatedNewsEntry: string;
		thumbnail: Image;
		thumbnailCdn: ImageCdn[];
		pdf: MediaFile;
		slug: string;
		doi: boolean;
		doiNumber: number;
		doiUrl: string;
		citation: string;
		additionalButtonText: string;
		additionalButtonFile: MediaFile;
		addtionalButton2text: string;
		addtionalButton2Link: string;
		additionalButton3Text: string;
		additionalButton3Link: string;
		additionalButton4Text: string;
		additionalButton4Link: string;
	};
}

export interface Project extends ContentfulEntry {
	fields: {
		name: string;
		summary: string;
		quote: string;
		quoteAuthor: string;
		description: string;
		programme: Programme;
		topics: Topic[];
		year: string;
		partnersList: Partner[];
		fundersList: Partner[];
		contractingAuthorityList: Partner[];
		thumbnail: Image;
		thumbnailCdn: ImageCdn[];
		gallery: ImageCdn[];
		team: Team[];
		url: string;
		videos: Video[];
		relatedProjects: Project[];
		slug: string;
	};
}

export interface Partner extends ContentfulEntry {
	fields: {
		partnerOrFunder: string;
		name: string;
		logo: Image;
		logoCdn: ImageCdn[];
		url: string;
	};
}

export interface Programme extends ContentfulEntry {
	fields: {
		title: string;
		actionVerb: string;
		subtitle: string;
		bannerPicture: ImageCdn[];
		quote: string;
		quoteAuthor: string;
		description: string;
		featuredItems: (News | Event | BlogPost)[];
		topics: Topic[];
		slug: string;
		flagshipOutput: FlagshipOutput;
		initiatives: Initiative[];
	};
}

export interface PublicationFeature extends ContentfulEntry {
	fields: {
		featuredOnHomepage: boolean;
		cutoffDate: string;
		title: string;
		hideTitle: boolean;
		heroBannerTitle: string;
		heroBannerSubtitle?: string;
		heroBannerPicture: ImageCdn[];
		heroBannerButtonText?: string;
		heroBannerButtonLink?: string;
		summary: string;
		keywords: string[];
		sections: {
			fields: {
				contentBlocks: ContentBlock[];
			};
		}[];
		pageBanner: Image;
		pageBannerCdn: ImageCdn[];
		gallery: ImageCdn[];
		events: Event[];
		news: News[];
		relatedDocuments: Publication[];
		partnersLogos: Partner[];
		image: Image;
		imageCdn: ImageCdn[];
		slug: string;
		color1: string;
		color2: string;
	};
	sys: {
		id: string;
		createdAt: string;
		updatedAt: string;
	};
}

export interface Speaker extends ContentfulEntry {
	fields: {
		name: string;
		position: string;
		organisation: string;
		organisationUrl: string;
		bio: string;
		picture: Image;
		pictureCdn: ImageCdn[];
		twitter: string;
		email: string;
		slug: string;
	};
}

export interface Topic extends ContentfulEntry {
	fields: {
		title: string;
		summary: string;
		programmes: Programme[];
		descriptionIntro: string;
		description: string;
		image: Image;
		imageCdn: ImageCdn[];
		projects: Project[];
		slug: string;
	};
}

export interface Video extends ContentfulEntry {
	fields: {
		title: string;
		date: string;
		description: string;
		automatedNewsEntry: string;
		summary: string;
		keywords: string[];
		url: string;
		videoId: string;
		image: Image;
		imageCdn: ImageCdn[];
		programmes: Programme[];
		projects: Project[];
		eventSeries: EventSeries[];
		slug: string;
	};
}

// Data

export interface MenuLink {
	title: string;
	to: string;
}

export interface MediaFile {
	fields: {
		file: {
			url: string;
		};
	};
}

export interface Image {
	fields: {
		title: string;
		description: string;
		file: {
			url: string;
		};
	};
}

export interface ImageCdn {
	secure_url: string;
	context: {
		custom: {
			caption: string;
		};
	};
}

export interface SearchItem {
	title: string;
	summary: string[];
	slug?: string;
	type?: string;
	date?: string;
	link?: string | null;
	itemType: {
		key: 'news' | 'events' | 'publications' | 'publication-feature' | 'event-series' | 'videos';
		label: 'News' | 'Events' | 'Publications' | 'Publication Features' | 'Event Series' | 'Video';
	};
}

export interface ContentBlock {
	fields: {
		text: string;
		imageCdn: ImageCdn[];
		title: string;
		subtitle?: string;
		publications?: Publication[];
		buttonPath?: string;
		buttonText?: string;
		iFrameCode?: string;
		embedContent?: boolean;
		textAlignment?: 'left' | 'center' | 'right';
	};
	sys: {
		contentType: {
			sys: {
				id: 'textBoxBlock' | 'textBlock' | 'imageBlock' | 'banners';
			};
		};
	};
}
