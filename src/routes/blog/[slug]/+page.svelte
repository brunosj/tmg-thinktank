<script lang="ts">
	import type { Post } from '$lib/types/payload-types';
	import Button from '$components/UI/Button.svelte';
	import BlogListing from '$components/Blog/BlogListing.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import ShareSocialMedia from '$components/UI/ShareSocialMedia.svelte';
	import { slugify, renderLexicalRichText } from '$utils/utils';
	import Tag from '$components/UI/Tag.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	import { ensureHttps } from '$utils/utils';
	import PublicationListing from '$components/Publications/PublicationListing.svelte';
	import RelatedContentSection from '$components/Layout/RelatedContentSection.svelte';
	import { getBlogPosts } from '$lib/payloadClient';

	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		item: Post;
	};

	let item = $derived(data.item);

	// Get more blog posts for related content (we'll fetch them separately since we don't need all posts in detail page)
	let moreBlogItems: Post[] = $state([]);

	// Load related blog posts
	async function loadRelatedPosts() {
		try {
			const allPosts = await getBlogPosts();
			moreBlogItems = allPosts
				.filter((post) => post.slug !== item.slug)
				.sort((a, b) => {
					const dateA = new Date(
						a.Info?.dateFormat || a.publishedAt || a.createdAt || '1970-01-01'
					).getTime();
					const dateB = new Date(
						b.Info?.dateFormat || b.publishedAt || b.createdAt || '1970-01-01'
					).getTime();
					return dateB - dateA;
				})
				.slice(0, 3);
		} catch (error) {
			console.error('Error loading related posts:', error);
		}
	}

	// Load related posts when component mounts
	loadRelatedPosts();

	let image = $derived(
		item.heroImage && typeof item.heroImage === 'object' ? item.heroImage.url : null
	);

	let imageCaption = $derived(
		item.heroImage && typeof item.heroImage === 'object' ? item.heroImage.alt : null
	);

	let author = $derived(
		item.authors?.[0]?.authorType === 'team'
			? typeof item.authors[0].teamMember === 'object'
				? item.authors[0].teamMember?.name
				: item.authors[0].externalAuthor
			: item.authors?.[0]?.externalAuthor || 'TMG Team'
	);

	let programme = $derived(item.Info?.programme);
	let programmeTitle = $derived(
		typeof programme === 'string' ? programme : programme?.title || 'Blog'
	);
	let programmeSlug = $derived(
		typeof programme === 'string' ? slugify(programme) : programme?.slug || 'blog'
	);

	let publishDate = $derived(item.Info?.dateFormat || item.publishedAt || item.createdAt);
</script>

<SEO
	title={item.title}
	description={item.Info?.summary || item.meta?.description || ''}
	image={image || undefined}
	keywords={(item.Info?.keywords?.map((k) => k.keyword).filter(Boolean) as string[]) || []}
/>

<article class="bg-green-light">
	<section>
		<div class="bg-blue-light relative z-0 py-24 lg:pb-32 lg:pt-40">
			<div class="layout w-full space-y-6 last:pb-12 lg:w-2/3">
				<div class="font-bold text-white">
					<span class="rounded-md bg-gray-900 px-2 py-1">Blog Post</span>
				</div>
				<h1 class="text-blue-normal">
					{item.title}
				</h1>
				<h4 class=" text-black">
					{item.Info?.summary || ''}
				</h4>
				{#if author && publishDate}
					<p class=" text-black">
						by <span class="font-semibold">{author}</span> | {publishDate}
					</p>
				{/if}
			</div>
		</div>

		{#if image}
			<div class="layout relative -bottom-24 -top-24 z-20 h-full w-2/3">
				<div
					class="mt-auto h-[30vh] opacity-100 transition duration-300 ease-in-out group-hover:opacity-90 lg:h-[50vh]"
				>
					<img loading="lazy" src={image} alt={item.title} class="h-full w-full object-cover" />
				</div>
				{#if imageCaption}
					<div class="mt-2 flex w-full italic">
						<div class="richText ml-auto text-sm font-semibold">
							{imageCaption}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</section>

	<div class="layout relative -top-12">
		<div class="mx-auto lg:w-2/3">
			<section class="pb-6">
				<ShareSocialMedia text={item.title} url={`https://tmg-thinktank.com/blog/${item.slug}`} />
			</section>
			<div class="richText">
				{@html renderLexicalRichText(item.content)}
			</div>
		</div>
	</div>

	<div class="layout w-full pb-6 lg:pb-12">
		{#if item.video && typeof item.video === 'object' && item.video.url}
			{#snippet videoContent()}
				<VideoListing videos={[item.video as any]} />
			{/snippet}

			<RelatedContentSection title="Related Video" children={videoContent} />
		{/if}

		{#if item.relatedPublications && item.relatedPublications !== null && Array.isArray(item.relatedPublications) && item.relatedPublications.length > 0}
			{#snippet publicationsContent()}
				<PublicationListing
					items={item.relatedPublications!.filter((p) => typeof p === 'object') as any[]}
					layout={false}
				/>
			{/snippet}

			<RelatedContentSection title="Related Publications" children={publicationsContent} />
		{/if}

		{#if moreBlogItems.length > 0}
			{#snippet blogContent()}
				<BlogListing items={moreBlogItems} />
			{/snippet}

			<RelatedContentSection title="Recent Blogs" extraClasses="pb-12" children={blogContent} />
		{/if}

		<div class="items-center border-b-0 border-t border-gray-300 md:flex md:py-12 lg:border-b">
			<div class="leading-relaxed">
				{#if author}
					<p class="pt-6 md:pt-0">
						Written by
						<span class="font-semibold">
							{author}
						</span>
					</p>
				{/if}
				{#if item.Info?.sourceUrl && item.Info?.source}
					<div class="pb-4">
						Originally published at
						<a
							href={ensureHttps(item.Info.sourceUrl)}
							class="font-semibold text-blue-800 hover:text-black"
							target="_blank"
						>
							{item.Info.source}
						</a>
					</div>
				{/if}
				<div class="pt-2 font-bold">
					More:
					<Tag to={`/programmes/${programmeSlug}#news`}>
						{programmeTitle}
					</Tag>
				</div>
			</div>
			<div class="ml-auto py-3 lg:py-0">
				<Button colors="green" to="/blog">View All Blogs</Button>
			</div>
		</div>
	</div>
</article>
