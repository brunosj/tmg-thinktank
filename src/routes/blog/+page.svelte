<script lang="ts">
	export let data;
	import { parseISO } from 'date-fns';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import BlogListing from '$components/Blog/BlogListing.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	import type { News } from '$lib/types/types';

	let items: News[];

	items = data.news
		.filter((item) => item.fields.type === 'Blog Post')
		.sort((a, b) => {
			return parseISO(b.fields.dateFormat) - parseISO(a.fields.dateFormat);
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
