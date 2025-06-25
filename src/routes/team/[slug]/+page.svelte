<script lang="ts">
	import SEO from '$components/SEO/SEO.svelte';
	import FaTwitter from 'virtual:icons/fa6-brands/x-twitter';
	import FaLinkedin from 'virtual:icons/fa6-brands/linkedin-in';
	import FaMail from 'virtual:icons/fa6-regular/envelope';
	import Icon from '$components/UI/Icon.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import ButtonArrow from '$components/UI/ButtonArrow.svelte';
	import LexicalRenderer from '$components/RichText/LexicalRenderer.svelte';
	import { ensureHttps } from '$utils/utils';
	import type { Team, News, Publication } from '$lib/types/payload-types';
	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		item: Team;
		news: News[];
		publications: Publication[];
	};

	let item = $derived(data.item);

	let publications = $derived(
		data.publications
			.filter((publication) => {
				if (publication.info?.authorTmg && item.name) {
					return publication.info.authorTmg.some(
						(author) => typeof author === 'object' && author.name === item.name
					);
				}
				return false;
			})
			.sort((a, b) => {
				const dateA = new Date(a.info?.publicationDate || '').getTime();
				const dateB = new Date(b.info?.publicationDate || '').getTime();
				return dateB - dateA;
			})
	);

	let news = $derived(
		data.news
			.filter((newsItem) => {
				if (newsItem.info?.authorTmg && item.name) {
					return newsItem.info.authorTmg.some(
						(author) => typeof author === 'object' && author.name === item.name
					);
				}
				return false;
			})
			.sort((a, b) => {
				const dateA = new Date(a.info?.dateFormat || '').getTime();
				const dateB = new Date(b.info?.dateFormat || '').getTime();
				return dateB - dateA;
			})
	);

	let image = $derived(
		item.picture && typeof item.picture === 'object' ? item.picture.url || undefined : undefined
	);
</script>

<SEO title={item.name} {image} />

<article class="pb-6 pt-24 lg:pb-16 lg:pt-48">
	<div class="gril-cols-1 layout grid lg:grid-cols-4">
		<div class="order-2 justify-between pr-0 leading-normal lg:order-1 lg:col-span-3 lg:pr-16">
			<div class="">
				<h2 class="font-semibold text-black">
					{item.name}
				</h2>
				<h3 class="text-blue-normal pb-4 font-bold">
					{item.position}
				</h3>

				{#if item.bio}
					<div class="pb-4 text-base text-black">
						<LexicalRenderer content={item.bio} />
					</div>
				{/if}

				<ul class="text-blue-normal flex items-center space-x-3 pt-2">
					{#if item.email}
						<a href={`mailto:${item.email}`} class="">
							<Icon icon={FaMail} label="Mail" classes="w-4 h-4" />
						</a>
					{/if}
					{#if item.twitter}
						<a href={ensureHttps(item.twitter)}>
							<Icon icon={FaTwitter} label="Twitter" classes="w-4 h-4" />
						</a>
					{/if}
					{#if item.linkedin}
						<a href={ensureHttps(item.linkedin)}>
							<Icon icon={FaLinkedin} label="LinkedIn" classes="w-4 h-4" />
						</a>
					{/if}
				</ul>
			</div>
		</div>

		{#if image}
			<div class="order-1 ml-0 w-1/3 px-2 pb-5 lg:order-2 lg:ml-12 lg:w-full lg:pb-2">
				<img
					loading="lazy"
					class="aspect-square w-full rounded-full object-cover"
					src={image}
					alt={item.name}
				/>
			</div>
		{/if}
	</div>

	{#if news.length >= 1}
		<section class="layout pt-6">
			<span class="text-lg font-bold lg:text-xl">News</span>
			<NewsListing items={news} />
		</section>
	{/if}

	{#if publications.length >= 1}
		<section class="layout pt-6">
			<span class="text-lg font-bold lg:text-xl">Publications</span>
			<PublicationListing items={publications} />
		</section>
	{/if}

	<div class="layout pt-6 lg:pt-8">
		<ButtonArrow to="/team" color="#F4F6F" textColor="#2e2d51" arrowDirection="left"
			>Team</ButtonArrow
		>
	</div>
</article>
