<script lang="ts">
	export let item: PublicationFeature;

	import type { PublicationFeature } from '$lib/types/types';
</script>

<section class="h-full w-full">
	<img
		loading="lazy"
		src={item.fields.pageBannerCdn[0].secure_url}
		alt={item.fields.title}
		class="h-[40vh] w-full object-cover lg:h-[60vh]"
	/>
</section>
