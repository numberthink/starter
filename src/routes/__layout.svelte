<script context="module">
	import { REPO_URL, SITE_TITLE } from '$lib/siteConfig';
	import {footerLayout} from '$lib/layoutConfig';
</script>

<script>
	import { onMount, onDestroy} from 'svelte';
	import '../tailwind.css';
	import Nav from '../components/Nav.svelte';

	import ThreeScene from '../components/ThreeScene.svelte';
	import {ColorScheme} from '../lib/utilities/Colors.js';
	import {Gui} from '../lib/utilities/Gui.js';
	import { viz_state, gui, interface_state} from '../stores/env.js';
	import {colors, device, color_palette, colorParameters, color_schemes} from '../stores/layout.js';
	import {onColorChange, showAlert} from '../stores/functions.js';


/** @type {import('@sveltejs/kit').onMount} */
onMount(async () => {

	updateColorPalette();


});

const initGui = () => {
	$gui.items = new Gui();
	

	$gui.items.addHexColor($colorParameters.mainColors.color1,'hex').name('Brand Color').onChange(() => {
		updateColorParameter({color: 'color1', category: 'main', index: 0});
	});
	$gui.items.addHexColor($colorParameters.mainColors.color2,'hex').name('Accent Color').onChange(() => {
		updateColorParameter({color: 'color2', category: 'main', index: 1});
	});	

	let mainColors = $colorParameters.config.colors.main;
	let themeOptions = $colorParameters.config.themes.options;
	themeOptions.forEach(thisTheme => {
		let themeCapitalized = thisTheme.charAt(0).toUpperCase() + thisTheme.slice(1);
		$gui.folders[thisTheme] = $gui.items.addFolder(themeCapitalized + ' Parameters');
		let theseCategories = Object.keys($colorParameters.config.colors.variantCategories);
		
		theseCategories.forEach(thisCategory=> {
			mainColors.forEach(thisMainColor => {
				for (let i=0;i< $colorParameters.config.colors[thisMainColor].variants[thisCategory];i++) {
					let theseParams = $colorParameters.config.themes[thisTheme].parameters;
					theseParams.forEach(thisParam => {
						let thisMin = $colorParameters.config.themes[thisTheme][thisParam]['min'];
						let thisMax = $colorParameters.config.themes[thisTheme][thisParam]['max'];
						let thisStep = $colorParameters.config.themes[thisTheme][thisParam]['step'];

						// add to gui
						$gui.folders[thisTheme].add($colorParameters.themes[thisTheme][thisMainColor][thisCategory + String(i+1)],thisParam, thisMin, thisMax, thisStep).name(thisCategory + String(i) + ' - ' + thisParam).onChange(() => {
							updateColorParameter({theme: thisTheme, color: thisMainColor, category: thisCategory, index: i});
							$colorParameters = $colorParameters;
						})	
					})
				}
			});
			
		})
		// add other params if applicable
		if ($colorParameters.config.themes[thisTheme].config.otherParams.length>0) {
			let otherParams = colorParams.config.themes[thisTheme].config.otherParams;
			otherParams.forEach(thisOtherParam => {
				let subParams = colorParams.config.themes[thisTheme].categories[thisOtherParam].parameters;
				subParams.forEach(thisSubParam => {
					let thisMin = colorParams.config.themes[thisTheme].categories[thisOtherParam][thisSubParam]['min'];
					let thisMax = colorParams.config.themes[thisTheme].categories[thisOtherParam][thisSubParam]['max'];
					let thisStep = colorParams.config.themes[thisTheme].categories[thisOtherParam][thisSubParam]['step'];
					$gui.folders[thisTheme].add($colorParameters.themes[thisTheme].parameters[thisOtherParam],thisSubParam, thisMin, thisMax, thisStep).name(thisSubParam + ' - ' + thisOtherParam).onChange(() => {
							updateColorParameter({theme: thisTheme, category: thisOtherParam});
							$colorParameters = $colorParameters;
						})	
				})
				
			})
        
    }
	});
}




const refreshGui = () => {

	refreshGuiElements($gui.items.elements);
	
}




