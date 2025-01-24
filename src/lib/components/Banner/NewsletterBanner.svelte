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

<section class="bgGradientTL">
	<div class="container relative px-4 py-16 lg:py-24">
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-3">
			<div class="col-span-2 space-y-6">
				<h2 class="max-w-2xl text-2xl font-bold leading-tight text-white md:text-3xl lg:text-5xl">
					{landingPage.fields.newsletterBanner.fields.title}
				</h2>

				<p class="max-w-xl text-base text-white/90 md:text-lg">
					{landingPage.fields.newsletterBanner.fields.subtitle}
				</p>

				<div>
					<Button to={landingPage.fields.newsletterBanner.fields.buttonPath} colors="white">
						{landingPage.fields.newsletterBanner.fields.buttonText}
					</Button>
				</div>
			</div>

			<div class="relative mx-auto w-full max-w-md">
				<div class="relative aspect-[3/4] transform-gpu">
					<a href="/newsletter" class="group">
						<div
							class="absolute left-[5%] top-0 h-[85%] w-[70%] transition-transform duration-300 hover:-translate-y-2"
						>
							<img
								loading="lazy"
								src={getImage(newsletter[0])}
								alt={`Newsletter ${newsletter[0].fields.number}`}
								class="h-full w-full rounded-lg object-cover shadow-lg"
							/>
						</div>
						<div
							class="absolute right-[5%] top-[15%] h-[85%] w-[70%] transition-transform duration-300 hover:-translate-y-2"
						>
							<img
								loading="lazy"
								src={getImage(newsletter[1])}
								alt={`Newsletter ${newsletter[1].fields.number}`}
								class="h-full w-full rounded-lg object-cover shadow-lg"
							/>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
