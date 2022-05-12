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
	import {colors, device, color_palette, color_parameters, color_schemes} from '../stores/layout.js';
	import {onColorChange, showAlert} from '../stores/functions.js';


/** @type {import('@sveltejs/kit').onMount} */
onMount(async () => {

	checkStorageForColorSchemes();

	resetGui();
	try {
		getSavedColorScheme('lightBlueOrange1');
	}
	catch {
		console.log('cannot find saved color scheme')
	}

	

});

const checkStorageForColorSchemes = () => {
	$colors.color_scheme_options.splice(0,$colors.color_scheme_options.length);
	try {
		let colorSchemes = JSON.parse(localStorage.getItem('color_schemes'));
		
		let colorSchemeOptions = Object.keys(colorSchemes);
		if (colorSchemeOptions.length>0) {
			colorSchemeOptions.forEach(thisColorScheme => {
				$color_schemes.saved[thisColorScheme] = colorSchemes[thisColorScheme];
				$colors.color_scheme_options.push({'name': thisColorScheme, 'value': thisColorScheme});
				console.log('got color schemes from local storage!');
				
			})
		}
	}
	catch (err) {
		console.log(err);
	}
	$colors.checked_for_color_schemes = true;
}

const resetGui = () => {

	$gui.items = new Gui();
	

	$gui.items.addHexColor($color_parameters.main_colors.color1,'hex').name('Brand Color').onChange(() => {
		colorParameterUpdate($color_parameters.main_colors.color1);
	});
	$gui.items.addHexColor($color_parameters.main_colors.color2,'hex').name('Accent Color').onChange(() => {
		colorParameterUpdate($color_parameters.main_colors.color2);
	});

	let themeOptions = ['light','dark'];
	let themeParamFolders = {};
	themeOptions.forEach(thisTheme => {
		let themeCapitalized = thisTheme.charAt(0).toUpperCase() + thisTheme.slice(1);
		themeParamFolders[thisTheme] = $gui.items.addFolder(themeCapitalized + ' Parameters');
		let theseParams = Object.keys($color_parameters[thisTheme]);
		theseParams.forEach(thisParam => {
		let thisParamInputs = $color_parameters[thisTheme][thisParam]['parameters'];
		let thisParamCategory = $color_parameters['parameter_config']['categories'][$color_parameters[thisTheme][thisParam]['category']]
			thisParamInputs.forEach(thisInput => {
				let thisMin = thisParamCategory[thisInput]['min'];
				let thisMax = thisParamCategory[thisInput]['max'];
				let thisStep = thisParamCategory[thisInput]['step'];
				let inputCapitalized = '';
				let numWords = 0;
				thisInput.split('_').forEach(thisWord => {
					let beforeSpace = (numWords>0) ? ' ' : ''
					inputCapitalized += beforeSpace + thisWord.charAt(0).toUpperCase() + thisWord.slice(1);
					numWords +=1;
				})
				themeParamFolders[thisTheme].add($color_parameters[thisTheme][thisParam],thisInput, thisMin, thisMax, thisStep).name($color_parameters[thisTheme][thisParam].name + ' - ' + inputCapitalized).onChange(() => {
				colorParameterUpdate($color_parameters[thisTheme][thisParam]);
				$color_parameters = $color_parameters;
				})	
			})
		});
	});

	let saveColorSchemeButton = {'saveColorScheme': function() {
		saveCurrentColorScheme($colors.color_scheme_name);
		choseOrSavedColorScheme();
	}};
	$gui.items.add($colors, 'color_scheme_name',{}).name('Color Scheme Name').type('text');
	$gui.items.add(saveColorSchemeButton, 'saveColorScheme').setId('saveColorScheme').name('Save Color Scheme') // TODO: .setActive(false);
	let showTextButton = {'showText': function() {
		$interface_state.text_modal_visible = true;
		$interface_state.text_modal_content = [];
		cssVarStyles.split(';').forEach(newLine => {
			if (newLine.length>0) {
				$interface_state.text_modal_content.push(newLine + ';');
			}

		});
		$interface_state.text_modal_content_type = 'lines';
		$interface_state.text_modal_title = 'CSS Style Variables';
	}}
	$gui.items.add(showTextButton, 'showText').name('Show Hard-Coded CSS Vars');

	showTextButton.showJSONVars =  () => {
		$interface_state.text_modal_visible = true;
	
		let newTextModalContent = {};
		let colorKeys = ['light_palette','dark_palette'];
		colorKeys.forEach(colorKey => {
			newTextModalContent[colorKey] = $colors[colorKey];
		});
		newTextModalContent = JSON.stringify(newTextModalContent);
		$interface_state.text_modal_content = [];
		let newTextModalContentLines = newTextModalContent.split(',');
		for (let i=0; i<newTextModalContentLines.length;i++) {
			let newLine = newTextModalContentLines[i];
			if ((i==0) ) {
				newLine = newLine.slice(1);
			}
			else if (i==newTextModalContentLines.length -1) {
				newLine = newLine.slice(0,-1);
			}
			if (newLine.length>0) {
				$interface_state.text_modal_content.push(newLine + ',');
			}
		}

		$interface_state.text_modal_content_type = 'lines';
		$interface_state.text_modal_title = 'JSON Style Variables';
	}
	$gui.items.add(showTextButton, 'showJSONVars').name('Show Hard-Coded JSON Vars');

	$gui.items.add($colors,'chosen_color_scheme', $colors.color_scheme_options).name('Choose Color Scheme').onChange(()=> {
		getSavedColorScheme($colors.chosen_color_scheme);
	});
	let clearLocalStorageButton = {'clearStorage': function() {
		clearLocalStorage();
	}}
	$gui.items.add(clearLocalStorageButton, 'clearStorage').name('Delete Saved Color Schemes');

};
function traverseElements(gui_element, elem_id) {
  for (let i=0;i<gui_element.elements.length;i++) {
        if (gui_element.elements[i].element_id==elem_id) {
          return gui_element.elements[i];
        }
        else if (gui_element.elements[i].elements.length>0) {
          traverseElements(gui_element.elements[i], elem_id)
        }

      }
}
const clearLocalStorage = () => {
	localStorage.setItem('color_schemes', '{}');
	resetColorSchemeOptions([]);
	console.log('cleared!');
}
const resetColorSchemeOptions = (newColorSchemes) => {
	console.log('resetting options');
	$colors.color_scheme_options.splice(0,$colors.color_scheme_options.length);
	if (newColorSchemes.length>0) {
		newColorSchemes.forEach(newColorScheme=> {
			$colors.color_scheme_options.push({'name': newColorScheme, 'value': newColorScheme})
		})
	}
	updateGui();


}
const choseOrSavedColorScheme = () => {
	console.log('chose or saved color scheme');
	$colors.edited_color_scheme = false;
	let elemId = 'saveColorScheme';
      let updateField = 'element_active';
      let updateVal = false;
      let guiToUpdate = traverseElements($gui.items, elemId);
      guiToUpdate[updateField] = updateVal;	
}

