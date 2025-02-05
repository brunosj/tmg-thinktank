<script lang="ts">
	import type { AboutPage } from '$lib/types/types';
	import ContactForm from '$components/Forms/ContactForm.svelte';
	import Location from '$components/About/Location.svelte';
	import GuidingPrinciples from '$components/About/GuidingPrinciples.svelte';
	import Team from '$components/About/Team.svelte';
	import Description from '$components/About/Description.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	let { data } = $props();

	let about: AboutPage = data.about?.[0] as AboutPage;
</script>

<SEO title={about.fields.title} description={about.fields.description} />

{#if about.fields.quotePicture}
	<Description
		title={about.fields.title}
		quoteAuthor={about.fields.quoteAuthor}
		quote={about.fields.quote}
		description={about.fields.description}
		quotePicture={about.fields.quotePicture}
	/>
{/if}

<Team teamSectionText={about.fields.teamSectionText} />
<ContactForm />