const updateColorParameter = (paramObj) => {
	// {theme: thisTheme, color: thisMainColor, category: thisCategory, index: i}
	// 3 types: main colors, derived color parameters, and other parameters (e.g. dark divisors)

	let variantCategories = $colorParameters.config.colors.variantCategories

	if (paramObj.category=='main') {
		updateMainColorParameter(paramObj);
	}
	else if (variantCategories.includes(paramObj.category)) {
		updateDerivedColorParameter(paramObj);
	}
	else {
		updateOtherColorParameter(paramObj);
	}
}

const updateMainColorParameter = (paramObj) => {
	
	let themeOptions = $colorParameters.config.themes.options;
	let thisMainColor = 'color' + String(paramObj.index+1);
	let mainHue = $colorParameters.mainColors[thisMainColor].hsl[0];
	let mainSat = $colorParameters.mainColors[thisMainColor].hsl[1];
	let mainLight = $colorParameters.mainColors[thisMainColor].hsl[2];
	themeOptions.forEach(thisTheme=> {
		if ($colorParameters.config.themes[thisTheme].config.otherParams.length>0) {
			// need to do calculation to 'derive' main colors for this theme (e.g. divide by dark divisors)
			// then update actual colors
			let thisOtherParam = $colorParameters.config.themes[thisTheme].config.otherParams[0];
			let newSat = mainSat/$colorParameters[thisTheme].parameters[thisOtherParam]['saturation'];
			let newLight =mainLight/$colorParameters[thisTheme].parameters[thisOtherParam]['lightness'];
			$colorParameters[thisTheme][thisMainColor].hsl = [mainHue, newSat, newLight];
			$colors.themes[thisTheme][thisMainColor].hsl = [mainHue, newSat, newLight];
			$colorParameters[thisTheme][thisMainColor].derived.forEach(thisDerivedColor => {
				$colorParameters[thisTheme][thisMainColor][thisDerivedColor].hsl[0] = mainHue;
				$colors.themes[thisTheme][thisMainColor][thisDerivedColor].hsl[0] = mainHue;
			})
		}
		else {
			// just update color parameters and colors, main and derived
			$colorParameters[thisTheme][thisMainColor].hsl = [mainHue, mainSat, mainLight];
			$colors.themes[thisTheme][thisMainColor].hsl = [mainHue, mainSat, mainLight];
			$colorParameters[thisTheme][thisMainColor].derived.forEach(thisDerivedColor => {
				$colorParameters[thisTheme][thisMainColor][thisDerivedColor].hsl[0] = mainHue;
				$colors.themes[thisTheme][thisMainColor][thisDerivedColor].hsl[0] = mainHue;
			})
		}
	})

}
const updateDerivedColorParameter = (paramObj) => {
	// {theme: thisTheme, color: thisMainColor, category: thisCategory, index: i}
	let thisColorName = paramObj.category + String(index+1);
	let newSat = $colorParameters[paramObj.theme][paramObj.color][thisColorName]['saturation'];
	let newLight = $colorParameters[paramObj.theme][paramObj.color][thisColorName]['lightness'];
	$colorParameters[paramObj.theme][paramObj.color][thisColorName].hsl[1] = newSat;
	$colorParameters[paramObj.theme][paramObj.color][thisColorName].hsl[2] = newLight;

	$colors.themes[paramObj.theme][paramObj.color][thisColorName].hsl[1] = newSat;
	$colors.themes[paramObj.theme][paramObj.color][thisColorName].hsl[2] = newLight;
}
const updateOtherColorParameter = (paramObj) => {
	let thisTheme = paramObj.theme;
	let thisCategory = paramObj.category;
	let mainColors = $colorParameters.config.colors.main;
	mainColors.forEach(thisMainColor => {
		let mainHue = $colorParameters.mainColors[thisMainColor].hsl[0];
		let mainSat = $colorParameters.mainColors[thisMainColor].hsl[1];
		let mainLight = $colorParameters.mainColors[thisMainColor].hsl[2];
		let newSat = mainSat/$colorParameters[thisTheme].parameters[thisCategory]['saturation'];
		let newLight =mainLight/$colorParameters[thisTheme].parameters[thisCategory]['lightness'];
		$colorParameters[thisTheme][thisMainColor].hsl = [mainHue, newSat, newLight];
			$colors.themes[thisTheme][thisMainColor].hsl = [mainHue, newSat, newLight];
			$colorParameters[thisTheme][thisMainColor].derived.forEach(thisDerivedColor => {
				$colorParameters[thisTheme][thisMainColor][thisDerivedColor].hsl[0] = mainHue;
				$colors.themes[thisTheme][thisMainColor][thisDerivedColor].hsl[0] = mainHue;
			})		
	})
}

