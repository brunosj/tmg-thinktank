<script lang="ts">
	import type { LayoutProps } from './$types';

	import '../app.css';

	import { fly, fade } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import Footer from '$components/Layout/Footer.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	import Header from '$components/Layout/Header.svelte';

	let { data, children }: LayoutProps = $props();

	let pathname = $derived(data.pathname);

	const duration = 100;
	const delay = duration + 100;
	const y = 0;

	const transitionIn = { easing: cubicOut, y: +200, duration, delay };
	const transitionOut = { easing: cubicIn, y: -200, duration, delay };

	function scrollToTop() {
		window.scrollTo({ top: 0 });
	}
</script>

<SEO />

<Header programmes={data.programmes} />
{#key pathname}
	<main in:fade={{ easing: cubicOut, duration: 400, delay: 200 }}>
		{@render children?.()}
		<Footer programmes={data.programmes} />
	</main>
{/key}
