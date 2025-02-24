<script lang="ts">
	import type { Video } from '$lib/types/types';
	import VideoWrapper from '$components/Video/VideoWrapper.svelte';
	interface Props {
		video: Video;
		bgColor: string;
		text: string;
		order?: string;
		textAlignment?: string;
	}

	let { video, bgColor, text, order = 'order-last', textAlignment = 'text-left' }: Props = $props();
</script>

<section class="">
	<div style="background-color: {bgColor}">
		<div class="layout grid grid-cols-1 items-center gap-x-12 py-16 lg:grid-cols-2">
			<div class={textAlignment}>
				<div
					class="pb-10 pt-5 text-2xl font-extrabold leading-tight text-white lg:pb-0 lg:pt-0 lg:text-7xl"
				>
					{text}
				</div>
			</div>
			<div class={order}>
				<div class="flex justify-end">
					<div class="w-full">
						<VideoWrapper
							videoSrcURL={video.fields.url}
							videoWidth="1248"
							videoHeight="600"
							videoTitle={video.fields.title}
							videoImage={video.fields.image.fields.file.url}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
