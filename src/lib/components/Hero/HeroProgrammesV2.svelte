<script>
	export let heroProgrammes;

	import HeadingV2 from '$components/Layout/HeadingV2.svelte';

	function getIntro(slug) {
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

<div class="bg-green-normal">
	<div class="sectionPy container mx-auto hidden lg:block lg:px-8">
		<HeadingV2 title="We work towards" textColor="light" />

		<div class="mx-auto mt-12 max-w-2xl lg:max-w-none">
			<div
				class="grid grid-cols-1 gap-1 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4"
			>
				{#each heroProgrammes.sort( (a, b) => (a.fields.title || '').localeCompare(b.fields.title || '') ) as programme, index}
					<a href={`/programmes/${programme.fields.slug}`} class="group">
						<div class="relate">
							<img
								loading="lazy"
								src={programme.fields.bannerPicture[0].secure_url}
								class="-z-10 h-48 w-full object-cover"
								alt="Programme Banner"
							/>
						</div>
						<div
							class=" flex h-full flex-col items-center space-y-2 bg-white p-8 duration-300 group-hover:bg-green-variation"
						>
							<div class="text-base font-semibold leading-6 text-gray-500">
								{getIntro(programme.fields.slug)}
							</div>
							<div
								class="text-2xl font-semibold leading-none tracking-tight duration-300 group-hover:opacity-70"
							>
								{programme.fields.title}
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
