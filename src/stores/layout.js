import { writable, derived } from 'svelte/store';



export const colorParameters = writable({
    mainColors: {
        color1: {hsl: [150,40,35]},
        color2: {hsl: [50,40,25]}
    },
    light: {
        color1Surface1: {saturation: 20, lightness: 10}
    },
    dark: {

        color1Surface1: {saturation: 20, lightness: 10}
    }

});



export const colors = writable({
    'palette': {'light': {
        'color1': {
            'rgb': [50,150,100]
        },
        'color2': {
            'rgb': [150,150,100]
        },
        'surface1': {
            'rgb': [150,150,100]
        },
        'surface2': {
            'rgb': [150,150,100]
        },
        'surface3': {
            'rgb': [150,150,100]
        },
        'surface4': {
            'rgb': [150,150,100]
        },
        'text1': {
            'rgb': [150,150,100]
        },
        'text2': {
            'rgb': [150,150,100]
        },
        'text3': {
            'rgb': [150,150,100]
        }
    }, 
    'dark': {
        'color1': {
            'rgb': [50,150,100],
            'hsl': [150,30,20]
        },
        'color2': {
            'rgb': [150,150,100],
            'hsl': [150,30,20]
        },
        'surface1': {
            'rgb': [150,150,100]
        },
        'surface2': {
            'rgb': [150,150,100]
        },
        'surface3': {
            'rgb': [150,150,100]
        },
        'surface4': {
            'rgb': [150,150,100]
        },
        'text1': {
            'rgb': [150,150,100]
        },
        'text2': {
            'rgb': [150,150,100]
        },
        'text3': {
            'rgb': [150,150,100]
        }
    }
},
    'light_palette': {
        'color1': {
            'rgb': [50,150,100]
        },
        'color2': {
            'rgb': [150,150,100]
        },
        'surface1': {
            'rgb': [150,150,100]
        },
        'surface2': {
            'rgb': [150,150,100]
        },
        'surface3': {
            'rgb': [150,150,100]
        },
        'surface4': {
            'rgb': [150,150,100]
        },
        'text1': {
            'rgb': [150,150,100]
        },
        'text2': {
            'rgb': [150,150,100]
        },
        'text3': {
            'rgb': [150,150,100]
        }
    },
    'dark_palette': {
        'color1': {
            'rgb': [50,150,100],
            'hsl': [150,30,20]
        },
        'color2': {
            'rgb': [150,150,100],
            'hsl': [150,30,20]
        },
        'surface1': {
            'rgb': [150,150,100]
        },
        'surface2': {
            'rgb': [150,150,100]
        },
        'surface3': {
            'rgb': [150,150,100]
        },
        'surface4': {
            'rgb': [150,150,100]
        },
        'text1': {
            'rgb': [150,150,100]
        },
        'text2': {
            'rgb': [150,150,100]
        },
        'text3': {
            'rgb': [150,150,100]
        }
    },
    'current_mode': 'light',
    'saved_color_schemes': {},
    'color_scheme_options': [],
    'chosen_color_scheme': '',
    'checked_for_color_schemes': false,
    'edited_color_scheme': null
}); 