const editedColorScheme = () => {
	if (!$colors.edited_color_scheme) {
		$colors.edited_color_scheme = true;
		$colors.chosen_color_scheme = '';

		// activate save color scheme button
		let elemId = 'saveColorScheme';
      let updateField = 'element_active';
      let updateVal = true;
      let guiToUpdate = traverseElements($gui.items, elemId);
      guiToUpdate[updateField] = updateVal;
	}

}

const updateGui = () => {
	$gui.items.elements[0].name = 'GUI';
};


const refreshGuiElements = (theseElements) => {
        for (let i=0; i< theseElements.length;i++) {

                try {
                    theseElements[i].refresh();
                }
                catch (err) {
                    console.log('error resetting gui');
                    console.log(err);
                }
    
            if (theseElements[i].elements.length>0) {
                refreshGuiElements(theseElements[i].elements)
            }
        }
    }
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

const refreshGui = () => {
	// $gui.items.elements.forEach(thisElem => {
	// 	if (thisElem.element_type == 'hex-color') {
	// 		thisElem.refresh();
	// 	}
	// })
	refreshGuiElements($gui.items.elements);
	
}


const getSavedColorScheme = (savedColorScheme) => {
    let newScheme = JSON.parse(JSON.stringify($color_schemes.saved[savedColorScheme]));
	console.log(newScheme);
    newScheme['parameters']['parameter_config']['types'].forEach(parameterKey => {
		let paramInputs = Object.keys(newScheme['parameters'][parameterKey])
		paramInputs.forEach(thisInput => {
			let finalParams = Object.keys(newScheme['parameters'][parameterKey][thisInput]);
			finalParams.forEach(thisParam => {
				$color_parameters[parameterKey][thisInput][thisParam] = JSON.parse(JSON.stringify(newScheme['parameters'][parameterKey][thisInput][thisParam]));
			});
		});
    
    });
	$color_parameters['parameter_config'] = JSON.parse(JSON.stringify(newScheme['parameters']['parameter_config']));
    updateColorPalette();
	refreshGui();
	updateGui();
	choseOrSavedColorScheme();

}

