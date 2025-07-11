<script lang="ts">
	import type { Event } from '$lib/types/types';
	import { formatDate, formatDay, formatMonth, formatYear } from '$utils/utils';

	interface Props {
		event: Event;
		accentColor: string;
	}

	let { event, accentColor }: Props = $props();
</script>

<a
	href={`/events/${event.fields.slug}`}
	class="block transform rounded-lg bg-white p-4 transition duration-300 hover:translate-y-[-2px] hover:shadow-md"
>
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
		<!-- Date Block -->
		<div
			class="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg text-white sm:h-24 sm:w-24"
			style="background-color: {accentColor};"
		>
			<span class="text-2xl font-bold leading-none sm:text-3xl">
				{formatDay(event.fields.date)}
			</span>
			<span class="text-sm font-medium uppercase tracking-wider sm:text-base">
				{formatMonth(event.fields.date).slice(0, 3)}
			</span>
			<span class="text-xs opacity-80">
				{formatYear(event.fields.date)}
			</span>
		</div>

		<!-- Content -->
		<div class="grow">
			<div class="mb-1 flex flex-wrap items-center gap-2">
				<span
					class="inline-block rounded-full px-2.5 py-1 text-xs font-medium"
					style="background-color: {accentColor}20; color: {accentColor};"
				>
					{event.fields.type}
				</span>

				{#if event.fields.programme?.fields?.title}
					<span
						class="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
					>
						{event.fields.programme.fields.title}
					</span>
				{/if}

				{#if event.fields.endDate && formatDay(event.fields.endDate) !== formatDay(event.fields.date)}
					<span class="text-xs text-gray-500">
						{formatDay(event.fields.date)}-{formatDay(event.fields.endDate)}
						{formatMonth(event.fields.date)}
					</span>
				{/if}
			</div>

			<h3 class="mb-1 line-clamp-2 text-lg font-semibold text-gray-900">
				{event.fields.title}
			</h3>

			{#if event.fields.location}
				<div class="flex items-center text-sm text-gray-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1 h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					{event.fields.location}
				</div>
			{/if}
		</div>

		<!-- Arrow indicator -->
		<div class="hidden items-center justify-center sm:flex">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
				style="color: {accentColor};"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
		</div>
	</div>
</a>
