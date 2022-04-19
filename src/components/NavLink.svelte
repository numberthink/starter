<script>
	import { page } from '$app/stores';
	$: isActive = $page.url.pathname === $$props.href;
	export let href;
</script>

<a
	class="relative z-10 hidden rounded-lg p-1 text2-color hover:text1-color transition-all hover:surface2-color sm:px-3 sm:py-2 md:inline-block"
	class:font-semibold={isActive}
	{href}
	><span class="capsize "><slot /> </span>
</a>
