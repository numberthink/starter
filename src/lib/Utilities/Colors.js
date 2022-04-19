
export const getColorFromPalette = (color_name, color_palette) => {
    if (color_name=='surface1') {
        let thisHue = color_palette.main.hsl[0];
        let thisSat = color_palette.dark_params.surface1_sat;
        let thisLight = color_palette.dark_params.surface1_light;

        let thisRGBArray = hslToRgb(thisHue/360, thisSat/100, thisLight/100);

        return thisRGBArray;

    }
    else {
        let thisHue = color_palette.accent.hsl[0];
        let thisSat = color_palette.dark_params.surface4_sat;
        let thisLight = color_palette.dark_params.surface4_light;

        let thisRGBArray = hslToRgb(thisHue/360, thisSat/100, thisLight/100);

        return thisRGBArray;    
    }
}

export class ColorScheme {
    constructor(colorSchemeObj) {
        this.meta = {
            'name': colorSchemeObj.name, 
            'date': new Date().toLocaleDateString(),
            'has_palette': Object.keys(colorSchemeObj).includes('palette') ? true : false,
            'has_parameters': Object.keys(colorSchemeObj).includes('parameters') ? true : false
        };
        this.parameters = colorSchemeObj.parameters;
        this.palette = colorSchemeObj.palette;
    }
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
