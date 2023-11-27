<script>
	export let videoSrcURL;
	export let videoTitle;
	export let videoWidth;
	export let videoHeight;
	export let videoImage;

	let showVideoPlayer = false;
	let youtubeApiLoaded = false;

	function loadYoutubeApi() {
		if (!youtubeApiLoaded) {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			youtubeApiLoaded = true;
		}
	}

	function loadYoutubeVideo() {
		if (!showVideoPlayer) {
			loadYoutubeApi();
			showVideoPlayer = true;
		} else {
			if (youtubePlayer) {
				youtubePlayer.playVideo();
			}
		}
	}
</script>

<div class="left-0 top-0 w-full">
	{#if showVideoPlayer}
		<iframe
			src={videoSrcURL}
			title={videoTitle}
			class="w-full"
			frameborder="0"
			webkitallowfullscreen="true"
			mozallowfullscreen="true"
			allowfullscreen
			width={videoWidth}
			height={videoHeight}
		/>
	{:else}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<img
			loading="lazy"
			src={videoImage}
			alt={videoTitle}
			class="w-full"
			on:click={loadYoutubeVideo}
			style="cursor: pointer;"
		/>
	{/if}
</div>
