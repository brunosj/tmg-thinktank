<script lang="ts">
	import SEO from '$components/SEO/SEO.svelte';
	import FaTwitter from 'virtual:icons/fa6-brands/x-twitter';
	import FaLinkedin from 'virtual:icons/fa6-brands/linkedin-in';
	import FaMail from 'virtual:icons/fa6-regular/envelope';
	import Icon from '$components/UI/Icon.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import ButtonArrow from '$components/UI/ButtonArrow.svelte';
	import { ensureHttps } from '$utils/utils';
	import type { Team, News, Publication } from '$lib/types/types';
	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		item: Team;
		news: News[];
		publications: Publication[];
	};

	let publications: Publication[] = $state([]);
	let news: News[] = $state([]);

	let item = $derived(data.item);

	$effect(() => {
		news = data.news;
	});

	$effect(() => {
		publications = data.publications;
	});

	$effect(() => {
		publications = publications
			.filter((publication) => {
				if (publication.fields.authorTmg && item.fields.name) {
					return publication.fields.authorTmg.some(
						(author) => author.fields?.name === item.fields?.name
					);
				}
				return false;
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.publicationDate).getTime();
				const dateB = new Date(b.fields.publicationDate).getTime();
				return dateB - dateA;
			});
	});

	$effect(() => {
		news = news
			.filter((newsItem) => {
				if (newsItem.fields.authorTmg && item.fields.name) {
					return newsItem.fields.authorTmg.some(
						(author) => author.fields?.name === item.fields?.name
					);
				}
				return false;
			})
			.sort((a, b) => {
				const dateA = new Date(a.fields.dateFormat).getTime();
				const dateB = new Date(b.fields.dateFormat).getTime();
				return dateB - dateA;
			});
	});

	let image = $derived(
		item.fields.pictureCdn?.length > 0
			? item.fields.pictureCdn[0].secure_url
			: item.fields.picture.fields.file.url
	);
</script>

<SEO title={item.fields.name} {image} />

<article class="pb-6 pt-24 lg:pb-16 lg:pt-48">
	<div class="gril-cols-1 layout grid lg:grid-cols-4">
		<div class="order-2 justify-between pr-0 leading-normal lg:order-1 lg:col-span-3 lg:pr-16">
			<div class="">
				<h2 class="font-semibold text-black">
					{item.fields.name}
				</h2>
				<h3 class="pb-4 font-bold text-green-normal">
					{item.fields.position}
				</h3>

				{#if item.fields.bio}
					<p class="pb-4 text-base text-black">
						{item.fields.bio}
					</p>
				{/if}

				<ul class="flex items-center space-x-3 pt-2 text-green-normal">
					{#if item.fields.email}
						<a href={`mailto:${item.fields.email}`} class="">
							<Icon icon={FaMail} label="Mail" classes="w-4 h-4" />
						</a>
					{/if}
					{#if item.fields.twitter}
						<a href={ensureHttps(item.fields.twitter)}>
							<Icon icon={FaTwitter} label="Twitter" classes="w-4 h-4" />
						</a>
					{/if}
					{#if item.fields.linkedin}
						<a href={ensureHttps(item.fields.linkedin)}>
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
					alt={item.fields.name}
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
		<ButtonArrow to="/team" color="#F4F6F" textColor="#67797B" arrowDirection="left"
			>Team</ButtonArrow
		>
	</div>
</article>