const saveCurrentColorScheme = (colorSchemeName) => {

    let oldSchemes = JSON.parse(localStorage.getItem('color_schemes'));
    let oldSchemeNames = Object.keys(oldSchemes);
    if (oldSchemeNames.includes(colorSchemeName)) {
        $showAlert({'type': 'error','msg': "Cannot save color scheme, name already exists!"});
        return;
    }
    let newColorScheme = new ColorScheme({
                                    'name': colorSchemeName, 
                                    'palette': $colors.palette,
                                    'parameters': $color_parameters
                                    });
    oldSchemes[colorSchemeName] = newColorScheme;
    localStorage.setItem('color_schemes', JSON.stringify(oldSchemes));
    $color_schemes.saved[colorSchemeName] = newColorScheme;

	$colors.color_scheme_options.push({'name': colorSchemeName, 'value': colorSchemeName});

	updateGui();
    $showAlert({'type': 'success','msg': "Saved Color Scheme!"});
}



const colorParameterUpdate = (paramObj) => {
// three different types of parameter updates for main colors, divisors, and all other parameters.
	let mainColors = ['color1','color2'];
	let themeOptions =  ['light','dark'];
	if (mainColors.includes(paramObj['id'])) {
		// main color update
		// take updated rgb value, update hsl, then update all downstream colors
		mainColors.forEach(thisColor => {
			//let rgbArray = [(parseInt($color_parameters.main_colors[thisColor].rgb_norm['r']*255)),(parseInt($color_parameters.main_colors[thisColor].rgb_norm['g']*255)),(parseInt($color_parameters.main_colors[thisColor].rgb_norm['b']*255))]			
			// convert hex to rgb temp
			let rgbObj = hexTorgb($color_parameters.main_colors[thisColor].hex);
			let rgbArray = [Math.round(rgbObj.r*(255)),Math.round(rgbObj.g*(255)),Math.round(rgbObj.b*(255))];
			$color_parameters.main_colors[thisColor].rgb = rgbArray;
			// temp commented 
			// let rgbArray = $color_parameters.main_colors[thisColor].rgb;
			let hslArray = rgbToHsl(rgbArray[0],rgbArray[1], rgbArray[2]);
			$color_parameters.main_colors[thisColor].hsl = [Math.round(hslArray[0]*360),Math.round(hslArray[1]*100),Math.round(hslArray[2]*100)];
			$colors.palette.light[thisColor].hsl = [Math.round(hslArray[0]*360),Math.round(hslArray[1]*100),Math.round(hslArray[2]*100)];
			$colors.palette.dark[thisColor].hsl = [Math.round(hslArray[0]*360),Math.round((hslArray[1]*100)/$color_parameters.dark.divisors.saturation_divisor),Math.round((hslArray[2]*100)/$color_parameters.dark.divisors.lightness_divisor) ]
		})
		let colorParams = Object.keys($color_parameters.light);
		colorParams.forEach(thisParam => {
			themeOptions.forEach(thisTheme => {
				let paramObj = $color_parameters[thisTheme][thisParam];
				let thisHue = $color_parameters.main_colors[paramObj['hue']].hsl[0];
				let thisSaturation = paramObj['saturation'];
				let thisLightness = paramObj['lightness'];
				let rgbArray = hslToRgb(thisHue/360, thisSaturation/100, thisLightness/100)
				$colors.palette[paramObj.theme][paramObj['id']].rgb = rgbArray; 
			});

		});

	}
	else if (paramObj['id']!='divisors') {
		// all other parameters
		let thisHue = $color_parameters.main_colors[paramObj['hue']].hsl[0];
		let thisSaturation = paramObj['saturation'];
		let thisLightness = paramObj['lightness'];
		let rgbArray = hslToRgb(thisHue/360, thisSaturation/100, thisLightness/100)
		$colors.palette[paramObj.theme][paramObj['id']].rgb = rgbArray; 
	}
	else {
				// (dark) divisors update -> 
		let mainColors = ['color1','color2'];
		mainColors.forEach(thisColor => {
			let thisHue = $color_parameters.main_colors[thisColor].hsl[0];
			let thisSaturation = $color_parameters.main_colors[thisColor].hsl[1];
			let thisLightness = $color_parameters.main_colors[thisColor].hsl[2];

			let newSaturation = thisSaturation/paramObj['saturation_divisor'];
			let newLightness = thisLightness/paramObj['lightness_divisor'];
			let rgbArray = hslToRgb(thisHue/360, newSaturation/100, newLightness/100);

			$colors.palette[paramObj.theme][thisColor].rgb = rgbArray;

			$colors.palette[paramObj.theme][thisColor].hsl = [thisHue, newSaturation, newLightness]; 
		})

	}
	editedColorScheme();
	$onColorChange();
};

