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
					console.log('Observing section:', section.id);
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
</script>

<SEO
	title={item.fields.title}
	description={item.fields.summary}
	image={item.fields.pageBannerCdn[0].secure_url}
/>

<div style="background-color: {item.fields.color2}" class="relative overflow-hidden">
	<!-- Simplified decorative elements -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute left-0 top-0 h-32 w-32 rounded-full bg-white blur-xl"></div>
		<div class="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-xl"></div>
		<div class="absolute right-1/4 top-1/2 h-24 w-24 rounded-full bg-white blur-lg"></div>
	</div>

	<!-- Animated shapes (visible after mount) -->
	{#if animationReady}
		<div class="pointer-events-none absolute inset-0">
			<div
				class="absolute left-[10%] top-10 h-16 w-16 animate-pulse rounded-full bg-white/10"
			></div>
			<div
				class="absolute bottom-20 right-[15%] h-20 w-20 animate-ping rounded-full bg-white/10"
				style="animation-duration: 3s"
			></div>
			<div
				class="absolute right-1/3 top-1/3 h-12 w-12 animate-pulse rounded-full bg-white/10"
				style="animation-duration: 2.5s"
			></div>
		</div>
	{/if}

	<!-- Content -->
	<div class="layout relative z-10 flex h-full flex-col items-center justify-center py-24 md:py-32">
		<div class="max-w-3xl text-center">
			<h1
				class="mb-4 font-heading text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
			>
				{item.fields.title}
			</h1>

			<!-- Simplified separator -->
			<div class="mx-auto my-4 h-1 w-20 rounded bg-white/60"></div>

			<h2 class="mx-auto max-w-2xl text-base font-light leading-relaxed text-white md:text-2xl">
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
<div class="sticky top-[2rem] z-20 bg-white py-4 shadow-md lg:top-[3.5rem]">
	<div class="layout">
		<div class="mx-auto flex max-w-6xl justify-center overflow-x-auto">
			<div class="flex space-x-1 rounded-full bg-gray-100 p-1 sm:space-x-2 sm:p-1.5">
				{#each availableTabs() as tab}
					<button
						class="relative whitespace-nowrap rounded-full px-4 py-2 font-heading text-sm font-medium transition-all duration-200 sm:text-base"
						style="background-color: {activeTab === tab.id ? item.fields.color2 : 'transparent'}; 
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
						accentColor={item.fields.color2 || '#333'}
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
						accentColor={item.fields.color2 || '#333'}
					/>

					<!-- Section 2 -->
					<ContentSection
						heading={item.fields.section2Heading}
						defaultHeading="Additional Information"
						text={item.fields.text2}
						images={item.fields.section2Image}
						accentColor={item.fields.color2 || '#333'}
					/>

					<!-- Quote Section -->
					{#if item.fields.quoteText && item.fields.quotePerson && item.fields.quotePersonOrganization && item.fields.quotePersonPicture}
						<div class="mx-auto mb-12 max-w-6xl">
							<EnhancedQuote
								quoteText={item.fields.quoteText}
								quotePerson={item.fields.quotePerson}
								quotePersonOrganization={item.fields.quotePersonOrganization}
								quotePersonPictureUrl={item.fields.quotePersonPicture.fields.file.url}
								color={item.fields.color2 || '#333'}
							/>
						</div>
					{/if}

					<!-- Section 3 -->
					<ContentSection
						heading={item.fields.section3Heading}
						defaultHeading="Further Details"
						text={item.fields.text3}
						images={item.fields.section3Image}
						accentColor={item.fields.color2 || '#333'}
						maxWidth="max-w-4xl"
					/>

					<!-- Section 4 -->
					<ContentSection
						heading={item.fields.section4Heading}
						defaultHeading="More Information"
						text={item.fields.text4}
						images={item.fields.section4Image}
						accentColor={item.fields.color2 || '#333'}
						maxWidth="max-w-4xl"
					/>

					<!-- Section 5 -->
					<ContentSection
						heading={item.fields.section5Heading}
						defaultHeading="Additional Content"
						text={item.fields.text5}
						images={item.fields.section5Image}
						accentColor={item.fields.color2 || '#333'}
						maxWidth="max-w-4xl"
					/>

					<!-- Slides Carousel -->
					{#if item.fields.slides && item.fields.slides.length > 0}
						<div id="slides-section">
							<SimpleCarousel
								slides={item.fields.slides}
								accentColor={item.fields.color2 || '#333'}
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
			accentColor={item.fields.color2 || '#333'}
		/>
	{/if}

	<!-- Gallery Tab -->
	{#if activeTab === 'gallery'}
		<div class="animate-fadeIn mx-auto max-w-6xl">
			<SectionHeading title="Image Gallery" color={item.fields.color2 || '#333'} />
			{#if item.fields.galleryText}
				<div class="mx-auto">
					{@html renderRichText(item.fields.galleryText)}
				</div>
			{/if}

			<EnhancedGallery
				images={item.fields.gallery}
				borderColor={item.fields.color2 || '#333'}
				textColor={item.fields.color2 || '#333'}
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
					<SectionHeading title="Publications & Articles" color={item.fields.color2 || '#333'} />
					<PublicationListing items={item.fields.publications} layout={false} paddingTop="pt-0" />
				</div>
			{/if}

			{#if item.fields.news}
				<div class="mt-16">
					<SectionHeading title="News & Blog Posts" color={item.fields.color2 || '#333'} />
					<NewsListing items={item.fields.news} padding="py-0" />
				</div>
			{/if}
		</div>
	{/if}

	<!-- Partners Tab -->
	{#if activeTab === 'partners'}
		<div class="animate-fadeIn mx-auto max-w-6xl">
			<SectionHeading title="Partners" color={item.fields.color2 || '#333'} marginBottom="" />

			<div class="flex flex-wrap items-center justify-center gap-4">
				{#each item.fields.partners as partner}
					<PartnersLogo item={partner} />
				{/each}
			</div>
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
