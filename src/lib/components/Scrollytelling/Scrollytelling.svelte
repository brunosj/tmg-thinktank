<script lang="ts">
	import Scrolly from '$lib/components/Scrollytelling/ScrollyComponent.svelte';
	import RenderBlocks from '$lib/components/RenderBlocks.svelte';

	interface ScrollytellingProps {
		block: {
			content: any[];
			id?: string;
			blockType: 'scrollytelling';
		};
		className?: string;
	}

	let { block, className = '' }: ScrollytellingProps = $props();

	const { content } = block;
	let value = $state(undefined);
</script>

<article class="scrollytelling-block {className}">
	<div class="section-container">
		<section class="steps-container">
			<Scrolly bind:value>
				{#each content as item, i}
					<div class="step" class:active={value === i}>
						<div class="step-content">
							<RenderBlocks blocks={[item]} />
						</div>
					</div>
				{/each}
				<div class="spacer"></div>
			</Scrolly>
		</section>
		{#if content && content.length > 0}
			<section class="sticky">
				<!-- This would be where a chart or other sticky content goes -->
				<div class="sticky-content">
					<p>Step {value !== undefined ? value + 1 : 0} of {content.length}</p>
				</div>
			</section>
		{/if}
	</div>
</article>

<style>
	article {
		font-family: monospace;
	}

	.spacer {
		height: 40vh;
	}

	.sticky {
		position: sticky;
		top: 10%;
		flex: 1 1 60%;
		width: 60%;
	}

	.section-container {
		margin-top: 1em;
		text-align: center;
		transition: background 100ms;
		display: flex;
	}

	.step {
		height: 80vh;
		display: flex;
		place-items: center;
		justify-content: center;
	}

	.step-content {
		font-size: 1rem;
		/* background: whitesmoke; */
		opacity: 50%;
		border-radius: 5px;
		padding: 0.5rem 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		transition: background 500ms ease;
		box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
		text-align: left;
		width: 75%;
		margin: auto;
		max-width: 500px;
		border-radius: 0.5rem;
	}

	.step.active .step-content {
		background: #2c2c2c;
		opacity: 100%;
	}

	.steps-container,
	.sticky {
		height: 100%;
	}

	.steps-container {
		flex: 1 1 40%;
		z-index: 10;
	}

	@media screen and (max-width: 768px) {
		.section-container {
			flex-direction: column-reverse;
		}
		.sticky {
			width: 95%;
			margin: auto;
		}
	}
</style>
