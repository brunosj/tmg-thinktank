<script lang="ts">
	import type { Programme } from '$lib/types/types';
	import ProgrammeBanner from '$components/Banner/ProgrammeBanner.svelte';
	import Heading from '$components/Layout/Heading.svelte';
	interface Props {
		heroProgrammes: Programme[];
	}

	let { heroProgrammes }: Props = $props();

	function getIntro(slug: string) {
		switch (slug) {
			case 'food-systems':
				return 'Transforming';
			case 'land-governance':
				return 'Advancing responsible';
			case 'nature-based-solutions':
				return 'Promoting';
			case 'urban-food-futures':
				return 'Strengthening';
			default:
				return '';
		}
	}
</script>

<Heading text="We work towards" textColor="#2e2d51" bgColor="#eaeaee" />
<section class="grid grid-cols-1 lg:grid-cols-2">
	{#each heroProgrammes.sort( (a, b) => (a.fields.title || '').localeCompare(b.fields.title || '') ) as programme, index}
		{#if programme.fields.bannerPicture}
			<ProgrammeBanner
				image={programme.fields.bannerPicture[0].secure_url}
				intro={getIntro(programme.fields.slug)}
				title={programme.fields.title}
				to={`/programmes/${programme.fields.slug}`}
				key={index}
			/>
		{/if}
	{/each}
</section>
