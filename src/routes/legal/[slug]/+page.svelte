<script lang="ts">
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import RichText from '$components/RichText.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	let { data } = $props();

	let item = $derived(data.item);
</script>

<SEO title={item.fields.title} />
<SectionHeaderLow title={item.fields.title} background="bgGradientBR" />
<div class="bg-green-light">
	<div class="layout py-12 lg:pb-16">
		<div class="richText px-0 lg:px-32">
			{#if item.fields.description}
				<RichText content={item.fields.description} class="richText" />
			{/if}
		</div>
	</div>
</div>
