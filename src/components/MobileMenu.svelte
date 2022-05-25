<script>
	import { menuLayout } from '$lib/layoutConfig';
	let menuOpening = false;
	let menuOpen = false;
	let menuClosing = false;
	let menuFadingIn = false;
	let menuOpenTime;
	let burgerHovering;
	let endBurgerHovering;

	/** @name {mobileMenuConfig}
 * 	@type {import('../lib/types').mobileMenuConfig} 
  @start {mobileMenuConfig} */
let menuConfig = {"burgerHoverSlide":true,"burgerToXAnimation":true,"xHoverScale":true,"menuAnimation":true,"menuItemsOpacityAnimation":true,"animationSettings":{"burgerSlideOut":{"duration":0.4},"burgerSlideBack":{"duration":0.3},"burgerToX":{"duration":0.4},"burgerFade":{"duration":0.5},"xToFull":{"duration":0.1},"xHoverScale":{"duration":0.2,"scale":1.25},"menuSlideIn":{"duration":0.5},"menuSlideOut":{"duration":0.3},"menuFadeIn":{"delay":0.05,"duration":0.5,"offsetDelay":0.1}}};
/** @end {mobileMenuConfig} */

	// tranform animation settings based on config
	if (!menuConfig.menuItemsOpacityAnimation) {
		menuConfig.animationSettings.menuFadeIn = { delay: 0, duration: 0, offsetDelay: 0 };
	}
	if (!menuConfig.menuAnimation) {
		menuConfig.animationSettings.menuSlideIn.duration = 0;
		menuConfig.animationSettings.menuSlideOut.duration = 0;
	}
	if (!menuConfig.burgerToXAnimation) {
		menuConfig.animationSettings.burgerToX.duration = 0;
		menuConfig.animationSettings.xToFull.duration = 0;
		menuConfig.animationSettings.burgerFade.duration = 0;
	}
	if (!menuConfig.xHoverScale) {
		menuConfig.animationSettings.xHoverScale.scale = 1;
	}

	$: cssVarStyles = `
--burger-to-x-dur:${menuConfig.animationSettings.burgerToX.duration}s;
--burger-slide-out-dur:${menuConfig.animationSettings.burgerSlideOut.duration}s;
--burger-slide-back-dur:${menuConfig.animationSettings.burgerSlideBack.duration}s;
--burger-fade-dur:${menuConfig.animationSettings.burgerFade.duration}s;
--x-to-full-dur:${menuConfig.animationSettings.xToFull.duration}s;
--x-hover-scale-dur:${menuConfig.animationSettings.xHoverScale.duration}s;
--menu-slide-in-dur:${menuConfig.animationSettings.menuSlideIn.duration}s;
--menu-slide-out-dur:${menuConfig.animationSettings.menuSlideOut.duration}s;
--menu-fade-in-dur:${menuConfig.animationSettings.menuFadeIn.duration}s;
--x-hover-scale:${menuConfig.animationSettings.xHoverScale.scale};
`;

	const startBurgerHover = () => {
		if (menuClosing || menuOpening || !menuConfig.burgerHoverSlide) {
			return;
		}
		burgerHovering = true;
		endBurgerHovering = false;
	};
	const endBurgerHover = () => {
		if (menuClosing || menuOpening || !menuConfig.burgerHoverSlide) {
			return;
		}
		burgerHovering = false;
		endBurgerHovering = true;
	};
	const burgerClick = () => {
		if (menuOpen) {
			menuOpen = !menuOpen;
			menuOpening = false;
			menuClosing = true;
			setTimeout(
				() => (menuClosing = false),
				menuConfig.animationSettings.menuSlideOut.duration * 1000
			);

			burgerHovering = false;
			if (menuConfig.burgerHoverSlide) {
				endBurgerHovering = true;
			}
			menuFadingIn = false;
		} else if (menuOpening) {
			clearTimeout(menuOpenTime);
			menuClosing = true;
			setTimeout(
				() => (menuClosing = false),
				menuConfig.animationSettings.menuSlideOut.duration * 1000
			);
			if (menuConfig.burgerHoverSlide) {
				endBurgerHovering = true;
			}
			burgerHovering = false;
			menuOpening = false;
			menuFadingIn = false;
		} else {
			menuOpening = true;
			menuOpenTime = setTimeout(
				() => (menuOpen = true),
				menuConfig.animationSettings.burgerToX.duration * 1000
			);
			menuClosing = false;
			endBurgerHovering = false;
			burgerHovering = false;
			setTimeout(() => (menuFadingIn = true), menuConfig.animationSettings.menuFadeIn.delay * 1000);
		}
	};
</script>