// updates all colors so they are in sync with color parameters.
const updateColorPalette = () => {
	// color paramers -> colors.light_palette, colors.dark_palette
	let mainColors = $colorParameters.config.colors.main;
	let themeOptions = $colorParameters.config.themes.options;
	let variantCategories = $colorParameters.config.colors.variantCategories;
		// main color update
		// take hsl of color parameter, update rgb, then update all downstream colors
	mainColors.forEach(thisColor => {
		// update main colors
		let hslArray = JSON.parse(JSON.stringify( $colorParameters.mainColors[thisColor].hsl));
		$colors.themes.light[thisColor].hsl = hslArray;				
		let darkHSLArray = [hslArray[0],(hslArray[1])/$colorParameters.themes.dark.categories.divisors.saturation,(hslArray[2])/$colorParameters.themes.dark.categories.divisors.lightness]
		$colors.themes.dark[thisColor].hsl = darkHSLArray;

		themeOptions.forEach(thisTheme => {
			variantCategories.forEach(thisCategory => {
				for (let i=0;i< $colorParameters.config.colors[thisColor].variants[thisCategory];i++) {
					let thisParamName = thisCategory+ String(i+1);
					let thisHue = $colorParameters.mainColors[thisColor].hsl[0];
					let thisSaturation = $colorParameters.mainColors[thisColor][thisParamName].saturation;
					let thisLightness = $colorParameters.mainColors[thisColor][thisParamName].lightness;
					let hslArray = [thisHue/360, thisSaturation/100, thisLightness/100];
					$colors.themes.thisTheme[thisColor][thisParamName].hsl = hslArray; 
				}


			});

		});
		
	});

	
}



// codemetatag block cssVarStyles start
$: cssVarStyles =
`
--main-hue:${$colorParameters.main_colors.color1.hsl[0]};
--main-sat:${$colorParameters.main_colors.color1.hsl[1]}%;
--main-light:${$colorParameters.main_colors.color1.hsl[2]}%;
`;

// codemetatag block cssVarStyles end

// color functions

const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

const rgbToHsl = (r, g, b) => {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
const hexTorgb = (hex) => {
    var rgbLs = ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
    return {'r': Math.round(rgbLs[0]/.255)/1000, 'g': Math.round(rgbLs[1]/.255)/1000, 'b': Math.round(rgbLs[2]/.255)/1000};
}

const hslToRgb = (h, s, l) => {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
</script>
<style>
	.navShape {
		position: absolute;
		top: 0;
		height: 10rem;
		width: 100%
	}
	.mainShape {
		position: absolute;
		top: 10rem;
		width: 100%;
	}
</style>

<div id="mainContentWrapper" style="{cssVarStyles}" >
<div id="topFold" class="relative surface1-color min-h-screen min-w-full">

<div class=" z-10 flex flex-col justify-center px-4 sm:px-8">
	<Nav />
</div>


<main class="surface1-color">
		<slot />

		<div id="madeWithLove" class="my-0">
			<p class="text3-color text-center py-6 text-base font-semibold tracking-tight">
				Made with &#10084;&#65039; in Philly </p> 

		</div>
</main>
<ThreeScene/>
<canvas class="webgl fixed inset-0 z-0 h-0 w-0"></canvas>

<!-- end of top fold -->
</div>
<div id="footerWrapper" class="relative -my-2 min-w-full surface1-color">
<footer class="relative z-10 max-w-2xl flex flex-col items-center justify-center mx-auto">
	<hr class="border-1 mb-8 w-full border-color-1" />
	<div class="grid w-full grid-cols-1 gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-8 text-center">
		{#each footerLayout.columns as footerColumn}
		<div class="flex flex-col space-y-4">
			{#each footerColumn as footerRow}
			{#if footerRow.type == 'route'}
			<a class="text2-color transition hover:text1-color" href={footerRow.href}>{footerRow.name}</a>
			{:else if footerRow.type == 'link'}
			<a
			class="text2-color transition hover:text1-color"
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

