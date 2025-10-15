<script lang="ts">
	interface LexicalNode {
		type: string;
		version?: number;
		children?: LexicalNode[];
		text?: string;
		format?: number | string; // number for text formatting, string for alignment
		style?: string;
		indent?: number;
		direction?: 'ltr' | 'rtl' | null;
		url?: string;
		target?: string;
		rel?: string;
		title?: string;
		tag?: string;
		value?: number;
		listType?: 'bullet' | 'number';
		start?: number;
		[key: string]: any;
	}

	interface LexicalContent {
		root: LexicalNode;
		[key: string]: any;
	}

	interface Props {
		content: LexicalContent | null;
		class?: string;
	}

	let { content, class: className = '' }: Props = $props();

	function getTextFormatClasses(format?: number | string): string {
		if (!format || typeof format !== 'number') return '';

		const classes: string[] = [];

		// Lexical format flags (bitwise)
		if (format & 1) classes.push('font-medium'); // Bold
		if (format & 2) classes.push('italic'); // Italic
		if (format & 4) classes.push('line-through'); // Strikethrough
		if (format & 8) classes.push('underline'); // Underline
		if (format & 16) classes.push('font-mono'); // Code
		if (format & 32) classes.push('subscript'); // Subscript
		if (format & 64) classes.push('superscript'); // Superscript

		return classes.join(' ');
	}
</script>

{#if content?.root}
	<div class={className}>
		{@render renderNode(content.root)}
	</div>
{/if}

{#snippet renderNode(node: LexicalNode)}
	{#if node.type === 'root'}
		{#if node.children}
			{#each node.children as child}
				{@render renderNode(child)}
			{/each}
		{/if}
	{:else if node.type === 'paragraph'}
		<p class="mb-4 last:mb-0">
			{#if node.children}
				{#each node.children as child}
					{@render renderNode(child)}
				{/each}
			{/if}
		</p>
	{:else if node.type === 'heading'}
		{#if node.tag === 'h1'}
			<h1 class="mt-0 mb-6 text-4xl font-semibold">
				{#if node.children}
					{#each node.children as child}
						{@render renderNode(child)}
					{/each}
				{/if}
			</h1>
		{:else if node.tag === 'h2'}
			<h2 class="mt-0 mb-5 text-3xl font-semibold">
				{#if node.children}
					{#each node.children as child}
						{@render renderNode(child)}
					{/each}
				{/if}
			</h2>
		{:else if node.tag === 'h3'}
			<h3 class="mt-0 mb-4 text-2xl font-semibold">
				{#if node.children}
					{#each node.children as child}
						{@render renderNode(child)}
					{/each}
				{/if}
			</h3>
		{:else if node.tag === 'h4'}
			<h4 class="mt-0 mb-3 text-xl font-semibold">
				{#if node.children}
					{#each node.children as child}
						{@render renderNode(child)}
					{/each}
				{/if}
			</h4>
		{:else if node.tag === 'h5'}
			<h5 class="mt-0 mb-2 text-lg font-semibold">
				{#if node.children}
					{#each node.children as child}
						{@render renderNode(child)}
					{/each}
				{/if}
			</h5>
		{:else if node.tag === 'h6'}
			<h6 class="mt-0 mb-2 text-base font-semibold">
				{#if node.children}
					{#each node.children as child}
						{@render renderNode(child)}
					{/each}
				{/if}
			</h6>
		{:else}
			<h1 class="mt-8 mb-6 text-4xl font-semibold">
				{#if node.children}
					{#each node.children as child}
						{@render renderNode(child)}
					{/each}
				{/if}
			</h1>
		{/if}
	{:else if node.type === 'text'}
		<span class={getTextFormatClasses(node.format)}>{node.text || ''}</span>
	{:else if node.type === 'link'}
		<a
			href={node.fields.url}
			target={node.fields.linkType === 'custom' ? '_blank' : '_self'}
			rel={node.rel}
			title={node.title}
			class="cursor-pointer text-blue-600 underline duration-300 hover:text-blue-800"
		>
			{#if node.children}
				{#each node.children as child}
					{@render renderNode(child)}
				{/each}
			{/if}
		</a>
	{:else if node.type === 'list'}
		{#if node.listType === 'number'}
			<ol class="mb-4 ml-4 list-inside list-decimal" start={node.start}>
				{#if node.children}
					{#each node.children as child}
						{@render renderNode(child)}
					{/each}
				{/if}
			</ol>
		{:else}
			<ul class="mb-4 ml-4 list-inside list-disc">
				{#if node.children}
					{#each node.children as child}
						{@render renderNode(child)}
					{/each}
				{/if}
			</ul>
		{/if}
	{:else if node.type === 'listitem'}
		<li class="mb-3 font-light lg:mb-6">
			{#if node.children}
				{#each node.children as child}
					{@render renderNode(child)}
				{/each}
			{/if}
		</li>
	{:else if node.type === 'quote'}
		<blockquote class="my-4 border-l-4 border-gray-300 pl-4 text-gray-700 italic">
			{#if node.children}
				{#each node.children as child}
					{@render renderNode(child)}
				{/each}
			{/if}
		</blockquote>
	{:else if node.type === 'code'}
		<code class="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
			{#if node.children}
				{#each node.children as child}
					{@render renderNode(child)}
				{/each}
			{/if}
		</code>
	{:else if node.type === 'codeblock'}
		<pre class="my-4 overflow-x-auto rounded bg-gray-100 p-4">
			<code class="font-mono text-sm">
				{#if node.children}
					{#each node.children as child}
						{@render renderNode(child)}
					{/each}
				{/if}
			</code>
		</pre>
	{:else if node.type === 'linebreak'}
		<br />
	{:else if node.children}
		<!-- Fallback for unknown node types with children -->
		{#each node.children as child}
			{@render renderNode(child)}
		{/each}
	{/if}
{/snippet}

<style>
	.subscript {
		vertical-align: sub;
		font-size: smaller;
	}

	.superscript {
		vertical-align: super;
		font-size: smaller;
	}
</style>