const updateColorPalette = () => {
	// color paramers -> colors.light_palette, colors.dark_palette
	let mainColors = ['color1','color2'];
	let themeOptions = ['light','dark']
		// main color update
		// take hsl of color parameter, update rgb, then update all downstream colors
	mainColors.forEach(thisColor => {

		let hslArray = JSON.parse(JSON.stringify( $color_parameters.main_colors[thisColor].hsl))
		let rgbArray = hslToRgb(hslArray[0]/360, hslArray[1]/100, hslArray[2]/100);
		$color_parameters.main_colors[thisColor].rgb = rgbArray;
		$colors.palette.light[thisColor].rgb = rgbArray;				
		$colors.palette.light[thisColor].hsl = hslArray;
		let darkHSLArray = [hslArray[0],(hslArray[1])/$color_parameters.dark.divisors.saturation_divisor,(hslArray[2])/$color_parameters.dark.divisors.lightness_divisor ]
		$colors.palette.dark[thisColor].hsl = darkHSLArray;
		let darkRGBArray = hslToRgb(darkHSLArray[0]/360, darkHSLArray[1]/100, darkHSLArray[2]/100);
		$colors.palette.dark[thisColor].rgb = darkRGBArray;
		
	});
	let colorParams = Object.keys($color_parameters.light);
	colorParams.forEach(thisParam => {
		themeOptions.forEach(thisTheme => {
			let paramObj = $color_parameters[thisTheme][thisParam];
			let thisHue = $color_parameters.main_colors[paramObj['hue']].hsl[0];
			let thisSaturation = paramObj['saturation'];
			let thisLightness = paramObj['lightness'];
			let rgbArray = hslToRgb(thisHue/360, thisSaturation/100, thisLightness/100)
			$colors.palette[paramObj.theme][paramObj['id']].rgb = rgbArray; 

		});

	});
}




