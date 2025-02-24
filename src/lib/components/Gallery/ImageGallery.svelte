<script lang="ts">
	import type { ImageCdn } from '$lib/types/types';
	import Gallery from './Gallery.svelte';
	interface Props {
		images: ImageCdn[];
		borderColor?: string;
	}

	let { images, borderColor = '#000' }: Props = $props();
</script>

<section class="sectionPy layout grid-cols-3 lg:grid">
	<div class="relative col-span-1 my-auto flex items-center pt-6 lg:pt-0">
		<h2
			class="text-2xl font-extrabold leading-tight tracking-tight lg:text-4xl"
			style="color:{borderColor}"
		>
			Image Gallery
		</h2>
		<div class="ml-auto w-1/4 lg:border-2" style="border-color:{borderColor}"></div>
	</div>
	<div class="col-span-2">
		<Gallery {images} {borderColor} />
	</div>
</section>
