<script context="module">
	import { footerLayout } from '../lib/layoutConfig.js';
</script>

<script>
	import { onMount } from 'svelte';
	import '../tailwind.css';
	import Nav from '../components/Nav.svelte';
	import ThreeScene from '../components/ThreeScene.svelte';

	onMount(async () => {});

	/** @type {Date} */
	let newDate;
</script>


<div id="mainContentWrapper" class="bg-opacity-100 color-1-surface-1">
	<div id="topFold" class="color-1-surface-1 relative min-h-screen min-w-full">
		<div class="flex flex-col justify-center px-4 sm:px-8">
			<Nav />
		</div>

		<main class="relative z-10">
			<slot />
		</main>
	<canvas class="webgl fixed inset-0 h-0 w-0"></canvas>
	</div>
	<div id="footerWrapper" class="bg-opacity-80 color-1-surface-1 relative mt-12 min-w-full">
		<footer class="relative mx-auto flex max-w-2xl flex-col items-center justify-center">
			<hr class=" my-0 border-1 color-1-border-1 mb-8 w-full" />
			<div class="grid w-full grid-cols-1 gap-4 px-4 pb-16 text-center sm:grid-cols-2 sm:px-8">
				{#each footerLayout.columns as footerColumn}
					<div class="flex flex-col space-y-4">
						{#each footerColumn as footerRow}
							{#if footerRow.type == 'route'}
								<a class="color-1-text-2 hover:color-1-text-1" href={footerRow.href}
									>{footerRow.name}</a
								>
							{:else if footerRow.type == 'link'}
								<a
									class="color-1-text-2 hover:color-1-text-1"
									target="_blank"
									rel="noopener noreferrer"
									href={footerRow.href}>{footerRow.name}</a
								>
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		</footer>
	</div>
</div>
<ThreeScene/>
