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

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		loading = true;
		error = '';
		success = false;

		try {
			const response = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Failed to subscribe');
			}

			success = true;
			email = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<section class="bgGradientBR relative overflow-hidden">
	<!-- Decorative elements inspired by initiatives page -->
	<div class="absolute inset-0">
		<div class="absolute left-0 top-0 h-32 w-32 rounded-full bg-white/5 blur-xl"></div>
		<div class="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white/5 blur-xl"></div>
		<div class="absolute right-1/4 top-1/2 h-24 w-24 rounded-full bg-white/5 blur-lg"></div>
	</div>

	<div class="layout relative z-10 py-16 md:py-20">
		<div class="mx-auto max-w-6xl">
			<div class="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
				<!-- Content section -->
				<div class="space-y-6 md:col-span-7">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>

					<h2 class="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
						{landingPage.fields.newsletterBanner.fields.title}
					</h2>

					<p class="max-w-xl text-base text-white/90 md:text-lg">
						{landingPage.fields.newsletterBanner.fields.subtitle}
					</p>

					<form class="flex max-w-lg flex-col gap-4 sm:flex-row" onsubmit={handleSubmit}>
						<div class="flex-1">
							<input
								type="email"
								bind:value={email}
								placeholder="Enter your email"
								required
								class="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white backdrop-blur-xs placeholder:text-white/60 focus:border-white/50 focus:outline-hidden focus:ring-2 focus:ring-white/20"
								disabled={loading}
							/>
						</div>
						<Button colors="white" submit disabled={loading}>
							{loading ? 'Subscribing...' : landingPage.fields.newsletterBanner.fields.buttonText}
						</Button>
					</form>

					{#if success}
						<div class="flex items-center rounded-lg bg-green-500/20 p-3 backdrop-blur-xs">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5 text-green-300"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<p class="text-sm font-medium text-green-100">
								Thank you for subscribing! Please check your email to confirm your subscription.
							</p>
						</div>
					{/if}

					{#if error}
						<div class="flex items-center rounded-lg bg-red-500/20 p-3 backdrop-blur-xs">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5 text-red-300"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
							<p class="text-sm font-medium text-red-100">{error}</p>
						</div>
					{/if}
				</div>

				<!-- Card grid section -->
				<div class="md:col-span-5">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
						<div class="rounded-lg bg-white/10 p-4 backdrop-blur-xs">
							<div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
									/>
								</svg>
							</div>
							<h3 class="mb-1 font-heading text-lg font-medium text-white">Stay Updated</h3>
							<p class="text-sm text-white/80">
								Get timely updates about events, initiatives and news
							</p>
						</div>

						<div class="rounded-lg bg-white/10 p-4 backdrop-blur-xs">
							<div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
									/>
								</svg>
							</div>
							<h3 class="mb-1 font-heading text-lg font-medium text-white">Learning Network</h3>
							<p class="text-sm text-white/80">Insights and resources from our partners</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes float {
		0% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-10px) rotate(5deg);
		}
		100% {
			transform: translateY(0) rotate(0deg);
		}
	}

	.animate-float {
		animation: float 6s ease-in-out infinite;
	}
</style>
