<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$components/UI/Button.svelte';

	let action_result: any = $state();
	let success = $state(false);
	let message_type = 'error';
	let submitting = $state(false);

	// Email validation pattern
	let emailPattern = $state('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');

	// Honeypot check - if this field is filled, it's likely a bot
	let honeypot = $state('');

	const handle_result = (result: any) => {
		action_result = result;
		if (result.type === 'success') {
			success = true;
		} else if (result.type === 'failure') {
			message_type = 'error';
		}
	};
</script>

<div class="bg-blue-light p-5 lg:p-24">
	<div class="layout rounded-md bg-green-light p-10">
		<h2
			class="pb-10 text-3xl font-extrabold leading-tight tracking-tight text-blue-normal sm:text-4xl"
		>
			Get in touch!
		</h2>

		<form
			method="POST"
			action="/contact"
			use:enhance={() => {
				submitting = true;

				// If honeypot field is filled, prevent actual submission
				if (honeypot) {
					return ({ update }) => {
						setTimeout(() => {
							success = true;
							submitting = false;
							update({ reset: true });
						}, 1000);
						return;
					};
				}

				return ({ update, result }) => {
					submitting = false;
					handle_result(result);
					update({ reset: true });
				};
			}}
		>
			<div class="space-y-6">
				<div class="grid grid-cols-2 gap-6">
					<div class="space-y-3">
						<label for="name" class="font-semibold"> Name </label>
						<div class="w-full">
							<input
								type="text"
								name="name"
								class="focus:shadow-outline w-full appearance-none rounded-md border border-gray-400 bg-white px-5 py-3 leading-snug text-black placeholder-gray-600 transition duration-300 ease-in-out focus:border-blue-300 focus:outline-none"
								disabled={submitting}
							/>
						</div>
					</div>
					<div class="space-y-3">
						<label for="email" class="font-semibold"> Email* </label>
						<div class="">
							<input
								type="email"
								name="email"
								class="focus:shadow-outline w-full appearance-none rounded-md border border-gray-400 bg-white px-5 py-3 leading-snug text-black placeholder-gray-600 transition duration-300 ease-in-out focus:border-blue-300 focus:outline-none"
								required
								pattern={emailPattern}
								title="Please enter a valid email address"
								disabled={submitting}
							/>
						</div>
					</div>
				</div>

				<div class="space-y-3">
					<label for="subject" class="font-semibold"> Subject* </label>
					<div class="">
						<input
							type="subject"
							name="subject"
							class="focus:shadow-outline w-full appearance-none rounded-md border border-gray-400 bg-white px-5 py-3 leading-snug text-black placeholder-gray-600 transition duration-300 ease-in-out focus:border-blue-300 focus:outline-none"
							required
							maxlength="100"
							disabled={submitting}
						/>
					</div>
				</div>
				<div class="space-y-3">
					<label for="message" class="font-semibold"> Message* </label>
					<textarea
						name="message"
						class="focus:shadow-outline h-full w-full appearance-none rounded-md border border-gray-400 bg-white px-5 py-6 leading-snug text-black placeholder-gray-600 transition duration-300 ease-in-out focus:border-blue-300 focus:outline-none"
						required
						maxlength="1000"
						disabled={submitting}
					></textarea>
				</div>
				<div class="">
					{#if action_result?.missing}<p class="error">The email field is required</p>{/if}

					{#if success}
						<p class="text-blue-normal">Thanks! Your email has been sent</p>
					{:else if action_result === 'failure'}
						<p>Ooops! There was an error.</p>
					{:else}
						<Button colors="green" submit={true} disabled={submitting}>
							{submitting ? 'Sending...' : 'Submit'}
						</Button>
					{/if}
				</div>

				<div class="absolute hidden h-0 w-0">
					<input type="text" name="_gotcha" bind:value={honeypot} />
				</div>
			</div>
		</form>
	</div>
</div>
