<script context="module">
	import {footerLayout} from '../lib/layoutConfig.js';
</script>

<script>
	import { onMount} from 'svelte';
	import '../tailwind.css';
	import Nav from '../components/Nav.svelte';



onMount(async () => {


});

/** @type {Date} */
let newDate;






</script>


<div id="mainContentWrapper" class="color-1-surface-1">
<div id="topFold" class="relative color-1-surface-1 min-h-screen min-w-full">

<div class=" z-10 flex flex-col justify-center px-4 sm:px-8">
	<Nav />
</div>


<main class="color-1-surface-1">
		<slot />
</main>



</div>
<div id="footerWrapper" class="relative min-w-full color-1-surface-1 mt-12">
<footer class="relative z-10 max-w-2xl flex flex-col items-center justify-center mx-auto">
	<hr class="border-1 mb-8 w-full color-1-border-1" />
	<div class="grid w-full grid-cols-1 gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-8 text-center">
		{#each footerLayout.columns as footerColumn}
		<div class="flex flex-col space-y-4">
			{#each footerColumn as footerRow}
			{#if footerRow.type == 'route'}
			<a class="color-1-text-2 hover:color-1-text-1" href={footerRow.href}>{footerRow.name}</a>
			{:else if footerRow.type == 'link'}
			<a
			class="color-1-text-2 hover:color-1-text-1"
			target="_blank"
			rel="noopener noreferrer"
			href={footerRow.href}>{footerRow.name}</a>
			{/if}
			{/each}
		</div>
		{/each}

	</div>
</footer>
</div>
</div>

