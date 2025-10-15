<script lang="ts">
	import type { Speaker, Event, Initiative } from '$lib/types/types';
	import { renderRichText } from '$utils/utils';
	import SEO from '$components/SEO/SEO.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import EventsSection from '$components/Events/EventsSection.svelte';
	import EnhancedGallery from '$components/Gallery/EnhancedGallery.svelte';
	import SpeakersAvatars from '$components/Speakers/SpeakersAvatars.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import EventFeaturedBanner from '$components/Events/EventFeaturedBanner.svelte';
	import ImprovedVideoBanner from '$components/Banner/ImprovedVideoBanner.svelte';
	import SectionHeading from '$components/Layout/SectionHeading.svelte';
	import ContentSection from '$components/Layout/ContentSection.svelte';
	import TableOfContents from '$components/Layout/TableOfContents.svelte';
	import EnhancedQuote from '$components/Quote/EnhancedQuote.svelte';
	import SimpleCarousel from '$lib/components/Carousel/SimpleCarousel.svelte';
	import PartnersLogo from '$components/Partners/PartnersLogo.svelte';
	import { onMount } from 'svelte';

	interface Props {
		data: {
			item: Initiative;
		};
	}

	let { data }: Props = $props();

	let item: Initiative = $derived(data.item);
	let animationReady = $state(false);
	let activeTab = $state('overview');
	let activeSection = $state('');
	let observer: IntersectionObserver | null = null;
	let previousTab = $state('overview');
	let tabContentRef: HTMLElement | null = null;

	// Define tab interface
	interface Tab {
		id: string;
		label: string;
	}

	// Define available tabs based on content
	let availableTabs = $derived(() => {
		const tabs: Tab[] = [{ id: 'overview', label: 'Overview' }];

		// Events tab (includes featured event and regular events)
		if ((item.fields.events && item.fields.events.length > 0) || speakers().length > 0) {
			tabs.push({ id: 'events', label: 'Events' });
		}

		if (item.fields.gallery && item.fields.gallery.length > 0) {
			tabs.push({ id: 'gallery', label: 'Gallery' });
		}

		// Voices tab (quotes)
		if (
			item.fields.quoteText ||
			item.fields.quote2Text ||
			item.fields.quote3Text ||
			item.fields.quote4Text ||
			item.fields.quote5Text
		) {
			tabs.push({ id: 'voices', label: 'Voices' });
		}

		if (
			(item.fields.publications && item.fields.publications.length > 0) ||
			(item.fields.news && item.fields.news.length > 0)
		) {
			tabs.push({ id: 'resources', label: 'Resources' });
		}

		// Partners tab
		if (item.fields.partners && item.fields.partners.length > 0) {
			tabs.push({ id: 'partners', label: 'Partners' });
		}

		return tabs;
	});

	// Define table of contents sections
	let tocSections = $derived(() => {
		const sections = [];

		if (item.fields.text1 || (item.fields.section1Image && item.fields.section1Image.length > 0)) {
			sections.push({
				id: item.fields.section1Heading?.toLowerCase().replace(/\s+/g, '-') || 'initiative-details',
				title: item.fields.section1Heading || 'Initiative Details'
			});
		}

		if (item.fields.text2 || (item.fields.section2Image && item.fields.section2Image.length > 0)) {
			sections.push({
				id:
					item.fields.section2Heading?.toLowerCase().replace(/\s+/g, '-') ||
					'additional-information',
				title: item.fields.section2Heading || 'Additional Information'
			});
		}

		if (item.fields.text3 || (item.fields.section3Image && item.fields.section3Image.length > 0)) {
			sections.push({
				id: item.fields.section3Heading?.toLowerCase().replace(/\s+/g, '-') || 'further-details',
				title: item.fields.section3Heading || 'Further Details'
			});
		}

		if (item.fields.text4 || (item.fields.section4Image && item.fields.section4Image.length > 0)) {
			sections.push({
				id: item.fields.section4Heading?.toLowerCase().replace(/\s+/g, '-') || 'more-information',
				title: item.fields.section4Heading || 'More Information'
			});
		}

		if (item.fields.text5 || (item.fields.section5Image && item.fields.section5Image.length > 0)) {
			sections.push({
				id: item.fields.section5Heading?.toLowerCase().replace(/\s+/g, '-') || 'additional-content',
				title: item.fields.section5Heading || 'Additional Content'
			});
		}

		if (item.fields.slides && item.fields.slides.length > 0) {
			sections.push({
				id: 'slides-section',
				title: item.fields.slidesHeading || 'Slides'
			});
		}

		return sections;
	});

	let speakers = $derived(() => {
		const events = item.fields.events;
		const newSpeakers: Speaker[] = [];
		events?.forEach((event: Event) => {
			event.fields.speakers?.forEach((speaker: Speaker) => {
				if (
					!newSpeakers.some(
						(existingSpeaker: Speaker) => existingSpeaker.fields.slug === speaker.fields.slug
					)
				) {
					newSpeakers.push(speaker);
				}
			});
		});
		return newSpeakers.sort((a, b) => a.fields.name.localeCompare(b.fields.name));
	});

	// Function to set up the intersection observer
	function setupIntersectionObserver() {
		// Clean up previous observer if it exists
		if (observer) {
			observer.disconnect();
		}

		// Create new observer
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ rootMargin: '-120px 0px -70% 0px', threshold: 0.1 }
		);

		// Wait for DOM to be fully rendered
		setTimeout(() => {
			// Observe all section elements
			tocSections().forEach((section) => {
				const element = document.getElementById(section.id);
				if (element) {
					observer?.observe(element);
				} else {
					console.warn('Section element not found:', section.id);
				}
			});
		}, 100);
	}

	// Function to scroll to tab content
	function scrollToTabContent() {
		if (tabContentRef) {
			// Use a small offset to account for sticky header
			const offset = 150;
			const topPosition = tabContentRef.getBoundingClientRect().top + window.scrollY - offset;

			window.scrollTo({
				top: topPosition,
				behavior: 'smooth'
			});
		}
	}

	// Handle tab changes
	function handleTabChange(tabId: string) {
		previousTab = activeTab;
		activeTab = tabId;

		// If switching to overview tab, reset the active section to the first section
		if (tabId === 'overview') {
			// Reset active section to the first section or empty if no sections
			activeSection = tocSections().length > 0 ? tocSections()[0].id : '';

			// Small delay to ensure DOM is updated
			setTimeout(setupIntersectionObserver, 50);
		}

		// Scroll to tab content
		setTimeout(scrollToTabContent, 50);
	}

	onMount(() => {
		animationReady = true;
		setupIntersectionObserver();

		return () => {
			// Clean up observer on component unmount
			if (observer) {
				observer.disconnect();
			}
		};
	});

	// Use $effect instead of afterUpdate to watch for tab changes
	$effect(() => {
		// If we're on the overview tab and we just switched to it
		if (activeTab === 'overview' && previousTab !== 'overview') {
			// Reset active section to the first section or empty if no sections
			activeSection = tocSections().length > 0 ? tocSections()[0].id : '';
			setupIntersectionObserver();
		}
	});

	let image = $derived(item.fields?.pageBannerCdn?.[0]?.secure_url || '');
