<script lang="ts">
	import type { Newsletter, LandingPage } from '$lib/types/types';
	import Button from '$components/UI/Button.svelte';

	interface Props {
		newsletter: Newsletter[];
		landingPage: LandingPage;
	}

	let { newsletter, landingPage }: Props = $props();
	let email = $state('');
	let loading = $state(false);
	let success = $state(false);
	let error = $state('');

	function getImage(newsletter: Newsletter) {
		return newsletter.fields.thumbnailCdn?.length > 0
			? newsletter.fields.thumbnailCdn[0].secure_url
			: newsletter.fields.thumbnail.fields.file.url;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		console.log('🚀 Newsletter signup initiated:', { email });

		loading = true;
		error = '';
		success = false;

		try {
			console.log('📤 Sending request to /api/newsletter/subscribe');
			const response = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			console.log('📥 Response received:', {
				status: response.status,
				statusText: response.statusText,
				headers: Object.fromEntries(response.headers.entries())
			});

			const data = await response.json();
			console.log('📦 Response data:', data);

			if (!response.ok) {
				console.error('❌ Request failed:', { status: response.status, data });
				throw new Error(data.message || 'Failed to subscribe');
			}

			console.log('✅ Subscription successful');
			success = true;
			email = '';
		} catch (err) {
			console.error('🔥 Error during subscription:', err);
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
			console.log('🏁 Subscription flow completed:', { success, error });
		}
	}
</script>

<section class="bgGradientTL">
	<div class="layout relative px-4 py-16 lg:py-24">
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-3">
			<div class="col-span-2 space-y-6">
				<h2 class="max-w-2xl text-2xl font-bold leading-tight text-white md:text-3xl lg:text-5xl">
					{landingPage.fields.newsletterBanner.fields.title}
				</h2>

				<p class="max-w-xl text-base text-white/90 md:text-lg">
					{landingPage.fields.newsletterBanner.fields.subtitle}
				</p>

				<form class="flex max-w-md flex-col gap-4 sm:flex-row" onsubmit={handleSubmit}>
					<div class="flex-1">
						<input
							type="email"
							bind:value={email}
							placeholder="Enter your email"
							required
							class="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
							disabled={loading}
						/>
					</div>
					<Button colors="white" submit disabled={loading}>
						{loading ? 'Subscribing...' : landingPage.fields.newsletterBanner.fields.buttonText}
					</Button>
				</form>

				{#if success}
					<p class="text-sm font-medium text-green-300">
						Thank you for subscribing to our newsletter! Please make sure to activate your
						subscription by clicking the link in the email we have sent you.
					</p>
				{/if}

				{#if error}
					<p class="text-sm font-medium text-red-300">
						{error}
					</p>
				{/if}
			</div>

			<div class="relative mx-auto w-full max-w-md">
				<div class="relative aspect-[3/4] transform-gpu">
					<div class="group">
						<div
							class="absolute left-[5%] top-0 h-[85%] w-[70%] transition-transform duration-300 group-hover:-translate-y-2"
						>
							<img
								loading="lazy"
								src={getImage(newsletter[0])}
								alt={`Newsletter ${newsletter[0].fields.number}`}
								class="h-full w-full rounded-lg object-cover shadow-lg"
							/>
						</div>
						<div
							class="absolute right-[5%] top-[15%] h-[85%] w-[70%] transition-transform duration-300 group-hover:-translate-y-2"
						>
							<img
								loading="lazy"
								src={getImage(newsletter[1])}
								alt={`Newsletter ${newsletter[1].fields.number}`}
								class="h-full w-full rounded-lg object-cover shadow-lg"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
