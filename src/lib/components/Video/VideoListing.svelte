<script lang="ts">
	export let videos: Video[] | Video;
	export let showTitle: boolean = true;

	import type { Video } from '$lib/types/types';
	import VideoWrapper from '$components/Video/VideoWrapper.svelte';
	import { formatDateNews } from '$utils/utils';

	$: videosArray = Array.isArray(videos) ? videos : [videos];
</script>

<div class="">
	{#if videosArray.length > 1}
		<ul class="grid grid-cols-1 gap-x-6 gap-y-12 py-6 md:grid-cols-2">
			{#each videosArray as video, i (video.fields.url)}
				{@const image =
					video.fields.imageCdn?.length > 0
						? video.fields.imageCdn[0].secure_url
						: video.fields.image.fields.file.url}
				<li id={video.fields.videoId}>
					<div class="h-full rounded-md border">
						<VideoWrapper
							videoSrcURL={video.fields.url}
							videoWidth="600"
							videoHeight="337"
							videoTitle={video.fields.title}
							videoImage={image}
						/>
						{#if showTitle}
							<div class="space-y-3 p-4">
								<div class="flex w-full items-center justify-between gap-x-4 text-xs">
									<a
										href={`/programmes/${video.fields.programmes[0].fields.slug}`}
										class="ite relative z-10 rounded-md bg-green-variation px-3 py-1.5 font-medium text-gray-600 duration-300"
									>
										{video.fields.programmes[0].fields.title}
									</a>
									<span class="text-gray-500">{formatDateNews(video.fields.date)}</span>
								</div>
								<h1
									class="font text-base font-bold leading-tight text-black group-hover:text-green-normal lg:text-xl"
								>
									{video.fields.title}
								</h1>
								<p class="text-sm text-black">
									<span>{video.fields.summary}</span>
								</p>
								<!-- <p class="text-sm text-gray-500">{formatDateNews(video.fields.date)}</p> -->
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<ul class="h-[full]">
			<li>
				<VideoWrapper
					videoSrcURL={videosArray[0].fields.url}
					videoWidth="1248"
					videoHeight="600"
					videoTitle={videosArray[0].fields.title}
					videoImage={videosArray[0].fields.image.fields.file.url}
				/>
				{#if showTitle}
					<div class="space-y-3 p-4">
						<h1
							class="text-base font-bold leading-tight text-black group-hover:text-green-normal lg:text-xl"
						>
							{videosArray[0].fields.title}
						</h1>
						<p class="text-sm text-black">
							<span>{videosArray[0].fields.summary}</span>
						</p>
						<p class="text-sm text-gray-500">{formatDateNews(videosArray[0].fields.date)}</p>
					</div>
				{/if}
			</li>
		</ul>
	{/if}
</div>
