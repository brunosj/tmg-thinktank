// Pages

export interface AboutPage {
	title: string;
	description: string;
	slug: string;
	quote: string;
	quoteAuthor: string;
	quotePicture: Image;
	image: Image;
	imageCdn: ImageCdn[];
	map: Image;
	pictures: Image[];
}

export interface LandingPage {
	fields: {
		title: string;
		heroPicture: ImageCdn[];
		heroText: string;
		latestSectionTitle: string;
		latestSectionSubtitle: string;
		featuredItems: (News | Event)[];
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

export interface Event {
	fields: {
		programme: Programme;
		title: string;
		secondLanguage: string;
		titleSecondLanguage: string;
		summary: string;
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
}

export interface EventSeries {
	fields: {
		featuredOnHomepage: boolean;
		cutoffDate: string;
		title: string;
		summary: string;
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

export interface FlagshipOutput {
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

export interface News {
	fields: {
		programme: Programme;
		secondProgramme: Programme;
		project: Project[];
		dateFormat: string;
		type: string;
		author: string;
		authorTmg: Team[];
		title: string;
		summary: string;
		image: Image;
		imageCdn: ImageCdn[];
		descriptionRich: string;
		source: string;
		sourceUrl: string;
		publication: Publication;
		publicationReferenceTMG: Publication;
		externalPublicationThumbnail: Image;
		externalPublicationUrl: string;
		video: Video;
		relatedNews: News[];
		relatedPublications: Publication[];
		slug: string;
	};
}

export interface Job {
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

export interface Newsletter {
	fields: {
		number: number;
		date: string;
		thumbnail: Image;
		thumbnailCdn: ImageCdn[];
		url: string;
		id: number;
	};
}

export interface Team {
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

export interface Publication {
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
		description: string;
		thumbnail: Image;
		thumbnailCdn: ImageCdn[];
		pdf: MediaFile;
		slug: string;
		doi: boolean;
		doiNumber: number;
		doiUrl: string;
		citation: string;
	};
}

export interface Project {
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

export interface Partner {
	fields: {
		partnerOrFunder: string;
		name: string;
		logo: Image;
		logoCdn: ImageCdn[];
		url: string;
	};
}

export interface Programme {
	fields: {
		title: string;
		subtitle: string;
		bannerPicture: ImageCdn[];
		quote: string;
		quoteAuthor: string;
		description: string;
		featuredItems: (News | Event)[];
		topics: Topic[];
		slug: string;
		flagshipOutput: FlagshipOutput;
		flagshipOutputTitle: string;
		flagshipOutputDescription: string;
		flagshipOutputMedia: Image;
		flagshipOutputLink: string;
	};
}

export interface PublicationFeature {
	fields: {
		featuredOnHomepage: boolean;
		cutoffDate: string;
		title: string;
		summary: string;
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
}

export interface Speaker {
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

export interface Topic {
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

export interface Video {
	fields: {
		title: string;
		date: string;
		description: string;
		summary: string;
		url: string;
		videoId: string;
		image: Image;
		imageCdn: ImageCdn[];
		programmes: Programme[];
		projects: Project[];
		eventSeries: EventSeries[];
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
	summary: string;
	slug?: string;
	type?: string;
	date?: string;
	link?: string;
	itemType: {
		key: 'news' | 'events' | 'publications' | 'publicationFeatures' | 'eventSeries' | 'videos';
		label: 'News' | 'Events' | 'Publications' | 'Publication Features' | 'Event Series' | 'Video';
	};
}

export interface ContentBlock {
	fields: {
		text: string;
		imageCdn: ImageCdn[];
		title: string;
		publications: Publication[];
	};
	sys: {
		contentType: {
			sys: {
				id: 'textBoxBlock' | 'textBlock' | 'imageBlock' | 'banners';
			};
		};
	};
}
