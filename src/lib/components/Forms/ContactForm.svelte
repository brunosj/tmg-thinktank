<script>
	export let form;

	import { enhance } from '$app/forms';
	import Button from '$components/UI/Button.svelte';
	import { elasticOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let action_result;
	let success = false;
	let message_type = 'error';

	const handle_result = (result) => {
		action_result = result;
		if (result.type === 'success') {
			success = true;
		} else if (result.type === 'failure') {
			message_type = 'error';
		}
	};

	export const spin = (node, { delay, duration }) => {
		return {
			delay,
			duration,
			css: (t) => {
				const eased = elasticOut(t);
				return `
          transform: scale(${eased}) rotate(${eased * 360}deg);
          `;
			}
		};
	};
</script>

<div class="bg-green-variation p-5 lg:p-24">
	<div class="container rounded-lg bg-green-light p-10">
		<h2
			class="pb-10 text-3xl font-extrabold leading-tight tracking-tight text-green-normal sm:text-4xl"
		>
			Get in touch!
		</h2>

		<form
			method="POST"
			action="/contact"
			use:enhance={() => {
				return ({ update, result }) => {
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
								class="-md focus:shadow-outline w-full appearance-none rounded-md border border-gray-400 bg-white px-5 py-3 leading-snug text-black placeholder-gray-600 transition duration-300 ease-in-out focus:border-blue-300 focus:outline-none sm:max-w-sm"
							/>
						</div>
					</div>
					<div class="space-y-3">
						<label for="email" class="font-semibold"> Email* </label>
						<div class="">
							<input
								type="email"
								name="email"
								class="-md focus:shadow-outline w-full appearance-none rounded-md border border-gray-400 bg-white px-5 py-3 leading-snug text-black placeholder-gray-600 transition duration-300 ease-in-out focus:border-blue-300 focus:outline-none sm:max-w-sm"
								value={form?.email ?? ''}
								required
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
							class="-md focus:shadow-outline w-full appearance-none rounded-md border border-gray-400 bg-white px-5 py-3 leading-snug text-black placeholder-gray-600 transition duration-300 ease-in-out focus:border-blue-300 focus:outline-none"
						/>
					</div>
				</div>
				<div class="space-y-3">
					<label for="message" class="font-semibold"> Message* </label>
					<textarea
						name="message"
						class="-md focus:shadow-outline h-full w-full appearance-none rounded-md border border-gray-400 bg-white px-5 py-6 leading-snug text-black placeholder-gray-600 transition duration-300 ease-in-out focus:border-blue-300 focus:outline-none"
					/>
				</div>
				<div class="">
					{#if form?.missing}<p class="error">The email field is required</p>{/if}

					{#if success}
						<p class="text-green-normal">Thanks! Your email has been sent</p>
					{:else if action_result === 'failure'}
						<p>Ooops! There was an error.</p>
					{:else}
						<Button colors="green" type="submit">Submit</Button>
					{/if}
				</div>

				<div class="absolute hidden h-0 w-0">
					<input type="text" name="_gotcha" />
				</div>
			</div>
		</form>
	</div>
</div>