$: cssVarStyles =
`--main-hue:${$color_parameters.main_colors.color1.hsl[0]};
--main-sat:${$color_parameters.main_colors.color1.hsl[1]}%;
--main-light:${$color_parameters.main_colors.color1.hsl[2]}%;
--accent-hue:${$color_parameters.main_colors.color2.hsl[0]};
--accent-sat:${$color_parameters.main_colors.color2.hsl[1]}%;
--accent-light:${$color_parameters.main_colors.color2.hsl[2]}%;

--text1-sat:${$color_parameters.light.text1.saturation}%;
--text1-light:${$color_parameters.light.text1.lightness}%;
--text2-sat:${$color_parameters.light.text2.saturation}%;
--text2-light:${$color_parameters.light.text2.lightness}%;
--text3-sat:${$color_parameters.light.text3.saturation}%;
--text3-light:${$color_parameters.light.text3.lightness}%;
--surface1-sat:${$color_parameters.light.surface1.saturation}%;
--surface1-light:${$color_parameters.light.surface1.lightness}%;
--surface2-sat:${$color_parameters.light.surface2.saturation}%;
--surface2-light:${$color_parameters.light.surface2.lightness}%;

--surface3-sat:${$color_parameters.light.surface3.saturation}%;
--surface3-light:${$color_parameters.light.surface3.lightness}%;
--surface4-sat:${$color_parameters.light.surface4.saturation}%;
--surface4-light:${$color_parameters.light.surface4.lightness}%;
--text1-sat-dark:${$color_parameters.dark.text1.saturation}%;
--text1-light-dark:${$color_parameters.dark.text1.lightness}%;
--text2-sat-dark:${$color_parameters.dark.text2.saturation}%;
--text2-light-dark:${$color_parameters.dark.text2.lightness}%;
--text3-sat-dark:${$color_parameters.dark.text3.saturation}%;
--text3-light-dark:${$color_parameters.dark.text3.lightness}%;
--surface1-sat-dark:${$color_parameters.dark.surface1.saturation}%;
--surface1-light-dark:${$color_parameters.dark.surface1.lightness}%;
--surface2-sat-dark:${$color_parameters.dark.surface2.saturation}%;
--surface2-light-dark:${$color_parameters.dark.surface2.lightness}%;
--surface3-sat-dark:${$color_parameters.dark.surface3.saturation}%;
--surface3-light-dark:${$color_parameters.dark.surface3.lightness}%;
--surface4-sat-dark:${$color_parameters.dark.surface4.saturation}%;
--surface4-light-dark:${$color_parameters.dark.surface4.lightness}%;
--dark-sat-divisor:${$color_parameters.dark.divisors.saturation_divisor};
--dark-light-divisor:${$color_parameters.dark.divisors.lightness_divisor};
--main-dark-sat:${$colors.palette.dark.color1.hsl[1]}%;
--main-dark-light:${$colors.palette.dark.color1.hsl[2]}%;
--accent-dark-sat:${$colors.palette.dark.color2.hsl[1]}%;
--accent-dark-light:${$colors.palette.dark.color2.hsl[2]}%;

--default-main-hue:${$color_parameters.main_colors.color1.hsl[0]};
--default-main-sat:${$color_parameters.main_colors.color1.hsl[1]}%;
--default-main-light:${$color_parameters.main_colors.color1.hsl[2]}%;
--default-accent-hue:${$color_parameters.main_colors.color2.hsl[0]};
--default-accent-sat:${$color_parameters.main_colors.color2.hsl[1]}%;
--default-accent-light:${$color_parameters.main_colors.color2.hsl[2]}%;
--default-surface-sat:${$color_parameters.light.surface1.saturation}%;
--default-surface-light:${$color_parameters.light.surface1.lightness}%;
--default-dark-surface-sat:${$color_parameters.dark.surface1.saturation}%;
--default-dark-surface-light:${$color_parameters.dark.surface1.lightness}%;
--default-dark-sat:${$colors.dark_palette.color1.hsl[1]}%;
--default-dark-light:${$colors.dark_palette.color1.hsl[2]}%;
--default-dark-accent-sat:${$colors.dark_palette.color2.hsl[1]}%;
--default-dark-accent-light:${$colors.dark_palette.color2.hsl[2]}%;
--default-text-sat:${$color_parameters.light.text1.saturation}%;
--default-text-light:${$color_parameters.light.text1.lightness}%;
--default-dark-text-sat:${$color_parameters.dark.text1.saturation}%;
--default-dark-text-light:${$color_parameters.dark.text1.lightness}%;`;




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