export const color_parameters = writable({
    'main_colors': {
        'color1': {
            'hsl': [250,80,60],
            'rgb': [50,200,100],
            'hex': '#4afc03',
            'type': 'brand',
            'id': 'color1',
            'parameters': ['hsl','rgb','hex']
        },
        'color2': {
            'hsl': [150,80,60],
            'rgb': [150,50,100],
            'hex': '#4afc03',
            'type': 'accent',
            'id': 'color2',
            'parameters': ['hsl','rgb','hex']
        }
    },
    'light': {
        'text1': {'parameters': ['saturation','lightness'],
                'saturation': 20,
                'lightness': 10,
                'hue': 'color1',
                'name': 'Text Color 1',
                'id': 'text1',
                'category': 'text-light',
                'theme': 'light',
                'parameter_names': ['Saturation','Lightness']
        },
        'text2': {'parameters': ['saturation','lightness'],
                'saturation': 20,
                'lightness': 15,
                'hue': 'color1',
                'name': 'Text Color 2',
                'id': 'text2',
                'category': 'text-light',
                'theme': 'light'
        },
        'text3': {'parameters': ['saturation','lightness'],
                'saturation': 20,
                'lightness': 20,
                'hue': 'color1',
                'name': 'Text Color 3',
                'id': 'text3',
                'category': 'text-light',
                'theme': 'light'
        },
        'surface1': {'parameters': ['saturation','lightness'],
            'saturation': 20,
            'lightness': 95,
            'hue': 'color1',
            'name': 'Surface Color 1',
            'id': 'surface1',
            'category': 'surface-light',
            'theme': 'light'
            },
        'surface2': {'parameters': ['saturation','lightness'],
            'saturation': 20,
            'lightness': 85,
            'hue': 'color1',
            'name': 'Surface Color 2',
            'id': 'surface2',
            'category': 'surface-light',
            'theme': 'light'
            },
        'surface3': {'parameters': ['saturation','lightness'],
            'saturation': 20,
            'lightness': 80,
            'hue': 'color1',
            'name': 'Surface Color 3',
            'id': 'surface3',
            'category': 'surface-light',
            'theme': 'light'
            },
        'surface4': {'parameters': ['saturation','lightness'],
            'saturation': 20,
            'lightness': 80,
            'hue': 'color2',
            'name': 'Surface Color 4',
            'id': 'surface4',
            'category': 'surface-light',
            'theme': 'light'
            }
    },
    'dark': {
        'divisors': {'parameters': ['saturation_divisor','lightness_divisor'],
            'saturation_divisor': 2,
            'lightness_divisor': 2,
            'name': 'Dark Divisors',
            'id': 'divisors',
            'category': 'divisors-dark',
            'theme': 'dark'
        },
        'text1': {'parameters': ['saturation','lightness'],
            'saturation': 20,
            'lightness': 95,
            'hue': 'color1',
            'name': 'Text Color 1',
            'id': 'text1',
            'category': 'text-dark',
            'theme': 'dark'
        },
        'text2': {'parameters': ['saturation','lightness'],
                'saturation': 20,
                'lightness': 90,
                'hue': 'color1',
                'name': 'Text Color 2',
                'id': 'text2',
                'category': 'text-dark',
                'theme': 'dark'
        },
        'text3': {'parameters': ['saturation','lightness'],
                'saturation': 20,
                'lightness': 80,
                'hue': 'color1',
                'name': 'Text Color 3',
                'id': 'text3',
                'category': 'text-dark',
                'theme': 'dark'
        },
        'surface1': {'parameters': ['saturation','lightness'],
            'saturation': 20,
            'lightness': 20,
            'hue': 'color1',
            'name': 'Surface Color 1',
            'id': 'surface1',
            'category': 'surface-dark',
            'theme': 'dark'
            },
        'surface2': {'parameters': ['saturation','lightness'],
            'saturation': 20,
            'lightness': 15,
            'hue': 'color1',
            'name': 'Surface Color 2',
            'id': 'surface2',
            'category': 'surface-dark',
            'theme': 'dark'
            },
        'surface3': {'parameters': ['saturation','lightness'],
            'saturation': 20,
            'lightness': 20,
            'hue': 'color1',
            'name': 'Surface Color 3',
            'id': 'surface3',
            'category': 'surface-dark',
            'theme': 'dark'
            },
        'surface4': {'parameters': ['saturation','lightness'],
            'saturation': 20,
            'lightness': 20,
            'hue': 'color2',
            'name': 'Surface Color 4',
            'id': 'surface4',
            'category': 'surface-dark',
            'theme': 'dark'
            }
    },
    'parameter_config': {
        
        'types': ['light','dark','main_colors'],
        'categories': {
            'text-light': {
                'saturation': {
                    'min': 0,
                    'max': 50,
                    'step': 1
                    },
                'lightness': {
                    'min': 0, 
                    'max': 50,
                    'step': 1
                    }
            },
            'surface-light': {
                'saturation': {
                    'min': 0,
                    'max': 50,
                    'step': 1
                    },
                'lightness': {
                    'min': 50, 
                    'max': 100,
                    'step': 1
                    }            
            },
            'text-dark': {
                'saturation': {
                    'min': 0,
                    'max': 50,
                    'step': 1
                    },
                'lightness': {
                    'min': 50, 
                    'max': 100,
                    'step': 1
                    }            
            },
            'surface-dark': {
                'saturation': {
                    'min': 0,
                    'max': 50,
                    'step': 1
                    },
                'lightness': {
                    'min': 0, 
                    'max': 50,
                    'step': 1
                    }
            },
            'divisors-dark': {
                'saturation_divisor': {
                    'min': 0,
                    'max': 5,
                    'step': .1
                    },
                'lightness_divisor': {
                    'min': 0, 
                    'max': 5,
                    'step': .1
                    }
                },
            }
    }
});


export const color_palette = derived(
	colors,
	$colors => (($colors.current_mode == 'light') ? $colors.palette.light : $colors.palette.dark)
);


