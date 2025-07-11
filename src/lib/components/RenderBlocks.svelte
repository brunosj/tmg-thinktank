<script lang="ts">
	// @ts-nocheck
	import Hero from './blocks/report-blocks/Hero.svelte';
	import Highlights from './blocks/report-blocks/Highlights.svelte';
	import GridTextImage from './blocks/report-blocks/GridTextImage.svelte';
	import TextBox from './blocks/report-blocks/TextBox.svelte';
	import TwoColumn from './blocks/report-blocks/TwoColumn.svelte';
	import Table from './blocks/report-blocks/Table.svelte';
	import Text from './blocks/atomic-blocks/Text.svelte';
	import Heading from './blocks/atomic-blocks/Heading.svelte';
	import Picture from './blocks/atomic-blocks/Picture.svelte';
	import Scrollytelling from './Scrollytelling/Scrollytelling.svelte';
	import Section from './blocks/Section.svelte';
	import { clsx } from 'clsx';

	interface RenderBlocksProps {
		blocks: Array<{ blockType: string; [key: string]: any }>;
		reportColors?: {
			primary?: string | null;
			primaryLight?: string | null;
			secondary?: string | null;
			secondaryLight?: string | null;
			tertiary?: string | null;
			tertiaryLight?: string | null;
		};
		className?: string;
	}

	let { blocks, reportColors, className = '' }: RenderBlocksProps = $props();

	// Component mapping for different block types
	const blockComponents = {
		scrollytelling: Scrollytelling,
		textBox: TextBox,
		twoColumn: TwoColumn,
		table: Table,
		hero: Hero,
		highlights: Highlights,
		gridTextImage: GridTextImage,
		text: Text,
		heading: Heading,
		picture: Picture,
		section: Section
	};

	// Helper to get the component for a block type
	function getBlockComponent(blockType: string) {
		return blockComponents[blockType as keyof typeof blockComponents];
	}

	// Filter out any undefined blocks
	const validBlocks = $derived(() => {
		return blocks?.filter((block) => block && block.blockType) || [];
	});

	// Wrapper classes using clsx
	const wrapperClasses = $derived(() => {
		return clsx('render-blocks w-full', className);
	});

	// Block wrapper classes using clsx
	const blockWrapperClasses = (blockType: string) => {
		return clsx(
			'block-wrapper relative w-full',
			// Standard spacing between blocks
			'',
			// Special spacing for scrollytelling blocks
			blockType === 'scrollytelling',
			// Hero blocks get special spacing
			blockType === 'hero'
			// Highlights blocks can be closer together
			// (handled by adjacent selectors in CSS)
		);
	};
</script>

<div class={wrapperClasses()}>
	{#each validBlocks() as block, index (block.id || index)}
		{@const BlockComponent = getBlockComponent(block.blockType)}
		{@const typedBlock = block as any}
		{#if BlockComponent}
			<div class={blockWrapperClasses(block.blockType)} data-block-type={block.blockType}>
				<!-- eslint-disable-next-line @typescript-eslint/ban-ts-comment -->
				<!-- @ts-ignore -->
				<BlockComponent block={typedBlock} {reportColors} />
			</div>
		{:else}
			<div class="block-error my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
				<p class="m-0 font-medium">Unknown block type: {block.blockType}</p>
			</div>
		{/if}
	{/each}
</div>

<style>
	/* Special case for highlights blocks to be closer together */
	.block-wrapper[data-block-type='highlights'] + .block-wrapper[data-block-type='highlights'] {
		margin-top: 0.25rem;
	}
</style>
