<script lang="ts">
	import { onMount } from 'svelte';
	import HeadingV2 from '$components/Layout/HeadingV2.svelte';
	import type { Programme } from '$lib/types/types';
	interface Props {
		heroProgrammes: Programme[];
		programmeSectionTitle: string;
	}

	let { heroProgrammes, programmeSectionTitle }: Props = $props();

	let numberOfColumns = $derived(Math.min(heroProgrammes.length, 6));
	let gridClass = $derived(
		`grid grid-cols-1 gap-1 text-center sm:grid-cols-2 ${
			numberOfColumns === 2
				? 'lg:grid-cols-2'
				: numberOfColumns === 3
					? 'lg:grid-cols-3'
					: numberOfColumns === 4
						? 'lg:grid-cols-4'
						: numberOfColumns === 5
							? 'lg:grid-cols-5'
							: numberOfColumns === 6
								? 'lg:grid-cols-3'
								: 'lg:grid-cols-6'
		}`
	);
</script>

<div class="bgGradientTL relative">
	<div class="sectionPy layout mx-auto hidden lg:block">
		<HeadingV2 title={programmeSectionTitle} textColor="light" />

		<div class="mx-auto mt-12 max-w-2xl lg:max-w-none">
			<div class={gridClass}>
				{#each heroProgrammes.sort( (a, b) => (a.fields.title || '').localeCompare(b.fields.title || '') ) as programme}
					<a
						href={`/programmes/${programme.fields.slug}`}
						class="group flex h-full flex-col rounded-lg"
					>
						<div class="relative">
							<img
								loading="lazy"
								src={programme.fields.bannerPicture[0].secure_url}
								class="-z-10 h-48 w-full rounded-t-lg object-cover"
								alt="Programme Banner"
							/>
						</div>
						<div
							class=" flex h-full flex-col items-center space-y-2 rounded-b-lg bg-white p-4 duration-300 group-hover:bg-blue-light lg:p-6"
						>
							<div class="flex h-full flex-col justify-around space-y-2">
								<div class="text-base font-semibold leading-6 text-navy-blue">
									{programme.fields.actionVerb}
								</div>
								<div
									class="mt-auto text-xl font-semibold leading-none tracking-tight duration-300 group-hover:opacity-70"
								>
									{programme.fields.title}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
