<script lang="ts">
	import type { Partner, LandingPage } from '$lib/types/types';
	import HeadingV2 from '$components/Layout/HeadingV2.svelte';
	import PartnersLogo from '$components/Partners/PartnersLogo.svelte';
	interface Props {
		partners: Partner[];
		landingPage: LandingPage;
	}

	let { partners, landingPage }: Props = $props();

	const networks = partners
		.filter((partner) => partner.fields.partnerOrFunder === 'Network')
		.sort((a, b) => a.fields.name.localeCompare(b.fields.name));
</script>

<section class="section Py bg-white">
	<div class="layout py-6 lg:py-12">
		<HeadingV2
			title={landingPage.fields.networksSectionTitle}
			subtitle={landingPage.fields.networksSectionSubtitle}
			textColor="dark"
		/>

		<ul class="flex flex-wrap items-center justify-between px-5 pt-6 lg:px-0 lg:pt-12">
			{#each networks as item (item.fields.url)}
				<li>
					<PartnersLogo {item} />
				</li>
			{/each}
		</ul>
	</div>
</section>
