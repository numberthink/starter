<script>
	import { page } from '$app/stores';
	$: isActive = $page.url.pathname === $$props.href;
	export let href;
</script>

<a
	class="relative z-10 hidden rounded-lg p-1 color-1-text-2 hover:color-1-text-1
	hover:color-1-surface-2 sm:px-3 sm:py-2 md:inline-block md:text-lg"
	class:font-semibold={isActive}
	{href}
	><span class="capsize "><slot /> </span>
</a>
