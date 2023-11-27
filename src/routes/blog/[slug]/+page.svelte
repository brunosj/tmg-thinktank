<script>
	export let data;

	import { parseISO } from 'date-fns';
	import Button from '$components/UI/Button.svelte';
	import BlogListing from '$components/Blog/BlogListing.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import ShareSocialMedia from '$components/UI/ShareSocialMedia.svelte';
	import { slugify, renderRichText } from '$utils/utils.js';
	import Tag from '$components/UI/Tag.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	import { ensureHttps } from '$lib/utils/utils.js';

	$: item = data.item;
	$: entries = data.entries;

	let moreBlogItems;

	$: {
		moreBlogItems = entries
			.filter((item) => item.fields.type === 'Blog Post')
			.sort((a, b) => {
				return parseISO(b.fields.dateFormat) - parseISO(a.fields.dateFormat);
			})
			.slice(0, 3);
	}

	$: image =
		item.fields.imageCdn?.length > 0
			? item.fields.imageCdn[0].secure_url
			: item.fields.image.fields.file.url;
</script>

<SEO title={item.fields.title} description={item.fields.summary} {image} />

<article class="bg-green-light">
	<section>
		<div class="relative z-0 bg-green-variation py-24 lg:pb-32 lg:pt-40">
			<div class="container w-full space-y-6 last:pb-12 lg:w-2/3">
				<div class="font-bold text-white">
					<span class="bg-gray-900 rounded-lg px-2 py-1">{item.fields.type}</span>
				</div>
				<h1 class="text-green-normal">
					{item.fields.title}
				</h1>
				<h4 class=" text-black">
					{item.fields.summary}
				</h4>
				<p class=" text-black">
					by <span class="font-semibold">{item.fields.author}</span> | {item.fields.dateFormat}
				</p>
			</div>
		</div>

		<div class="container relative -bottom-24 -top-24 z-20 h-full w-2/3">
			<div
				class="mt-auto h-[30vh] opacity-100 transition duration-300 ease-in-out group-hover:opacity-90 lg:h-[50vh]"
			>
				<img
					loading="lazy"
					src={image}
					alt={item.fields.description}
					class="h-full w-full object-cover"
				/>
			</div>
			<div class="mt-2 flex w-full italic">
				<div class="richText ml-auto text-sm font-semibold">
					{item.fields.image.fields.description}
				</div>
			</div>
		</div>
	</section>

	<div class="container relative -top-12">
		<div class="mx-auto lg:w-2/3">
			<section class="pb-6">
				<ShareSocialMedia
					text={item.fields.title}
					url={`https://tmg-thinktank.com/blog/${item.fields.slug}`}
				/>
			</section>
			<div class="richText">
				{@html renderRichText(item.fields.descriptionRich)}
			</div>

			{#if item.fields.video}
				<div>
					<h1 class="py-12 font-semibold text-black">
						{item.fields.video.length >= 2 ? 'Related videos' : 'Related video'}
					</h1>
					<VideoListing videos={item.fields.video} />
				</div>
			{/if}
		</div>
	</div>

	<div class="container w-full pb-6 lg:pb-12">
		<section class="border-t border-gray-300">
			<div class="pt-6 text-xl font-semibold lg:text-2xl">Recent Blogs</div>
			<BlogListing items={moreBlogItems} />
		</section>
		<div class="items-center border-b-0 border-t border-gray-300 md:flex md:py-12 lg:border-b">
			<div class="leading-relaxed">
				{#if item.fields.author}
					<p class="pt-6 md:pt-0">
						Written by
						<span class="font-semibold">
							{item.fields.author}
						</span>
					</p>
				{/if}
				{#if item.fields.sourceUrl}
					<div class="pb-4">
						Originally published at
						<a
							href={ensureHttps(item.fields.sourceUrl)}
							class="font-semibold text-blue-800 hover:text-gray-700"
							target="_blank"
						>
							{item.fields.source}
						</a>
					</div>
				{/if}
				<p class="pt-2 font-bold">
					More:
					<Tag to={`/programmes/${slugify(item.fields.programme.fields.title)}#news`}>
						{item.fields.programme.fields.title}</Tag
					>
				</p>
			</div>
			<div class="ml-auto py-3 lg:py-0">
				<a href="/blog">
					<Button colors="green">View All Blogs</Button>
				</a>
			</div>
		</div>
	</div>
</article>
