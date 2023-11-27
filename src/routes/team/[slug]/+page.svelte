<script>
	export let data;

	import SEO from '$components/SEO/SEO.svelte';
	import { parseISO } from 'date-fns';
	import FaTwitter from 'virtual:icons/fa6-brands/x-twitter';
	import FaLinkedin from 'virtual:icons/fa6-brands/linkedin-in';
	import FaMail from 'virtual:icons/fa6-regular/envelope';
	import Icon from '$components/UI/Icon.svelte';
	import DisclosureOpen from '$components/UI/DisclosureOpen.svelte';
	import NewsListing from '$components/News/NewsListing.svelte';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import ButtonArrow from '$components/UI/ButtonArrow.svelte';
	import { ensureHttps } from '$utils/utils.js';

	let publications = [];
	let news = [];

	$: item = data.item;
	$: news = data.news;
	$: publications = data.publications;

	$: {
		publications = publications
			.filter((publications) => {
				if (publications.fields.authorTmg && item.fields.name) {
					return publications.fields.authorTmg.some(
						(author) => author.fields?.name === item.fields?.name
					);
				}
				return false;
			})
			.sort((a, b) => {
				const dateA = parseISO(a.fields.publicationDate);
				const dateB = parseISO(b.fields.publicationDate);
				return dateB - dateA;
			});
	}

	$: {
		news = news
			.filter((news) => {
				if (news.fields.authorTmg && item.fields.name) {
					return news.fields.authorTmg.some((author) => author.fields?.name === item.fields?.name);
				}
				return false;
			})
			.sort((a, b) => {
				const dateA = parseISO(a.fields.dateFormat);
				const dateB = parseISO(b.fields.dateFormat);
				return dateB - dateA;
			});
	}
</script>

<SEO title={item.fields.name} image={item.fields.picture.fields.file.url} />

<article class="pb-6 pt-24 lg:pb-16 lg:pt-48">
	<div class="gril-cols-1 container grid lg:grid-cols-4" key={item.fields.id}>
		<div class="order-2 justify-between pr-0 leading-normal lg:order-1 lg:col-span-3 lg:pr-16">
			<div class="">
				<h2 class="font-semibold text-gray-700">
					{item.fields.name}
				</h2>
				<h3 class="pb-4 font-bold text-green-normal">
					{item.fields.position}
				</h3>

				{#if item.fields.bio}
					<p class="pb-4 text-base text-gray-700">
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

		{#if item.fields.picture}
			<div class="order-1 ml-0 w-1/3 px-2 pb-5 lg:order-2 lg:ml-12 lg:w-full lg:pb-2">
				<img
					loading="lazy"
					class="aspect-square w-full rounded-full object-cover"
					src={item.fields.picture.fields.file.url}
					alt={item.fields.name}
				/>
			</div>
		{/if}
	</div>

	{#if news.length >= 1}
		<section class="container pt-6">
			<DisclosureOpen heading="News">
				<NewsListing items={news} />
			</DisclosureOpen>
		</section>
	{/if}

	{#if publications.length >= 1}
		<section class="container pt-6">
			<DisclosureOpen heading="Publications">
				<PublicationListing items={publications} class="grid grid-cols-1 pt-6 lg:grid-cols-2" />
			</DisclosureOpen>
		</section>
	{/if}

	<div class="container pt-6 lg:pt-8">
		<ButtonArrow to="/team" color="#F4F6F" textColor="#67797B" iconcolor="#67797B">Team</ButtonArrow
		>
	</div>
</article>
