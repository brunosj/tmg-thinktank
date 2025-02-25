<script lang="ts">
	import { Lightbox, LightboxGallery, GalleryThumbnail, GalleryImage } from 'svelte-lightbox';
	import type { ImageCdn } from '$lib/types/types';

	interface Props {
		images: ImageCdn[];
		borderColor?: string;
	}

	let { images, borderColor = '#000' }: Props = $props();
</script>

<LightboxGallery
	arrowsConfig={{ color: 'transparent', character: 'loop', enableKeyboardControl: true }}
>
	<svelte:fragment slot="thumbnail">
		<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-2">
			{#each images as image, i}
				<div class="w-full opacity-100 duration-300 hover:opacity-90">
					<GalleryThumbnail title="name" id={i}>
						<img src={image.secure_url} alt={''} class=" object-contain" />
					</GalleryThumbnail>
				</div>
			{/each}
		</div>
	</svelte:fragment>

	{#each images as image}
		<div class="image-layout">
			<GalleryImage title={'Name'} description="image">
				<img src={image.secure_url} alt={''} class="h-full w-full object-contain" />
			</GalleryImage>
		</div>
	{/each}
</LightboxGallery>

<style>
	.image-layout {
		/* width: 40%; */
		margin: auto;
		object-fit: contain;
	}

	:global(.svelte-lightbox-body img) {
		max-height: 75vh !important;
		width: auto !important;
	}

	:global(.svelte-lightbox-header) {
		margin-bottom: 0.5rem;
	}

	:global(.svelte-lightbox-footer) {
		margin-top: 0.5rem;
		display: none;
	}
</style>
