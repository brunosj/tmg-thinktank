<script lang="ts">
	export let newsletter: Newsletter[];
	export let landingPage: LandingPage;

	import type { Newsletter, LandingPage } from '$lib/types/types';
	import Button from '$components/UI/Button.svelte';

	function getImage(newsletter: Newsletter) {
		return newsletter.fields.thumbnailCdn?.length > 0
			? newsletter.fields.thumbnailCdn[0].secure_url
			: newsletter.fields.thumbnail.fields.file.url;
	}
</script>

<section
	class={landingPage.fields.newsletterBanner.fields.backgroundColor === 'TMG Green'
		? 'bg-green-normal'
		: 'bg0-white'}
>
	<div class="container grid grid-cols-1 items-center py-10 lg:grid-cols-3">
		<div class="col-span-2 pb-10 pt-5 lg:pb-0 lg:pt-0">
			<div class="pb-5">
				<p class="rounded-lg text-lg font-semibold leading-tight text-white lg:text-4xl">
					{landingPage.fields.newsletterBanner.fields.title}
				</p>
			</div>
			<p class="pb-5 text-sm font-normal text-white lg:text-xl">
				{landingPage.fields.newsletterBanner.fields.subtitle}
			</p>
			<Button to={landingPage.fields.newsletterBanner.fields.buttonPath} colors="white">
				{landingPage.fields.newsletterBanner.fields.buttonText}
			</Button>
		</div>
		<div class="relative m-auto">
			<a href="/newsletter">
				<div class="absolute left-0 top-0 h-full w-full">
					<img
						loading="lazy"
						src={getImage(newsletter[0])}
						alt={`${newsletter[0].fields.number}`}
						class="w-48"
					/>
				</div>
			</a>
			<a href="/newsletter">
				<div class="z-10 ml-20 mt-10 h-full w-full">
					<img
						loading="lazy"
						src={getImage(newsletter[1])}
						alt={`${newsletter[1].fields.number}`}
						class="w-48"
					/>
				</div>
			</a>
		</div>
	</div>
</section>
