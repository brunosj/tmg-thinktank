<script lang="ts">
	import type { ImageCdn } from '$lib/types/types';
	import { onMount } from 'svelte';
	import { Lightbox, LightboxGallery, GalleryThumbnail, GalleryImage } from 'svelte-lightbox';

	export let images: ImageCdn[] = [];
	export let borderColor = '#333';
	export let textColor = '#333';
	export let title = 'Image Gallery';
	export let showCaption = true;

	let selectedImage = 0;
	let isVisible = false;
	let container;

	// Create a function to handle image selection
	function selectImage(index) {
		selectedImage = index;
	}
	
	// Create a function to navigate to the next image
	function nextImage() {
		selectedImage = (selectedImage + 1) % images.length;
	}
	
	// Create a function to navigate to the previous image
	function prevImage() {
		selectedImage = (selectedImage - 1 + images.length) % images.length;
	}

	onMount(() => {
		// Set up intersection observer for animation on scroll
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					isVisible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);

		if (container) {
			observer.observe(container);
		}
		
		return () => {
			observer.disconnect();
		};
	});
</script>

<section 
	bind:this={container} 
	class="relative overflow-hidden bg-white py-16 lg:py-24"
>
	<div class="layout">
		<div class="mx-auto max-w-6xl">
			<!-- Section header -->
			<div class="mb-12 flex items-center">
				<div class="h-1 w-12 rounded" style="background-color: {borderColor}"></div>
				<div class="ml-4 text-sm font-medium uppercase tracking-wider text-gray-500">
					{title}
				</div>
			</div>
			
			<!-- Main gallery section -->
			<div class="grid gap-8 lg:grid-cols-12">
				<!-- Featured image with lightbox -->
				<div 
					class="relative col-span-12 overflow-hidden rounded-xl border-2 lg:col-span-8"
					style="border-color: {borderColor}; transition: all 0.5s ease;"
				>
					{#if images && images.length > 0}
						<div class="relative aspect-[16/9] w-full overflow-hidden">
							<Lightbox>
								<img
									src={images[selectedImage].secure_url}
									alt={images[selectedImage]?.context?.custom?.caption || 'Gallery image'}
									class="h-full w-full cursor-pointer object-cover transition-all duration-500"
								/>
							</Lightbox>
							
							<!-- Navigation arrows -->
							<button 
								on:click={prevImage}
								class="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-lg transition-all hover:bg-white"
								aria-label="Previous image"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							
							<button 
								on:click={nextImage}
								class="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-lg transition-all hover:bg-white"
								aria-label="Next image"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
								</svg>
							</button>
							
							<!-- Image counter -->
							<div class="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
								{selectedImage + 1} / {images.length}
							</div>
						</div>
						
						<!-- Caption -->
						{#if showCaption && images[selectedImage]?.context?.custom?.caption}
							<div class="p-4">
								<p class="text-lg" style="color: {textColor}">
									{images[selectedImage].context.custom.caption}
								</p>
							</div>
						{/if}
					{:else}
						<div class="flex aspect-[16/9] w-full items-center justify-center bg-gray-100">
							<p class="text-gray-500">No images available</p>
						</div>
					{/if}
				</div>
				
				<!-- Thumbnails with lightbox gallery -->
				<div class="col-span-12 lg:col-span-4">
					<LightboxGallery arrowsConfig={{ color: 'white', character: 'arrow', enableKeyboardControl: true }}>
						<div slot="thumbnail" class="grid grid-cols-3 gap-3 lg:grid-cols-2">
							{#each images as image, i}
								<div
									class="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
									class:opacity-60={i !== selectedImage}
									class:opacity-100={i === selectedImage}
									style="border-color: {i === selectedImage ? borderColor : 'transparent'}"
									on:click={() => selectImage(i)}
									on:keydown={(e) => e.key === 'Enter' && selectImage(i)}
									role="button"
									tabindex="0"
								>
									<GalleryThumbnail id={i}>
										<img
											src={image.secure_url}
											alt={image?.context?.custom?.caption || `Thumbnail ${i + 1}`}
											class="h-full w-full object-cover"
										/>
										<div class="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/20" class:bg-black/30={i === selectedImage}></div>
										{#if i === selectedImage}
											<div class="absolute inset-0 flex items-center justify-center">
												<div class="h-3 w-3 rounded-full" style="background-color: {borderColor}"></div>
											</div>
										{/if}
									</GalleryThumbnail>
								</div>
							{/each}
						</div>
						
						{#each images as image, i}
							<GalleryImage 
								title={image?.context?.custom?.caption || `Image ${i + 1}`}
								description={image?.context?.custom?.caption || ''}
							>
								<img 
									src={image.secure_url} 
									alt={image?.context?.custom?.caption || `Image ${i + 1}`}
									class="h-full w-full object-contain"
								/>
							</GalleryImage>
						{/each}
					</LightboxGallery>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	:global(.svelte-lightbox-body img) {
		max-height: 85vh !important;
		width: auto !important;
	}

	:global(.svelte-lightbox-header) {
		margin-bottom: 0.5rem;
	}

	:global(.svelte-lightbox-footer) {
		margin-top: 0.5rem;
	}
</style> 