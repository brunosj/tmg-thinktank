<script lang="ts">
	export let scrollPrev: () => void;
	export let enabled: boolean;
</script>

<button
	class="embla__button embla__button--prev"
	on:click|preventDefault={scrollPrev}
	disabled={!enabled}
	aria-label="Previous slide"
>
	<svg class="embla__button__svg" viewBox="137.718 -1.001 366.563 644">
		<path
			d="M428.36 12.5c16.67-16.67 43.76-16.67 60.42 0 16.67 16.67 16.67 43.76 0 60.42L241.7 320c148.25 148.24 230.61 230.6 247.08 247.08 16.67 16.66 16.67 43.75 0 60.42-16.67 16.66-43.76 16.67-60.42 0-27.72-27.71-249.45-249.37-277.16-277.08a42.308 42.308 0 0 1-12.48-30.34c0-11.1 4.1-22.05 12.48-30.42C206.63 234.23 400.64 40.21 428.36 12.5z"
			fill="#67797B"
		/>
	</svg>
</button>

<style>
	.embla__button {
		z-index: 1;
		position: relative;
		background-color: transparent;
		border-radius: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		width: 3.5rem;
		height: 3.5rem;
	}

	.embla__button:disabled {
		opacity: 0.3;
	}
	.embla__button__svg {
		width: 65%;
		height: 45%;
		fill: #67797b;
	}

	@media (max-width: 1024px) {
		.embla__button--prev {
			left: 0.5rem;
		}
		.embla__button--next {
			right: 0.5rem;
		}

		.embla__button {
			top: 65%;
			transform: translateY(-140%);
			cursor: pointer;
			width: 2rem;
			height: 2rem;
		}
	}
</style>
