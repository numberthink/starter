
/**
 * @codemetatag {doc-scheme-1}
 * @meta {type: class, name: 'guiClass', scope: global}
 * @entity {gui}
 */
export class Gui {
    constructor(newObj={}, objVal = null,minOrSelectObjs=0,max=1,step=.01) {
        this.elements = [];
        this.element_name = ((objVal) ? ('gui') : newObj);
        this.element_type = ((objVal) ? (((typeof (minOrSelectObjs) == 'object')) ? 'multi-select' : 'slider') : 'folder');
        this.min = ((typeof (minOrSelectObjs) == 'object') ? 0 : minOrSelectObjs);
        this.max = max;
        this.step = step;
        this.obj = newObj;
        this.val = objVal;
        this.hex_color = null;
        this.show_options = false;
        this.show_children = false;
        this.show_controls = true;
        this.show_self = true;
        this.checked = false;
        this.element_id = this.element_name;
        this.element_active = true;
        this.element_context = 'main';
        this.never_save = null;
        this.value = ((objVal) ? (newObj[objVal]) : null);
        this.default_value = ((objVal && !(objVal.length>0)) ? (JSON.parse(JSON.stringify(newObj[objVal]))) : null);
        this.global_default = this.default_value;
        this.onChangeFunction = function() {};
        this.update = function(newVal) {
            this.obj[this.val] = newVal;
            this.value = newVal;
            this.onChangeFunction();
        };
        this.reset = () => {

            this.obj[this.val] = this.default_value;
            this.value = JSON.parse(JSON.stringify(this.default_value));
            this.onChangeFunction();
            
        };
        this.refresh = () => {
            this.value = this.obj[this.val];
        };
         
        if (typeof (minOrSelectObjs) == 'object') {
            if (minOrSelectObjs.length>0) {
                this.options = minOrSelectObjs;
            }
            else {
                let ls = [];
                Object.keys(minOrSelectObjs).forEach(element => ls.push({name: element, value: minOrSelectObjs[element]}));
                this.options = ls;
            }

        }
        

        this.orig_options = minOrSelectObjs;
        this.add = function(newObj={}, objVal = null,minOrSelectObjs=0,max=1,step=.01) {
            var thisObj = new Gui(newObj,objVal,minOrSelectObjs,max,step);
            if (['function','undefined'].includes(typeof(newObj[objVal]))) {
                thisObj.update = function() {this.obj[this.val]()};
                thisObj.element_type = 'button';
            } 
            this.elements.push(thisObj);
            return thisObj;
        };
        this.name = function(name) {
            this.element_name = name;
            return this;
        };
        this.onChange = function(newFunction) {
            this.onChangeFunction = newFunction;
            return this;
        };
        this.type = function(newType) {
            this.element_type = newType;
            if (newType == 'palette') {
                let ls = [];
                if (this.val.length>0) {
                    this.val.forEach(element => ls.push({'name': element, 'value': this.obj[element].real_value }) )
                }
                else {
                    Object.keys(this.obj[this.val]).forEach(element => ls.push({'name': element, 'value': this.obj[this.val][element] }));
                }

                ls.forEach(option => {
                    let hex_color = rgb2hex('rgb(' + String(parseInt(option.value['r']*255)) +',' + String(parseInt(option.value['g']*255)) + ','+ String(parseInt(option.value['b']*255)) +')');
                    option.hex_color = hex_color;
                    option.default_hex_color = hex_color;
                    option.default_rgb = {'r': option.value['r'], 'g': option.value['g'], 'b': option.value['b']};
                });
                this.options = ls;
                this.update = function(newOption) {
                    let newRGB = convertColor(newOption.hex_color);
                    this.obj[newOption.name].real_value = newRGB;
                    this.onChangeFunction();
                };
                this.reset = () => {
                    this.options.forEach(thisOption => {
                        this.obj[thisOption.name].real_value = thisOption.default_rgb;
                        this.obj[thisOption.name].hex_color = thisOption.default_hex_color;
                        thisOption.hex_color = thisOption.default_hex_color;
                        
                        
                    });
                    this.onChangeFunction();
                };
            }
            return this;
        };
        this.addColor = function(newObj={}, objVal = null) {
            let thisObj = new Gui(newObj,objVal).type('color');
            let rgb = newObj[objVal];
            let hex_color = rgb2hex('rgb(' + String(parseInt(rgb[0])) +',' + String(parseInt(rgb[1])) + ','+ String(parseInt(rgb[2])) +')');
            thisObj.hex_color = newObj.hex;
            thisObj.default_hex_color = hex_color;
            thisObj.default_rgb = JSON.parse(JSON.stringify(rgb));
        
            thisObj.reset = () => {
                thisObj.obj[thisObj.val] = thisObj.default_rgb;
                thisObj.hex_color = thisObj.default_hex_color;
                thisObj.onChangeFuction();
            }
            this.elements.push(thisObj);
            return thisObj;
        };
        this.addHexColor = function(newObj={}, objVal = null) {
            let thisObj = new Gui(newObj,objVal).type('hex-color');
            let hex_color = newObj[objVal];
            thisObj.default_hex_color = hex_color;
            thisObj.value = newObj[objVal];
            this.update = (newColor) => {
                this.onChangeFunction();
            };
            thisObj.reset = () => {
                thisObj.obj[thisObj.val] = thisObj.default_hex_color;
                thisObj.onChangeFuction();
            };
            thisObj.refresh = () => {
                thisObj.value = thisObj.obj[thisObj.val];
            }
            this.elements.push(thisObj);
            return thisObj;
        };
        this.addFolder = function(newObj={}, objVal = null) {
            var thisObj = new Gui(newObj,objVal);
            this.elements.push(thisObj);
            return thisObj;
        };
        this.context = function(context) {
            this.element_context = context;
            return this;
        };
        this.once = function() {
            this.onChangeFunction = () => {this.show_self = false};
            return this;
        };
        this.setId = (new_id) => {
            this.element_id = new_id;
            return this;
        };
        this.setActive = (new_active=true) => {
            this.element_active = new_active;
            return this;
        };
        this.showSelf = (show_self=true) => {
            this.show_self = show_self;
            return this;
        };
        this.neverSave = (never_save=true) => {
            this.never_save = never_save;
            return this;
        };

    };
};
export const hexTorgb = (hex) => {
    var rgbLs = ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
    return {'r': Math.round(rgbLs[0]/.255)/1000, 'g': Math.round(rgbLs[1]/.255)/1000, 'b': Math.round(rgbLs[2]/.255)/1000};
}
export const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

export const convertColor = (hex) => {
    return hexTorgb(hex);
}

export const toggleElement = (state) => {
    return !state;
}