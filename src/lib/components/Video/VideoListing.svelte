<script lang="ts">
	export let videos: Video[];

	import type { Video } from '$lib/types/types';
	import VideoWrapper from '$components/Video/VideoWrapper.svelte';
</script>

<div class="bg-green-light">
	<ul class="">
		<div class="">
			{#if videos.length >= 1}
				<ul class="grid grid-cols-1 gap-6 pb-12 pt-6 md:grid-cols-2 lg:pt-16">
					{#each videos as video, i (video.fields.url)}
						{@const image =
							video.fields.imageCdn?.length > 0
								? video.fields.imageCdn[0].secure_url
								: video.fields.image.fields.file.url}
						<li class="pb-5">
							<div class="h-full border">
								<VideoWrapper
									videoSrcURL={video.fields.url}
									videoWidth="600"
									videoHeight="337"
									videoTitle={video.fields.title}
									videoImage={image}
								/>
								<div class="p-4">
									<h1
										class="font pt-3 text-base font-bold leading-tight text-black group-hover:text-green-normal lg:text-xl"
									>
										{video.fields.title}
									</h1>
									<p class="pb-2 pt-4 text-sm text-black">
										<span>{video.fields.summary}</span>
									</p>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<ul class=" h-[full]">
					<li>
						<VideoWrapper
							videoSrcURL={videos[0].fields.url}
							videoWidth="1248"
							videoHeight="600"
							videoTitle={videos[0].fields.title}
							videoImage={videos[0].fields.image.fields.file.url}
						/>
						<div class="p-4">
							<h1
								class="font pt-3 text-base font-bold leading-tight text-black group-hover:text-green-normal lg:text-xl"
							>
								{videos[0].fields.title}
							</h1>
							<p class="pb-2 pt-4 text-sm text-black">
								<span>{videos[0].fields.summary}</span>
							</p>
						</div>
					</li>
				</ul>
			{/if}
		</div>
	</ul>
</div>
