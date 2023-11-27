<script>
	export let pictures;
	import HeadingAbout from '$components/About/HeadingAbout.svelte';

	const guidingPrinciples = [
		{
			title: 'Reflective',
			text: 'Change must match the inherent complexity of inclusive sustainable development, while still relying on feasible solutions. This requires a reflective and adaptive approach to identify pathways towards sustainability.',
			images: pictures.filter((picture) => ['aboutus images-7'].includes(picture.fields.title))
		},
		{
			title: 'Visionary',
			text: 'We know that it is not possible to create a more equal and sustainable world without fundamentally changing how we interact with each other and the planet. We believe that we need to work together to overcome vested interests and achieve transformative change.',
			images: pictures.filter((picture) =>
				['aboutus images-11', 'aboutus images-8'].includes(picture.fields.title)
			)
		},
		{
			title: 'Practical',
			text: 'We work closely with partner organizations at different levels to co-design solutions to pressing sustainability challenges. To develop adapted innovations, we reconcile divergent perspectives, interests, capacities, and knowledge systems.',
			images: pictures.filter((picture) =>
				['aboutus images-12', 'aboutus images'].includes(picture.fields.title)
			)
		},
		{
			title: 'Engaged',
			text: 'We recognise that acting on proposed solutions to sustainability challenges at different levels requires confronting power relations and building broad-based alliances to create the necessary leverage for change. Through our projects, we strive to initiate change processes that last.',
			images: pictures.filter((picture) => ['aboutus images-3'].includes(picture.fields.title))
		}
	];
</script>

<div class="bg-green-normal">
	<div class="container pt-12 font-bold text-white lg:pb-16 lg:pt-24">
		<HeadingAbout text="Our Guiding Principles" />

		<div class="grid grid-cols-3 py-6 lg:py-12">
			{#each guidingPrinciples as principle, i}
				{#if principle.images.length > 1}
					{#each principle.images as image, i}
						<div class={i % 2 === 1 ? 'col-span-2' : 'col-span-1'}>
							<img
								loading="lazy"
								src={image.fields.file.url}
								alt={image.fields.title}
								class="h-full object-cover"
							/>
						</div>
					{/each}
				{:else}
					<div class="col-span-2 col-start-2">
						{#each principle.images as image}
							<img
								loading="lazy"
								src={image.fields.file.url}
								alt={image.fields.title}
								class="w-full"
							/>
						{/each}
					</div>
				{/if}
				<div
					class={i % 2 === 1
						? 'col-span-3 col-start-1  w-2/3 space-y-6 py-6 lg:py-16'
						: 'col-span-2 col-start-2  space-y-6 py-6 lg:py-16'}
				>
					<div class="text-2xl lg:text-4xl">{principle.title}</div>
					<div class="text-sm font-normal lg:text-xl lg:font-semibold">
						{principle.text}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