export const device = writable({
    'windowWidth': 100,
    'windowHeight': 100,
    'window_width': 100,
    'window_height': 100,
    'scroll_y': 0
    // TODO: can also add scroll y and/or scroll x, device type
});

export const color_schemes = writable({
    'saved': {
        'greenBlue': {'meta': {'name': 'greenBlue','date': null,'has_parameters': true, 'has_palette': false},
            'parameters': 
            {"light":{"text1":{"saturation":10,"lightness":12},"text2":{"saturation":16,"lightness":18},"text3":{"saturation":24,"lightness":24},"surface1":{"saturation":16,"lightness":87},"surface2":{"saturation":22,"lightness":83},"surface3":{"saturation":28,"lightness":77},"surface4":{"saturation":19,"lightness":78}},"dark":{"text1":{"saturation":8,"lightness":96},"text2":{"saturation":17,"lightness":89},"text3":{"saturation":26,"lightness":83},"surface1":{"saturation":19,"lightness":6},"surface2":{"saturation":21,"lightness":13},"surface3":{"saturation":25,"lightness":17},"surface4":{"saturation":26,"lightness":21},"divisors":{"saturation_divisor":2,"lightness_divisor":2}},"main_colors":{"color1":{"type":"brand","hsl":[121,70,48]},"color2":{"type":"accent","hsl":[238,70,41]}}}
        },
        'lightBluePurple': {'meta': {'name': 'lightBluePurple','date': null,'has_parameters': true, 'has_palette': false},
            'parameters': 
            {"light":{"text1":{"saturation":10,"lightness":12},"text2":{"saturation":16,"lightness":20},"text3":{"saturation":34,"lightness":23},"surface1":{"saturation":31,"lightness":89},"surface2":{"saturation":23,"lightness":82},"surface3":{"saturation":31,"lightness":73},"surface4":{"saturation":17,"lightness":77}},"dark":{"text1":{"saturation":8,"lightness":96},"text2":{"saturation":15,"lightness":83},"text3":{"saturation":34,"lightness":78},"surface1":{"saturation":21,"lightness":12},"surface2":{"saturation":26,"lightness":18},"surface3":{"saturation":37,"lightness":21},"surface4":{"saturation":20,"lightness":19},"divisors":{"saturation_divisor":1.6,"lightness_divisor":1.6}},"main_colors":{"color1":{"type":"brand","hsl":[173,100,60]},"color2":{"type":"accent","hsl":[305,70,41]}}}
         },
        'orangeTorquoise': 
        {'meta': {'name': 'orangeTorquoise','date': null,'has_parameters': true, 'has_palette': false},
        'parameters': 
            {"light":{"text1":{"saturation":10,"lightness":5},"text2":{"saturation":15,"lightness":12},"text3":{"saturation":34,"lightness":17},"surface1":{"saturation":29,"lightness":90},"surface2":{"saturation":32,"lightness":86},"surface3":{"saturation":35,"lightness":80},"surface4":{"saturation":28,"lightness":82}},"dark":{"text1":{"saturation":8,"lightness":95},"text2":{"saturation":15,"lightness":86},"text3":{"saturation":23,"lightness":81},"surface1":{"saturation":7,"lightness":9},"surface2":{"saturation":16,"lightness":13},"surface3":{"saturation":14,"lightness":17},"surface4":{"saturation":16,"lightness":17},"divisors":{"saturation_divisor":1,"lightness_divisor":1}},"main_colors":{"color1":{"type":"brand","hsl":[18,76,50]},"color2":{"type":"accent","hsl":[198,76,50]}}}
         },
        'limePurple': {'meta': {'name': 'limePurple','date': null,'has_parameters': true, 'has_palette': false},
        'parameters': 
            {"light":{"text1":{"saturation":10,"lightness":5},"text2":{"saturation":15,"lightness":12},"text3":{"saturation":34,"lightness":17},"surface1":{"saturation":29,"lightness":90},"surface2":{"saturation":32,"lightness":86},"surface3":{"saturation":35,"lightness":80},"surface4":{"saturation":28,"lightness":82}},"dark":{"text1":{"saturation":8,"lightness":95},"text2":{"saturation":15,"lightness":86},"text3":{"saturation":23,"lightness":81},"surface1":{"saturation":7,"lightness":9},"surface2":{"saturation":16,"lightness":13},"surface3":{"saturation":14,"lightness":17},"surface4":{"saturation":16,"lightness":17},"divisors":{"saturation_divisor":1,"lightness_divisor":1}},"main_colors":{"color1":{"type":"brand","hsl":[89,72,50]},"color2":{"type":"accent","hsl":[269,72,50]}}}
        },
    }
})