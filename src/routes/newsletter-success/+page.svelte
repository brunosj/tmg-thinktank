<script lang="ts">
	import SEO from '$components/SEO/SEO.svelte';
	import Button from '$components/UI/Button.svelte';
</script>

<SEO
	title="Newsletter Subscription Confirmed"
	description="Thank you for confirming your subscription to our newsletter."
/>

<div class="bgGradientBR lg:min-h-screen">
	<div
		class="layout my-auto flex flex-col items-center justify-center pb-12 pt-24 text-center lg:min-h-screen lg:pb-0"
	>
		<div class="max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
			<!-- Success banner -->
			<div class="bg-green-500 py-4">
				<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-10 w-10 text-green-500"
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
				</div>
			</div>

			<!-- Content -->
			<div class="space-y-6 px-8 py-10">
				<h1 class="text-2xl font-bold text-gray-900 lg:text-3xl">Subscription Confirmed!</h1>

				<p class="text-sm text-gray-600 lg:text-lg">
					Thank you for confirming your subscription to our newsletter. You will now receive our
					latest updates directly in your inbox.
				</p>

				<div class="rounded-lg bg-blue-50 p-5">
					<h3 class="mb-2 text-lg font-semibold text-blue-800">What's Next?</h3>
					<p class="text-gray-700">
						Look out for our next newsletter with updates about our initiatives, events, and
						insights from our partners. We're excited to have you join our community!
					</p>
				</div>

				<div class="pt-4">
					<Button to="/" colors="blue">Return to Homepage</Button>
					<div class="mt-4">
						<Button to="/newsletter" colors="white">View Past Newsletters</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
