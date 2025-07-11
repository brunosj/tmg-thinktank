<script lang="ts">
	import RichText from '$lib/components/RichText.svelte';
	import { clsx } from 'clsx';

	interface TableProps {
		block: any; // Using any for now until TableBlock type is generated
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

	let { block, reportColors, className = '' }: TableProps = $props();

	// Access properties from the nested structure
	const parameters = (block as any).parameters || {};
	const content = (block as any).content || {};

	// Extract layout parameters
	const width = parameters.width || 'full';
	const position = parameters.position || 'left';
	const rowGap = parameters.rowGap || 'normal';
	const insideContainer = parameters.insideContainer === true; // default false for table
	const title = parameters.title;

	// Extract padding properties with type assertion for new fields
	const paddingTop = parameters.paddingTop || 'normal';
	const paddingBottom = parameters.paddingBottom || 'normal';
	const paddingLeft = parameters.paddingLeft || 'none';
	const paddingRight = parameters.paddingRight || 'none';

	// Extract content
	const rows = content.rows || [];

	// Helper to resolve color values with opacity support
	function resolveColor(
		colorValue: string | null | undefined,
		opacity: string = '100'
	): string | undefined {
		if (!colorValue) return undefined;

		let resolvedColor: string | undefined;

		// If it's a direct hex color or transparent, use it
		if (colorValue.startsWith('#')) {
			resolvedColor = colorValue;
		} else if (colorValue === 'transparent') {
			return 'transparent';
		} else {
			// Map to report colors
			switch (colorValue) {
				case 'primary':
					resolvedColor = reportColors?.primary || undefined;
					break;
				case 'primaryLight':
					resolvedColor = reportColors?.primaryLight || undefined;
					break;
				case 'secondary':
					resolvedColor = reportColors?.secondary || undefined;
					break;
				case 'secondaryLight':
					resolvedColor = reportColors?.secondaryLight || undefined;
					break;
				case 'tertiary':
					resolvedColor = reportColors?.tertiary || undefined;
					break;
				case 'tertiaryLight':
					resolvedColor = reportColors?.tertiaryLight || undefined;
					break;
				default:
					resolvedColor = colorValue;
			}
		}

		// Apply opacity if we have a resolved color and it's not transparent
		if (resolvedColor && resolvedColor !== 'transparent' && opacity !== '100') {
			// Convert hex to rgba if needed
			if (resolvedColor.startsWith('#')) {
				const hex = resolvedColor.slice(1);
				const r = parseInt(hex.substr(0, 2), 16);
				const g = parseInt(hex.substr(2, 2), 16);
				const b = parseInt(hex.substr(4, 2), 16);
				const alpha = parseInt(opacity) / 100;
				return `rgba(${r}, ${g}, ${b}, ${alpha})`;
			}
		}

		return resolvedColor;
	}

	// Helper to get row gap value
	function getRowGap(gap: string): string {
		switch (gap) {
			case 'none':
				return '0';
			case 'small':
				return '0.5rem';
			case 'normal':
				return '1rem';
			case 'large':
				return '1.5rem';
			case 'xl':
				return '2rem';
			default:
				return '1rem';
		}
	}

	// Helper to get padding value
	function getPadding(size: string): string {
		switch (size) {
			case 'none':
				return '0';
			case 'small':
				return '1rem';
			case 'normal':
				return '2rem';
			case 'large':
				return '3rem';
			case 'xl':
				return '4rem';
			default:
				return '2rem';
		}
	}

	// Helper to get font size value
	function getFontSize(size: string): string {
		switch (size) {
			case 'small':
				return '0.875rem';
			case 'normal':
				return '1rem';
			case 'large':
				return '1.125rem';
			case 'xl':
				return '1.25rem';
			default:
				return '1rem';
		}
	}

	// Helper to get font weight value
	function getFontWeight(weight: string): string {
		switch (weight) {
			case 'normal':
				return '400';
			case 'medium':
				return '500';
			case 'semibold':
				return '600';
			case 'bold':
				return '700';
			default:
				return '400';
		}
	}

	// Create CSS custom properties for table-level styling
	const tableCssVars = $derived(() => {
		const vars: Record<string, string> = {};
		// Only keep essential styling - spacing now handled by Tailwind
		return vars;
	});

	// Create CSS custom properties for each row
	function getRowCssVars(row: any): Record<string, string> {
		const vars: Record<string, string> = {};
		const styling = row.styling || {};

		const backgroundOpacity = styling.backgroundOpacity || '100';
		const resolvedBgColor = resolveColor(styling.backgroundColor, backgroundOpacity);
		const resolvedTextColor = resolveColor(styling.textColor);

		if (resolvedBgColor) vars['--row-bg-color'] = resolvedBgColor;
		if (resolvedTextColor) vars['--row-text-color'] = resolvedTextColor;

		vars['--row-font-size'] = getFontSize(styling.fontSize || 'normal');
		vars['--row-font-weight'] = getFontWeight(styling.fontWeight || 'normal');

		return vars;
	}

	// Convert CSS vars object to style string
	const tableStyleString = $derived(() => {
		return Object.entries(tableCssVars())
			.map(([key, value]) => `${key}: ${value}`)
			.join('; ');
	});

	function getRowStyleString(row: any): string {
		return Object.entries(getRowCssVars(row))
			.map(([key, value]) => `${key}: ${value}`)
			.join('; ');
	}

	// Wrapper classes using clsx - consistent with other components
	const wrapperClasses = $derived(() => {
		return clsx(
			// Base wrapper styling
			'flex',

			// Container styling
			insideContainer && [
				'layout',
				// Container positioning based on position
				position === 'left' && 'mr-auto',
				position === 'center' && 'mx-auto',
				position === 'right' && 'ml-auto'
			],

			// Flexbox alignment for table positioning based on position
			position === 'left' && 'justify-start',
			position === 'center' && 'justify-center',
			position === 'right' && 'justify-end'
		);
	});

	// Table container classes with Tailwind spacing
	const tableClasses = $derived(() => {
		return clsx(
			// Base styling with mobile-first full width and flex column layout
			'table-block relative w-full flex flex-col',

			// Row gap using Tailwind space-y
			rowGap === 'none' && 'space-y-0',
			rowGap === 'small' && 'space-y-2',
			rowGap === 'normal' && 'space-y-4',
			rowGap === 'large' && 'space-y-6',
			rowGap === 'xl' && 'space-y-8',
			!rowGap && 'space-y-4', // default

			// Width constraints - full width on mobile, constrained on desktop
			width === 'half' && 'md:max-w-[50%] md:w-fit',
			width === 'two-thirds' && 'md:max-w-[66.666667%] md:w-fit',
			width === 'full' && 'w-full',

			// Padding using Tailwind classes
			paddingTop === 'none' && 'pt-0',
			paddingTop === 'small' && 'pt-4',
			paddingTop === 'normal' && 'pt-8',
			paddingTop === 'large' && 'pt-12',
			paddingTop === 'xl' && 'pt-16',
			!paddingTop && 'pt-8', // default

			paddingBottom === 'none' && 'pb-0',
			paddingBottom === 'small' && 'pb-4',
			paddingBottom === 'normal' && 'pb-8',
			paddingBottom === 'large' && 'pb-12',
			paddingBottom === 'xl' && 'pb-16',
			!paddingBottom && 'pb-8', // default

			paddingLeft === 'none' && 'pl-0',
			paddingLeft === 'small' && 'pl-4',
			paddingLeft === 'normal' && 'pl-8',
			paddingLeft === 'large' && 'pl-12',
			paddingLeft === 'xl' && 'pl-16',
			!paddingLeft && 'pl-8', // default

			paddingRight === 'none' && 'pr-0',
			paddingRight === 'small' && 'pr-4',
			paddingRight === 'normal' && 'pr-8',
			paddingRight === 'large' && 'pr-12',
			paddingRight === 'xl' && 'pr-16',
			!paddingRight && 'pr-8', // default

			// Custom className
			className
		);
	});

	// Row classes with Tailwind
	function getRowClasses(row: any): string {
		const layout = row.layout || {};
		const columnLayout = layout.columnLayout || 'single';

		return clsx(
			'table-row w-full rounded-md',
			// Padding for rows
			'p-2 md:p-4',
			// Column layout
			columnLayout === 'single' && 'single-column',
			columnLayout === 'two' && 'two-columns grid grid-cols-1 md:grid-cols-2 gap-4'
		);
	}

	// Valid rows filter
	const validRows = $derived(() => {
		return (
			rows?.filter((row: any) => {
				const layout = row?.layout || {};
				// Check if row has content based on its layout type
				if (layout.columnLayout === 'two') {
					return layout.leftContent || layout.rightContent;
				} else {
					return layout.singleContent;
				}
			}) || []
		);
	});
</script>

<div class={wrapperClasses()}>
	<div class={tableClasses()}>
		{#if title}
			<h2 class="mb-2 text-sm font-medium">{title}</h2>
		{/if}
		{#each validRows() as row, index (row.id || index)}
			{@const layout = row.layout || {}}
			{@const columnLayout = layout.columnLayout || 'single'}

			<div class={getRowClasses(row)} style={getRowStyleString(row)}>
				{#if columnLayout === 'single'}
					<!-- Single Column Layout -->
					<div class="w-full">
						{#if layout.singleContent}
							<RichText content={layout.singleContent} />
						{/if}
					</div>
				{:else if columnLayout === 'two'}
					<!-- Two Column Layout - Grid handled by getRowClasses -->
					<div class="w-full">
						{#if layout.leftContent}
							<RichText content={layout.leftContent} />
						{/if}
					</div>
					<div class="w-full">
						{#if layout.rightContent}
							<RichText content={layout.rightContent} />
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	/* Table title styling using CSS variables for dynamic content */

	/* Row-level styling using CSS variables for colors */
	.table-row {
		background-color: var(--row-bg-color, transparent);
		color: var(--row-text-color, inherit);
		font-size: var(--row-font-size, 1rem);
		font-weight: var(--row-font-weight, 400);
		/* border-radius: 0.375rem; */
		box-sizing: border-box;
		width: 100%;
	}

	/* Single column layout */
	.single-column .column-content {
		width: 100%;
	}

	/* Two column layout with CSS Grid */
	.two-columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		align-items: start;
	}

	/* Bullet styling */
	.bullet {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
		margin-right: 0.5rem;
		flex-shrink: 0;
	}

	.bullet-column {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}
</style>
