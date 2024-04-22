<script lang="ts">
	export let data: Page;
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import BlogListing from '$components/Blog/BlogListing.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	import type { News } from '$lib/types/types';

	type Page = {
		news: News[];
	};

	let items: News[];

	items = data.news
		.filter((item) => item.fields.type === 'Blog Post')
		.sort((a, b) => {
			const dateA = new Date(a.fields.dateFormat).getTime();
			const dateB = new Date(b.fields.dateFormat).getTime();
			return dateB - dateA;
		});
</script>

<SEO title="Blog" description="Index of all TMG blog posts" />

<SectionHeaderLow title="Blog" background="bg-green-normal" />

<section class="container pb-6 pt-12 text-base font-light text-black lg:pt-24 lg:text-xl">
	Here on the TMG blog our team and collaborators share our latest research, comment on current
	political events, and engage with debates in the many fields in which we work.
</section>
<section class="container">
	<BlogListing {items} />
</section>