</script>

<SEO title={item.fields.title} description={item.fields.summary} {image} />

<div style="background-color: {item.fields.color1}" class="relative overflow-hidden">
	<!-- Simplified decorative elements -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute top-0 left-0 h-32 w-32 rounded-full bg-white blur-xl"></div>
		<div class="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-white blur-xl"></div>
		<div class="absolute top-1/2 right-1/4 h-24 w-24 rounded-full bg-white blur-lg"></div>
	</div>

	<!-- Animated shapes (visible after mount) -->
	{#if animationReady}
		<div class="pointer-events-none absolute inset-0">
			<div
				class="absolute top-10 left-[10%] h-16 w-16 animate-pulse rounded-full bg-white/10"
			></div>
			<div
				class="absolute right-[15%] bottom-20 h-20 w-20 animate-ping rounded-full bg-white/10"
				style="animation-duration: 3s"
			></div>
			<div
				class="absolute top-1/3 right-1/3 h-12 w-12 animate-pulse rounded-full bg-white/10"
				style="animation-duration: 2.5s"
			></div>
		</div>
	{/if}

	<!-- Content -->
	<div class="layout relative z-10 flex h-full flex-col items-center justify-center py-24 md:py-32">
		<div class="max-w-3xl text-center">
			<h1
				class="font-heading mb-4 text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
			>
				{item.fields.title}
			</h1>

			<!-- Simplified separator -->
			<div class="mx-auto my-4 h-1 w-20 rounded-sm bg-white/60"></div>

			<h2 class="mx-auto max-w-2xl text-base leading-relaxed font-light text-white md:text-2xl">
				{item.fields.summary}
			</h2>
		</div>
	</div>
</div>

{#if item.fields.pageBannerCdn}
	<div class="layout relative -mt-20 mb-8">
		<img
			src={item.fields.pageBannerCdn[0].secure_url}
			alt={item.fields.title}
			class="h-full w-full rounded-2xl object-cover shadow-lg"
		/>
	</div>
{/if}

<!-- Tabbed Navigation -->
<div class="sticky top-8 z-20 bg-white py-4 shadow-md lg:top-14">
	<div class="layout">
		<div class="mx-auto flex max-w-6xl justify-center">
			<div class="inline-block rounded-lg bg-gray-100 p-2">
				<div class="flex flex-wrap justify-center gap-2">
					{#each availableTabs() as tab}
						<button
							class="font-heading relative rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 sm:px-4 sm:py-2 sm:text-base"
							style="background-color: {activeTab === tab.id ? item.fields.color1 : 'transparent'}; 
							color: {activeTab === tab.id ? 'white' : 'rgba(0,0,0,0.7)'}"
							onclick={() => handleTabChange(tab.id)}
						>
							{tab.label}
							{#if activeTab === tab.id}
								<span
									class="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
								></span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Tab Content with transition -->
<div class="layout py-8" bind:this={tabContentRef}>
	<!-- Overview Tab -->
	{#if activeTab === 'overview'}
		<div class="animate-fadeIn">
			<!-- Two-column layout with TOC and content -->
			<div class=" mx-auto flex max-w-6xl flex-col lg:flex-row lg:gap-8">
				<!-- Table of Contents (left sidebar) -->
				{#if tocSections().length > 0}
					<TableOfContents
						sections={tocSections()}
						accentColor={item.fields.color1 || '#333'}
						{activeSection}
					/>
				{/if}

				<!-- Main content area -->
				<div class="flex-1">
					<!-- Section 1 -->
					<ContentSection
						heading={item.fields.section1Heading}
						defaultHeading="Initiative Details"
						text={item.fields.text1}
						images={item.fields.section1Image}
						accentColor={item.fields.color1 || '#333'}
					/>

					<!-- Section 2 -->
					<ContentSection
						heading={item.fields.section2Heading}
						defaultHeading="Additional Information"
						text={item.fields.text2}
						images={item.fields.section2Image}
						accentColor={item.fields.color1 || '#333'}
					/>

					<!-- Section 3 -->
					<ContentSection
						heading={item.fields.section3Heading}
						defaultHeading="Further Details"
						text={item.fields.text3}
						images={item.fields.section3Image}
						accentColor={item.fields.color1 || '#333'}
						maxWidth="max-w-4xl"
					/>

					<!-- Section 4 -->
					<ContentSection
						heading={item.fields.section4Heading}
						defaultHeading="More Information"
						text={item.fields.text4}
						images={item.fields.section4Image}
						accentColor={item.fields.color1 || '#333'}
						maxWidth="max-w-4xl"
					/>

					<!-- Section 5 -->
					<ContentSection
						heading={item.fields.section5Heading}
						defaultHeading="Additional Content"
						text={item.fields.text5}
						images={item.fields.section5Image}
						accentColor={item.fields.color1 || '#333'}
						maxWidth="max-w-4xl"
					/>

					<!-- Slides Carousel -->
					{#if item.fields.slides && item.fields.slides.length > 0}
						<div id="slides-section">
							<SimpleCarousel
								slides={item.fields.slides}
								accentColor={item.fields.color1 || '#333'}
								title={item.fields.slidesHeading || 'Slides'}
								autoAdvance={false}
							/>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Events Tab -->
	{#if activeTab === 'events'}
		<EventsSection
			events={item.fields.events || []}
			speakers={speakers()}
			accentColor={item.fields.color1 || '#333'}
		/>
	{/if}

	<!-- Gallery Tab -->
	{#if activeTab === 'gallery'}
		<div class="animate-fadeIn mx-auto max-w-6xl">
			<SectionHeading title="Image Gallery" color={item.fields.color1 || '#333'} />
			{#if item.fields.galleryText}
				<div class="mx-auto">
					{@html renderRichText(item.fields.galleryText)}
				</div>
			{/if}

			<EnhancedGallery
				images={item.fields.gallery}
				borderColor={item.fields.color1 || '#333'}
				textColor={item.fields.color1 || '#333'}
			/>
		</div>
	{/if}

	<!-- Resources Tab -->
	{#if activeTab === 'resources'}
		<div class="animate-fadeIn mx-auto max-w-6xl">
			<!-- Video Section -->
			{#if item.fields.videoItem}
				<div class="mb-12">
					<ImprovedVideoBanner
						video={item.fields.videoItem}
						bgColor={item.fields.color2 || '#333'}
						text={item.fields.videoTitle || 'Watch our video'}
						textColor="white"
						order="order-last"
						textAlignment="text-left"
					/>
				</div>
			{/if}

			{#if item.fields.publications}
				<div class="">
					<SectionHeading title="Publications & Articles" color={item.fields.color1 || '#333'} />
					<PublicationListing
						items={item.fields.publications}
						layout={false}
						paddingTop="pt-0"
						invertHover={true}
					/>
				</div>
			{/if}

			{#if item.fields.news}
				<div class="mt-6">
					<SectionHeading title="News & Blog Posts" color={item.fields.color1 || '#333'} />
					<NewsListing items={item.fields.news} padding="py-0" />
				</div>
			{/if}
		</div>
	{/if}

	<!-- Partners Tab -->
	{#if activeTab === 'partners'}
		<div class="animate-fadeIn mx-auto max-w-6xl">
			<SectionHeading title="Partners" color={item.fields.color1 || '#333'} marginBottom="" />

			<div class="flex flex-wrap items-center justify-center gap-4">
				{#each item.fields.partners as partner}
					<PartnersLogo item={partner} />
				{/each}
			</div>
		</div>
	{/if}

	<!-- Voices Tab -->
	{#if activeTab === 'voices'}
		<div class="animate-fadeIn mx-auto max-w-6xl">
			<SectionHeading title="Voices" color={item.fields.color1 || '#333'} />

			<!-- Quote 1 -->
			{#if item.fields.quoteText && item.fields.quotePerson && item.fields.quotePersonOrganization}
				<div class="mb-16">
					<EnhancedQuote
						quoteText={item.fields.quoteText}
						quotePerson={item.fields.quotePerson}
						quotePersonOrganization={item.fields.quotePersonOrganization}
						quotePersonPictureUrl={item.fields.quotesPictures &&
						item.fields.quotesPictures.length > 1
							? item.fields.quotesPictures[0].secure_url
							: ''}
						color={item.fields.color1 || '#333'}
					/>
				</div>
			{/if}

			<!-- Quote 2 -->
			{#if item.fields.quote2Text && item.fields.quote2Person && item.fields.quote2PersonOrganization}
				<div class="mb-16">
					<EnhancedQuote
						quoteText={item.fields.quote2Text}
						quotePerson={item.fields.quote2Person}
						quotePersonOrganization={item.fields.quote2PersonOrganization}
						quotePersonPictureUrl={item.fields.quotesPictures &&
						item.fields.quotesPictures.length > 1
							? item.fields.quotesPictures[1].secure_url
							: ''}
						color={item.fields.color2 || '#333'}
					/>
				</div>
			{/if}

			<!-- Quote 3 -->
			{#if item.fields.quote3Text && item.fields.quote3Person && item.fields.quote3PersonOrganization}
				<div class="mb-16">
					<EnhancedQuote
						quoteText={item.fields.quote3Text}
						quotePerson={item.fields.quote3Person}
						quotePersonOrganization={item.fields.quote3PersonOrganization}
						quotePersonPictureUrl={item.fields.quotesPictures &&
						item.fields.quotesPictures.length > 2
							? item.fields.quotesPictures[2].secure_url
							: ''}
						color={item.fields.color1 || '#333'}
					/>
				</div>
			{/if}

			<!-- Quote 4 -->
			{#if item.fields.quote4Text && item.fields.quote4Person && item.fields.quote4PersonOrganization}
				<div class="mb-16">
					<EnhancedQuote
						quoteText={item.fields.quote4Text}
						quotePerson={item.fields.quote4Person}
						quotePersonOrganization={item.fields.quote4PersonOrganization}
						quotePersonPictureUrl={item.fields.quotesPictures &&
						item.fields.quotesPictures.length > 3
							? item.fields.quotesPictures[3].secure_url
							: ''}
						color={item.fields.color2 || '#333'}
					/>
				</div>
			{/if}

			<!-- Quote 5 -->
			{#if item.fields.quote5Text && item.fields.quote5Person && item.fields.quote5PersonOrganization}
				<div class="mb-16">
					<EnhancedQuote
						quoteText={item.fields.quote5Text}
						quotePerson={item.fields.quote5Person}
						quotePersonOrganization={item.fields.quote5PersonOrganization}
						quotePersonPictureUrl={item.fields.quotesPictures &&
						item.fields.quotesPictures.length > 4
							? item.fields.quotesPictures[4].secure_url
							: ''}
						color={item.fields.color1 || '#333'}
					/>
				</div>
			{/if}
			<!-- Quote 6 -->
			{#if item.fields.quote6Text && item.fields.quote6Person && item.fields.quote6PersonOrganization}
				<div class="mb-16">
					<EnhancedQuote
						quoteText={item.fields.quote6Text}
						quotePerson={item.fields.quote6Person}
						quotePersonOrganization={item.fields.quote6PersonOrganization}
						quotePersonPictureUrl={item.fields.quotesPictures &&
						item.fields.quotesPictures.length > 5
							? item.fields.quotesPictures[5].secure_url
							: ''}
						color={item.fields.color1 || '#333'}
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.3s ease-out forwards;
	}
</style>
