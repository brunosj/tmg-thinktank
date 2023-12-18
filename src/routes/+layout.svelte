<script>
	import '../app.css';
	import '$styles/carousel.css';
	import { fly, fade } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	// import { PreviewBanner } from 'sveltekit-preview-mode';
	import Footer from '$components/Layout/Footer.svelte';
	import SEO from '$components/SEO/SEO.svelte';
	import Header from '$components/Layout/Header.svelte';

	export let data;
	$: pathname = data.pathname;

	const duration = 100;
	const delay = duration + 100;
	const y = 0;

	const transitionIn = { easing: cubicOut, y: +200, duration, delay };
	const transitionOut = { easing: cubicIn, y: -200, duration, delay };

	function scrollToTop() {
		window.scrollTo({ top: 0 });
	}
</script>

<!-- <PreviewBanner /> -->
<SEO />
<Header />
{#key pathname}
	<main in:fade={{ easing: cubicOut, duration: 400, delay: 200 }}>
		<slot />
		<Footer />
	</main>
{/key}
