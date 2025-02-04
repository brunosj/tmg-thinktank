<script lang="ts">
	export let iframeCode: string;

	// Extract src from iframe code using regex
	const srcMatch = iframeCode.match(/src="([^"]+)"/);
	const src = srcMatch ? srcMatch[1] : '';

	// Extract title if present (optional)
	const titleMatch = iframeCode.match(/title="([^"]+)"/);
	const title = titleMatch ? titleMatch[1] : '';
</script>

<div class="relative w-full pt-[56.25%]">
	<!-- 16:9 aspect ratio wrapper -->
	<iframe
		{src}
		{title}
		class="absolute left-0 top-0 h-full w-full border-0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
	></iframe>
</div>
