<!-- ScrollObserver.svelte -->
<script>
	import { onDestroy } from 'svelte';

	let observers = new Map();

	// Function to create an observer for a specific section
	function createObserver(id, callback) {
		if (!observers.has(id)) {
			const observer = new IntersectionObserver((entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						callback(id, true);
					} else {
						callback(id, false);
					}
				}
			});
			observers.set(id, observer);
		}
	}

	// Function to attach an observer to a specific element
	function observe(id, element) {
		if (observers.has(id)) {
			observers.get(id).observe(element);
		}
	}

	onDestroy(() => {
		for (const observer of observers.values()) {
			observer.disconnect();
		}
	});
</script>
