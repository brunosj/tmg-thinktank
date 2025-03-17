<script lang="ts">
	import SEO from '$components/SEO/SEO.svelte';
	import Button from '$components/UI/Button.svelte';
</script>

<SEO
	title="Newsletter Subscription Confirmed"
	description="Thank you for confirming your subscription to our newsletter."
/>

<div class="min-h-[70vh] bg-gray-50">
	<div class="layout flex min-h-[70vh] flex-col items-center justify-center py-12 text-center">
		<div class="max-w-2xl space-y-6 rounded-xl bg-white p-8 shadow-lg">
			<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
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

			<h1 class="text-3xl font-bold text-gray-900">Subscription Confirmed!</h1>

			<p class="text-lg text-gray-600">
				Thank you for confirming your subscription to our newsletter. You will now receive our
				latest updates directly in your inbox.
			</p>

			<div class="pt-4">
				<Button to="/" colors="blue">Return to Homepage</Button>
			</div>
		</div>
	</div>
</div>