<div class="ml-[.75rem] md:hidden" style={cssVarStyles}>
	<button
		class="relative z-10 flex items-center justify-center"
		aria-label="Toggle menu"
		type="button"
		on:mouseenter={startBurgerHover}
		on:mouseleave={endBurgerHover}
		on:click={burgerClick}
	>
		<svg
			class="color-1-text-2 absolute h-5 w-5"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			class:xBurgerFade={menuOpening}
			><path
				d="M1 10H19"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<svg
			class="color-1-text-2 absolute h-5 w-5"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			class:burgerAnimate={burgerHovering}
			class:endBurgerAnimate={endBurgerHovering}
			class:xBurgerAnimate1={menuOpening}
			class:xBurgerFade={menuOpen}
			><path
				d="M1 5H19"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg><svg
			class="color-1-text-2 absolute h-5 w-5"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			class:burgerAnimate={burgerHovering}
			class:endBurgerAnimate={endBurgerHovering}
			class:xBurgerAnimate2={menuOpening}
			class:xBurgerFade={menuOpen}
			><path
				d="M1 15H19"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>

	{#if menuOpening || menuClosing || menuOpen}
		<div
			id="blocker"
			class="menuBlocker absolute left-[-2rem] top-0
		min-h-screen w-screen"
			on:click={burgerClick}
			class:blockerFading={menuClosing}
		/>

		<ul
			class="menu color-1-surface-2 absolute ml-[-1rem] mt-[-1.25rem] flex w-full flex-col
			rounded-md px-4 pb-8 pt-8 text-2xl shadow-sm"
			class:menuActive={menuOpening || menuOpen}
			class:menuInactive={menuClosing}
		>
			{#each menuLayout.options as menuOption}
				<li
					class="color-1-border-1 color-1-text-2 border-b 
		px-1 font-semibold"
				>
					<a
						class="menuItems flex w-auto py-2"
						style="transition-delay: {menuOption.index *
							menuConfig.animationSettings.menuFadeIn.offsetDelay}s;"
						class:menuItemsActive={menuFadingIn}
						sveltekit:prefetch
						on:click={burgerClick}
						href={menuOption.href}>{menuOption.name}</a
					>
				</li>
			{/each}
		</ul>
		<button
			class="color-1-text-2 hover:color-1-text-1 relative z-10 flex scale-0 items-center justify-center opacity-100"
			aria-label="Toggle menu"
			type="button"
			class:xBurgerAfterAnimate={menuOpen}
			on:click={burgerClick}
		>
			<svg
				class="absolute h-5 w-5"
				viewBox="0 0 20 20"
				width="20"
				height="20"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				fill="none"
				shape-rendering="geometricPrecision"
				data-hide="true"><path d="M17.5 2.5L2.5 17.5" /><path d="M2.5 2.5l15 15" /></svg
			>
		</button>
	{/if}
</div>

<style lang="postcss">
	.xBurgerFade {
		transition: opacity var(--burger-fade-dur) ease;
		opacity: 0;
	}
	.xBurgerAnimate1 {
		animation: burger-to-x-1 var(--burger-to-x-dur) ease-in;
		transform: translateX(10%) translateY(25%) rotate(-45deg);
	}
	.xBurgerAnimate2 {
		animation: burger-to-x-2 var(--burger-to-x-dur) ease-in;
		transform: translateX(10%) translateY(-25%) rotate(45deg);
	}
	.xBurgerAfterAnimate {
		animation: burger-x-grow var(--x-to-full-dur) ease-in;
		transform: scale(1);
		opacity: 1;
	}
	.xBurgerAfterAnimate:hover {
		transition: transform var(--x-hover-scale-dur) ease;
		transform: scale(var(--x-hover-scale));
	}
	.burgerAnimate {
		animation: burger-shift var(--burger-slide-out-dur) ease-out;
		transform: translateX(30%);
	}
	.endBurgerAnimate {
		animation: burger-shift-back var(--burger-slide-back-dur) ease-out;
		transform: translateX(0%);
		/* transform: translate(-50%, -50%) scale(1); */
	}
	.menu {
		opacity: 0;
		z-index: 1;
	}
	.menuInactive {
		transform: translateX(-100%);
		opacity: 0;
		transition: opacity var(--menu-slide-out-dur) ease, transform var(--menu-slide-out-dur) ease;
	}
	.menuActive {
		transform: translateX(0%);
		opacity: 1;
		transition: opacity var(--menu-slide-in-dur) ease;
	}
	.menuBlocker {
		z-index: 1;
		background-color: hsla(0, 0%, 100%, 0.063);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}
	.blockerFading {
		transition: opacity var(--menu-slide-out-dur) ease;
		opacity: 0;
	}
	.menuItems {
		opacity: 0;
		transition: opacity var(--menu-fade-in-dur) ease;
	}
	.menuItemsActive {
		opacity: 1;
	}

	@keyframes burger-shift {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(30%);
		}
	}
	@keyframes burger-shift-back {
		0% {
			transform: translateX(30%);
		}
		100% {
			transform: translateX(0%);
		}
	}
	@keyframes menu-slide {
		0% {
			transform: translateX(-60%);
		}
		100% {
			transform: translateX(0%);
		}
	}
	@keyframes menu-slide-reverse {
		0% {
			transform: translateX(0%);
			opacity: 1;
		}
		100% {
			transform: translateX(-100%);
			opacity: 0;
		}
	}
	@keyframes burger-to-x-1 {
		0% {
			transform: translateX(30%) translateY(0%) rotate(-0deg);
		}
		100% {
			transform: translateX(10%) translateY(25%) rotate(-45deg);
		}
	}
	@keyframes burger-to-x-2 {
		0% {
			transform: translateX(30%) translateY(0%) rotate(0deg);
		}
		100% {
			transform: translateX(10%) translateY(-25%) rotate(45deg);
		}
	}
	@keyframes burger-x-grow {
		0% {
			transform: scale(0.8);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
