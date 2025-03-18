<script lang="ts">
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import Button from '$components/UI/Button.svelte';
	import type { Newsletter } from '$lib/types/types';

	interface PageData {
		newsletter: Newsletter[];
	}

	let { data } = $props<{ data: PageData }>();
	let newsletter = $derived(data.newsletter || []);
</script>

<SEO
	title="Newsletter"
	description="Subscribe to our newsletter to stay updated with news, events, and research from TMG and our partners."
/>
<section>
	<SectionHeaderLow title="Newsletter" background="bgGradientBR" />

	<div class="sectionPy bg-white">
		<div class="layout">
			<div class="mx-auto max-w-6xl">
				<div class="mx-auto mb-12">
					<p class="text-base text-gray-700 md:text-xl lg:text-lg">
						Never miss any updates from our research programmes and partner networks by subscribing
						to our newsletter. You'll receive insights, event announcements, and the latest research
						findings.
					</p>

					<div class="bgGradientBR mx-auto mt-10 rounded-xl p-8 text-white">
						<div class="mx-auto items-center justify-evenly lg:flex">
							<div class="text-center lg:text-left">
								<h2 class="mb-4 text-2xl font-bold">Subscribe to Our Newsletter</h2>
								<p class="text-white/90">
									Sign up to receive our newsletter directly to your inbox. You can unsubscribe at
									any time.
								</p>
							</div>
							<div class="mt-6 flex justify-center lg:mt-0">
								<Button to="https://bit.ly/33JpKMa" colors="white">Subscribe Now</Button>
							</div>
						</div>
					</div>
				</div>

				<h2 class="mb-10 text-center text-2xl font-bold text-gray-900 md:text-3xl">
					Previous Editions
				</h2>

				<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:gap-8">
					{#each newsletter as item, i}
						{@const image =
							item.fields.thumbnailCdn?.length > 0
								? item.fields.thumbnailCdn[0].secure_url
								: item.fields.thumbnail.fields.file.url}
						<a href={item.fields.url} target="_blank" rel="noopener noreferrer" class="group">
							<div
								class="overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
							>
								<div class="aspect-[3/4] overflow-hidden">
									<img
										loading="lazy"
										src={image}
										alt={'Newsletter #' + item.fields.number}
										class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
								<div class="p-3 text-center">
									<span class="font-medium text-gray-800">Issue #{item.fields.number}</span>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
