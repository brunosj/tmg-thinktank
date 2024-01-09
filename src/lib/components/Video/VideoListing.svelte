<script lang="ts">
	import VideoWrapper from '$components/Video/VideoWrapper.svelte';
	export let videos;
</script>

<div class="bg-green-light">
	<ul class="">
		<div class="">
			{#if videos.length >= 1}
				<ul class="grid grid-cols-1 gap-6 pb-12 pt-6 md:grid-cols-2 lg:pt-16">
					{#each videos as video, i}
						{@const image =
							video.fields.imageCdn?.length > 0
								? video.fields.imageCdn[0].secure_url
								: video.fields.image.fields.file.url}
						<li class="pb-5" key={i}>
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
							videoSrcURL={videos.fields.url}
							videoWidth="1248"
							videoHeight="600"
							videoTitle={videos.fields.title}
							videoImage={videos.fields.image.fields.file.url}
						/>
						<div class="p-4">
							<h1
								class="font pt-3 text-base font-bold leading-tight text-black group-hover:text-green-normal lg:text-xl"
							>
								{videos.fields.title}
							</h1>
							<p class="pb-2 pt-4 text-sm text-black">
								<span>{videos.fields.summary}</span>
							</p>
						</div>
					</li>
				</ul>
			{/if}
		</div>
	</ul>
</div>
