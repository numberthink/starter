<script>
	export let status;
	export let error;

	const offline = typeof navigator !== 'undefined' && navigator.onLine === false;

	let message = offline ? 'Find the internet and try again' : error?.message;

	let title = offline ? 'Offline' : status;
	if (status === 404) {
		title = 'Page not found :(';
		message = 'Sorry! If you think this is an error, please let me know!';
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
