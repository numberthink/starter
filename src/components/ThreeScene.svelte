<script>

	import { onMount, onDestroy} from 'svelte';
	import {interface_state, viz_state, gui} from '../stores/env.js';
	import {colors, device, color_palette} from '../stores/layout.js';
	import {onColorChange} from '../stores/functions.js';
    import {getColorFromPalette} from '../lib/Utilities/Colors.js';

    let scene, camera, canvas, THREE, renderer, delta_time,clock,window_size;
    let gradient_mesh, scene_attrs, gradient_camera, grad_attrs;
    let simpleBox1, simplePlane1, light1, light2, raycaster, pointer;

    let scene_animation = {};

    let meta_scene = {
        scenes: [{'name': 'bg_gradient',
            'render_targets': {
                'write_buffer': null,
                'read_buffer': null
            }}]
    }

onMount(async () => {

	getWindowSize();

	addEventListeners();

    runThreeScene();

});



const runThreeScene = async () => {
    THREE = await import('three');
    clock = new THREE.Clock();
    clock.start();  
    window_size = {'width': $device.window_width, 'height': $device.window_height};
    canvas = document.querySelector('canvas.webgl');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
        });

    camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, -100, 100 );

    scene = new THREE.Scene();

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    pointer.x = -100;
    pointer.y = -100;

    initThreeScene();
    runThreeGradient();
    runThreeBox();
    tick();

}

const initThreeScene = async () => {

    
    scene_attrs = {};
    scene_attrs.bg_color = {};
    scene_attrs.bg_color.choice = 'surface1';
    scene_attrs.bg_color.value =  {'r': $color_palette[scene_attrs.bg_color.choice].rgb[0]/255, 'g': $color_palette[scene_attrs.bg_color.choice].rgb[1]/255, 'b': $color_palette[scene_attrs.bg_color.choice].rgb[2]/255};
    let bgColor = new THREE.Color(scene_attrs.bg_color.value.r,scene_attrs.bg_color.value.g,scene_attrs.bg_color.value.b);
    renderer.setClearColor( bgColor, 1) 
    renderer.setSize(window_size.width, window_size.height);
    renderer.render(scene, camera);

    scene_animation.state = {};
    let scrollY = window.pageYOffset;
    scene_animation.state.last_scroll_y = scrollY;
    scene_animation.state.current_scroll_y = scrollY;
    scene_animation.state.scrolling = false;
    scene_animation.state.needs_window_size_update = false;

    window.addEventListener( 'pointermove', onMouseMove );

}

const tick = () => {
	
	if (!$viz_state.freeze) {

		delta_time = clock.getElapsedTime();

        updateAnimation();

        updateGradient();

        updateBox();
        
		renderScene();

	}



	window.requestAnimationFrame(tick);

}

const renderScene = () => {

    if (scene_animation.state.needs_window_size_update) {
        renderer.setSize($device.window_width, $device.window_height);
        camera.aspect = $device.window_width/$device.window_height;
        camera.updateProjectionMatrix();
        const renderSize = renderer.getSize( new THREE.Vector2() );
        const pixelRatio = renderer.getPixelRatio();
        meta_scene.scenes[0].render_targets.write_buffer.setSize(renderSize.width * pixelRatio, renderSize.height * pixelRatio)
        meta_scene.scenes[0].render_targets.read_buffer.setSize(renderSize.width * pixelRatio, renderSize.height * pixelRatio);

        scene_animation.state.needs_window_size_update = false;
    }

    
    
    // loop thru 'offscreen' scenes, render to respective targets
    // then set render target as null, render 'main' scene.
    renderer.setRenderTarget(meta_scene.scenes[0].render_targets.write_buffer);
    renderer.render(gradient_mesh, gradient_camera);
    scene.background = meta_scene.scenes[0].render_targets.read_buffer.texture;
    renderer.setClearColor( 0xfffff, 0); 
    renderer.setRenderTarget(null);



    renderer.render(scene, camera);

    
    meta_scene.scenes[0].render_targets.read_buffer = meta_scene.scenes[0].render_targets.write_buffer;
}

const onColorChangeBg = () => {

    scene_attrs.bg_color.value =  {'r': $color_palette[scene_attrs.bg_color.choice].rgb[0]/255, 'g': $color_palette[scene_attrs.bg_color.choice].rgb[1]/255, 'b': $color_palette[scene_attrs.bg_color.choice].rgb[2]/255};
    let bgColor = new THREE.Color(scene_attrs.bg_color.value.r,scene_attrs.bg_color.value.g,scene_attrs.bg_color.value.b);
    renderer.setClearColor( bgColor, 1);   
}

const updateAnimation = () => {
    let scrollY = window.pageYOffset;
    if ((!scene_animation.state.scrolling) && (scene_animation.state.current_scroll_y!=scrollY)) {
        scene_animation.state.scrolling = true;
        scene_animation.state.last_scroll_y = JSON.parse(JSON.stringify(scene_animation.state.current_scroll_y));
        scene_animation.state.current_scroll_y = scrollY;

    }
    else if ((scene_animation.state.scrolling) && (scene_animation.state.current_scroll_y==scrollY)) {
        scene_animation.state.scrolling = false;
    }
    else if ((scene_animation.state.current_scroll_y!=scrollY)) {
        scene_animation.state.current_scroll_y = scrollY;
    }

}

const updateBox = () => {
    	let rotSpeed = .2*Math.PI*2;
        let yRot, xRot, zRot;
        if (scene_animation?.state?.scrolling) {

            let scrollDiff = scene_animation.state.current_scroll_y - scene_animation.state.last_scroll_y;

            yRot = scene_animation.box.y_rot.state.last_val + scrollDiff*.02;
            scene_animation.box.y_rot.state.current_val = yRot;
            scene_animation.box.y_rot.state.current_delta = delta_time;

            if (scene_animation.box.z_rot.state.last_val!=scene_animation.box.z_rot.state.current_val) {
                scene_animation.box.z_rot.state.last_val = scene_animation.box.z_rot.state.current_val;
                scene_animation.box.x_rot.state.last_val = scene_animation.box.x_rot.state.current_val;
            }
            zRot = scene_animation.box.z_rot.state.current_val;
            xRot = scene_animation.box.x_rot.state.current_val;

        }
        else {
            yRot = scene_animation.box.y_rot.state.current_val + (delta_time-scene_animation.box.y_rot.state.current_delta)*rotSpeed;
            scene_animation.box.y_rot.state.last_val = yRot;

            xRot = scene_animation.box.x_rot.state.last_val + (delta_time-scene_animation.box.y_rot.state.current_delta)*rotSpeed;
            scene_animation.box.x_rot.state.current_val = xRot;

            zRot = scene_animation.box.z_rot.state.last_val + (delta_time-scene_animation.box.y_rot.state.current_delta)*rotSpeed;
            scene_animation.box.z_rot.state.current_val = zRot;

        }
		// let xRot = delta_time*rotSpeed;
		// let yRot = delta_time*(rotSpeed*.75)
		// let zRot = delta_time*(rotSpeed*.75);

		simpleBox1.rotation.set(yRot, xRot, zRot);

        raycaster.setFromCamera( pointer, camera );

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObject( simpleBox1 );
        // {tranning_in: false, tranning_out: false, last_tran_delta: 0, active: false}
        if (intersects.length>0) {
            if (!scene_animation.box.scale.state.active) {
                scene_animation.box.scale.state.active = true;
                scene_animation.box.scale.state.tranning_in = true;
                scene_animation.box.scale.state.last_tran_delta = delta_time;
                document.querySelector("canvas.webgl").style.cursor = "pointer";
            }
            else if (scene_animation.box.scale.state.tranning_in) {
                let tranPct = (delta_time - scene_animation.box.scale.state.last_tran_delta)/scene_animation.box.scale.mods.duration;
                if (tranPct>=1) {
                    let newScale = scene_animation.box.scale.mods.max;
                    simpleBox1.scale.set(newScale,newScale,newScale);

                    scene_animation.box.scale.state.current_val = newScale;

                    scene_animation.box.scale.state.tranning_in = false;
                    scene_animation.box.scale.state.current_tran_duration = scene_animation.box.scale.mods.duration;
                }
                else {
                    let newScale = (scene_animation.box.scale.mods.max - scene_animation.box.scale.mods.min)*tranPct + scene_animation.box.scale.mods.min;
                    simpleBox1.scale.set(newScale,newScale,newScale);

                    scene_animation.box.scale.state.current_val = newScale;
                    scene_animation.box.scale.state.current_tran_duration = delta_time - scene_animation.box.scale.state.last_tran_delta;
                }



                }

        }
        else { 
            // no intersect
            if (scene_animation.box.scale.state.active) {
                // active so need to tran from current val to min
                scene_animation.box.scale.state.active = false;
                scene_animation.box.scale.state.tranning_in = false;
                scene_animation.box.scale.state.tranning_out = true;
                scene_animation.box.scale.state.last_tran_delta = delta_time;
                scene_animation.box.scale.state.last_val = scene_animation.box.scale.state.current_val;
                document.querySelector("canvas.webgl").style.cursor = "auto";
                
                let tranPct = (delta_time - scene_animation.box.scale.state.last_tran_delta)/(scene_animation.box.scale.state.current_tran_duration)
                tranPct = Math.min(Math.max((1-tranPct),0),1);
                let newScale = (scene_animation.box.scale.state.last_val - scene_animation.box.scale.mods.min)*tranPct + scene_animation.box.scale.mods.min;
                simpleBox1.scale.set(newScale, newScale, newScale);

                scene_animation.box.scale.state.current_val = newScale;

            }
            else if (scene_animation.box.scale.state.tranning_out) {

                let tranPct = (delta_time - scene_animation.box.scale.state.last_tran_delta)/(scene_animation.box.scale.state.current_tran_duration)
                
                if (tranPct>=1) {
                    scene_animation.box.scale.state.tranning_out = false;
                    simpleBox1.scale.set(1,1,1);
                    scene_animation.box.scale.state.current_val = 1;
                }
                else {
                    tranPct = Math.min(Math.max((1-tranPct),0),1);
                    let newScale = (scene_animation.box.scale.state.last_val - scene_animation.box.scale.mods.min)*tranPct + scene_animation.box.scale.mods.min;
                    simpleBox1.scale.set(newScale, newScale, newScale);
                    scene_animation.box.scale.state.current_val = newScale;
                }

            }
            
        }

        let newY = scene_animation.box.y_pos.state.current_val;
        simpleBox1.position.y = newY;

}

const updateGradient = () => {
    gradient_mesh.material.uniforms.uGradientY.value = (scene_animation.box.y_pos.state.current_val/(5));
    gradient_mesh.material.uniforms.uGradientX.value = (scene_animation.box.x_pos.state.current_val/5)*($device.window_height/$device.window_width);

    gradient_mesh.material.uniforms.uGradientRadius.value = .45 + .2*(scene_animation.box.scale.state.current_val-1);
    gradient_mesh.material.uniforms.uGradientExp.value = .33 + .23*(scene_animation.box.scale.state.current_val-1);
}



async function runThreeGradient() {


    let gradientFolder = $gui.items.addFolder('Gradient Folder');

    grad_attrs = {};
    grad_attrs.grad_color1 = 'text3';
    grad_attrs.grad_color2 = 'surface1';
    grad_attrs.grad_color1_options =  ['color1','color2','surface1','surface2','surface3','surface4','text1','text2','text3'];
    grad_attrs.grad_color2_options =  ['color1','color2','surface1','surface2','surface3','surface4','text1','text2','text3'];
    
    const _geometry = new THREE.BufferGeometry(); 
    _geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ - 1, 1, 0, - 1, - 1, 0, 1, - 1, 0,1,1,0 ], 3 ) );
    _geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( [ 0, 1, 0, 0, 1, 0,1,1 ], 2 ) );  
    _geometry.setIndex(new THREE.BufferAttribute( new Uint16Array([0,1,2,0,2,3] ),1 ));

    const _mat = new THREE.ShaderMaterial({
        uniforms: { 
            texture: null,
            uGradientY: {'value': 0},
            uGradientX: {'value': 0},
            uGradientRadius: {'value': .45},
            uGradientExp: {'value': .33},
            uGradColor1: {'value':
            {'r': $color_palette[grad_attrs.grad_color1].rgb[0]/255, 'g': $color_palette[grad_attrs.grad_color1].rgb[1]/255, 'b': $color_palette[grad_attrs.grad_color1].rgb[2]/255}
        
        },
            uGradColor2: {'value': 
            {'r': $color_palette[grad_attrs.grad_color2].rgb[0]/255, 'g': $color_palette[grad_attrs.grad_color2].rgb[1]/255, 'b': $color_palette[grad_attrs.grad_color2].rgb[2]/255}
        }

         },
        vertexShader:`
            varying vec2 vUv;
            void main() { 
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,
        fragmentShader: `
        uniform sampler2D texture; 
        varying vec2 vUv; 

        uniform float uGradientRadius;
        uniform float uGradientY;
        uniform float uGradientX;
        uniform float uGradientExp;
        uniform vec3 uGradColor1;
        uniform vec3 uGradColor2;


        void main() { 
            vec2 st = (vUv.xy-.5)*2.0;

            float centerDist = sqrt(pow(st.x-uGradientX,2.0)+pow(st.y-uGradientY,2.0));
            float gradPct = min(centerDist/uGradientRadius,1.0);
            float gradVal = smoothstep(0.0,1.0,gradPct);

            gradVal = pow(gradVal, uGradientExp);

            

            vec3 finalColor = uGradColor2*gradVal + uGradColor1*(1.0-gradVal);
            gl_FragColor = vec4(finalColor,1.0);
        }
        `
        })

    gradient_mesh = new THREE.Mesh(_geometry, _mat);
    gradient_camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, -100, 100 );


    // make new render target
    const renderParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
    };
    const renderSize = renderer.getSize( new THREE.Vector2() );
    const pixelRatio = renderer.getPixelRatio();
    let newRenderTarget = new THREE.WebGLRenderTarget( renderSize.width * pixelRatio, renderSize.height * pixelRatio, renderParameters );
    meta_scene.scenes[0].render_targets.write_buffer = newRenderTarget;
    meta_scene.scenes[0].render_targets.read_buffer = newRenderTarget.clone();

gradientFolder.add(_mat.uniforms.uGradientRadius,'value',0,1,.001).name('Gradient Radius');
gradientFolder.add(_mat.uniforms.uGradientExp,'value',0,5,.001).name('Gradient Exp');
gradientFolder.add(grad_attrs,'grad_color1',grad_attrs.grad_color1_options).name('Grad Color 1').onChange(() => {
    onColorChangeGradient();
});
gradientFolder.add(grad_attrs,'grad_color2',grad_attrs.grad_color2_options).name('Grad Color 2').onChange(() => {
    onColorChangeGradient();
});


}




let boxAttrs = {};

async function runThreeBox() {

// colors
// add to gui
let boxFolder = $gui.items.addFolder('Box Folder');

boxAttrs.mat_color = 'color1';
boxAttrs.mat_options = ['color1','color2','surface1','surface2','surface3','surface4','text1','text2','text3',
'#4287f5','#f54242','#000000','#ffffff'];
boxAttrs.spotlight_color = '#ffffff';
boxAttrs.spotlight_options = ['color1','color2','surface1','surface2','surface3','surface4','text1','text2','text3',
'#ffffff','#000000'];
boxAttrs.fog_color = 'surface1';
boxAttrs.fog_options = ['color1','color2','surface1','surface2','surface3','surface4','text1','text2','text3',
'#ffffff','#000000'];
boxAttrs.plane_color = 'surface1';
boxAttrs.plane_options = ['color1','color2','surface1','surface2','surface3','surface4','text1','text2','text3',
'#ffffff','#000000'];
boxAttrs.ambient_color = 'surface1';
boxAttrs.ambient_options = ['color1','color2','surface1','surface2','surface3','surface4','text1','text2','text3',
'#ffffff','#000000'];
boxAttrs.bg_color = 'surface1';
boxAttrs.bg_options = ['color1','color2','surface1','surface2','surface3','surface4','text1','text2','text3',
'#ffffff','#000000'];
boxAttrs.light1_intensity = 1;
boxAttrs.light2_intensity = .4;

boxAttrs.color_choices = [
{
    'name': 'Box Color',
    'id': 'mat',
    'updateFn': () => {
        let boxColor = (boxAttrs.mat_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.mat_color].rgb[0]/255,$color_palette[boxAttrs.mat_color].rgb[1]/255,$color_palette[boxAttrs.mat_color].rgb[2]/255) : boxAttrs.mat_color;
        simpleBox1.material.color.set(boxColor);
    }   
},
{
    'name': 'Plane Color',
    'id': 'plane',
    'updateFn': () => {
        let planeColor = (boxAttrs.plane_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.plane_color].rgb[0]/255,$color_palette[boxAttrs.plane_color].rgb[1]/255,$color_palette[boxAttrs.plane_color].rgb[2]/255) : boxAttrs.plane_color;
        simplePlane1.material.color.set(planeColor);
    }   
},
{
    'name': 'Spotlight Color',
    'id': 'spotlight',
    'updateFn': () => {
        scene.remove(light1);
        let spotLightColor = (boxAttrs.spotlight_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.spotlight_color].rgb[0]/255,$color_palette[boxAttrs.spotlight_color].rgb[1]/255,$color_palette[boxAttrs.spotlight_color].rgb[2]/255) : boxAttrs.spotlight_color;        
        light1 = new THREE.SpotLight( spotLightColor, boxAttrs.light1_intensity, 100 );
        light1.castShadow = true;

        light1.shadow.mapSize.width = 1024; 
        light1.shadow.mapSize.height = 1024; 
        light1.shadow.camera.near = .5;
        light1.shadow.camera.far = 100; 
        light1.shadow.focus = .2; 
        light1.position.set( 0, 15, 0 );
        scene.add( light1 );        
    }   
},
{
    'name': 'Ambient Light Color',
    'id': 'ambient',
    'updateFn': () => {
        scene.remove(light2);
        let ambientColor = (boxAttrs.ambient_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.ambient_color].rgb[0]/255,$color_palette[boxAttrs.ambient_color].rgb[1]/255,$color_palette[boxAttrs.ambient_color].rgb[2]/255) : boxAttrs.ambient_color;
        light2 = new THREE.AmbientLight(ambientColor, boxAttrs.light2_intensity);
        scene.add( light2 );        
    }   
},
{
    'name': 'BG Color',
    'id': 'bg',
    'updateFn': () => {
        let bgColor = (boxAttrs.bg_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.bg_color].rgb[0]/255,$color_palette[boxAttrs.bg_color].rgb[1]/255,$color_palette[boxAttrs.bg_color].rgb[2]/255) : boxAttrs.bg_color;
        renderer.setClearColor( bgColor, 1) 
    }   
},
]


let spotLightColor = (boxAttrs.spotlight_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.spotlight_color].rgb[0]/255,$color_palette[boxAttrs.spotlight_color].rgb[1]/255,$color_palette[boxAttrs.spotlight_color].rgb[2]/255) : boxAttrs.spotlight_color;
let fogColor = (boxAttrs.fog_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.fog_color].rgb[0]/255,$color_palette[boxAttrs.fog_color].rgb[1]/255,$color_palette[boxAttrs.fog_color].rgb[2]/255) : boxAttrs.fog_color;
let boxColor = (boxAttrs.mat_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.mat_color].rgb[0]/255,$color_palette[boxAttrs.mat_color].rgb[1]/255,$color_palette[boxAttrs.mat_color].rgb[2]/255) : boxAttrs.mat_color;
let planeColor = (boxAttrs.plane_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.plane_color].rgb[0]/255,$color_palette[boxAttrs.plane_color].rgb[1]/255,$color_palette[boxAttrs.plane_color].rgb[2]/255) : boxAttrs.plane_color;
let ambientColor = (boxAttrs.ambient_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.ambient_color].rgb[0]/255,$color_palette[boxAttrs.ambient_color].rgb[1]/255,$color_palette[boxAttrs.ambient_color].rgb[2]/255) : boxAttrs.ambient_color;
let bgColor = (boxAttrs.bg_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.bg_color].rgb[0]/255,$color_palette[boxAttrs.bg_color].rgb[1]/255,$color_palette[boxAttrs.bg_color].rgb[2]/255) : boxAttrs.bg_color;



// scene.background = bgThreeColor; // Setting fogColor as the background color also
// scene.fog = new THREE.Fog(fogColor, .5, 12);

let simpleBoxGeometry = new THREE.BoxGeometry(1,1,1);

scene_animation.box = {y_rot: 
{
    state: {current_val: 0, last_val: 0, current_delta: 0}
},
x_rot: {
    state: {current_val: 0, last_val: 0}
},
z_rot: {
    state: {current_val: 0, last_val: 0}
},
scale: 
{
    state: {tranning_in: false, tranning_out: false, last_tran_delta: 0, active: false, current_tran_duration: 0, current_val: 1, last_val: 1},
    mods: {min: 1, max: 1.5, duration: .5}
},
y_pos: {
    state: {current_val: -.5},
    init: {start_val: -.5}
},
x_pos: {
    state: {current_val: .5},
    init: {start_val: .5}
},
};



let simpleBoxMaterial = new THREE.MeshPhongMaterial({color: boxColor});
simpleBox1 = new THREE.Mesh( simpleBoxGeometry , simpleBoxMaterial );
simpleBox1.castShadow = true; //default is false
// simpleBox1.position.z = 0;
simpleBox1.position.y = scene_animation.box.y_pos.init.start_val;
simpleBox1.position.x = scene_animation.box.x_pos.init.start_val;
console.log(simpleBox1);
scene.add(simpleBox1);

let simplePlaneGeometry = new THREE.PlaneGeometry( 7, 7 );
let simplePlaneMaterial = new THREE.MeshStandardMaterial( {color: planeColor, side: THREE.DoubleSide} );
// simplePlaneMaterial.opacity = 0.5;
simplePlane1 = new THREE.Mesh( simplePlaneGeometry, simplePlaneMaterial );
simplePlane1.position.y = -2;
simplePlane1.rotation.set(Math.PI*.5, 0,0);
simplePlane1.receiveShadow = true;
simplePlane1.receiveLight = true;
console.log(simplePlane1);
// scene.add(simplePlane1);

camera = new THREE.PerspectiveCamera(90, window_size.width / window_size.height);
camera.position.z = 5;
scene.add(camera);


light1 = new THREE.SpotLight( spotLightColor, boxAttrs.light1_intensity, 100 );
light1.castShadow = true;

light1.shadow.mapSize.width = 1024; 
light1.shadow.mapSize.height = 1024; 
light1.shadow.camera.near = .5;
light1.shadow.camera.far = 100; 
light1.shadow.focus = .2; 
light1.position.set( 0, 2, 5 );
scene.add( light1 );



light2 = new THREE.AmbientLight(ambientColor, boxAttrs.light2_intensity);
scene.add(light1);
scene.add(light2);



renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 





boxAttrs.color_choices.forEach(colorChoice => {
   boxFolder.add(boxAttrs, colorChoice.id + '_color',boxAttrs[colorChoice.id +'_options']).name(colorChoice.name).onChange(()=> {
    colorChoice.updateFn();
    }) 
})

boxFolder.add(scene_animation.box.y_pos.state, 'current_val',-20,20,.01).name('Box Y');


};



const onColorChangeGradient = ()  => {
    gradient_mesh.material.uniforms.uGradColor1.value = {'r': $color_palette[grad_attrs.grad_color1].rgb[0]/255, 'g': $color_palette[grad_attrs.grad_color1].rgb[1]/255, 'b': $color_palette[grad_attrs.grad_color1].rgb[2]/255};
    gradient_mesh.material.uniforms.uGradColor2.value = {'r': $color_palette[grad_attrs.grad_color2].rgb[0]/255, 'g': $color_palette[grad_attrs.grad_color2].rgb[1]/255, 'b': $color_palette[grad_attrs.grad_color2].rgb[2]/255}
    console.log('grad color: ');
    console.log($color_palette[grad_attrs.grad_color1])
}

const onColorChangeBox = () => {

    let boxColor = (boxAttrs.mat_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.mat_color].rgb[0]/255,$color_palette[boxAttrs.mat_color].rgb[1]/255,$color_palette[boxAttrs.mat_color].rgb[2]/255) : boxAttrs.mat_color;
    simpleBox1.material.color.set(boxColor);

    console.log('box color: ')
    console.log(boxColor);
    console.log($color_palette);

    let spotLightColor = (boxAttrs.spotlight_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.spotlight_color].rgb[0]/255,$color_palette[boxAttrs.spotlight_color].rgb[1]/255,$color_palette[boxAttrs.spotlight_color].rgb[2]/255) : boxAttrs.spotlight_color;
 
    let ambientColor = (boxAttrs.ambient_color.slice(0,1)!='#') ? new THREE.Color($color_palette[boxAttrs.ambient_color].rgb[0]/255,$color_palette[boxAttrs.ambient_color].rgb[1]/255,$color_palette[boxAttrs.ambient_color].rgb[2]/255) : boxAttrs.ambient_color;
	
    scene.remove(light1);
	scene.remove(light2);
    light1 = new THREE.SpotLight( spotLightColor, boxAttrs.light1_intensity, 100 );
    light1.castShadow = true;

    light1.shadow.mapSize.width = 1024; 
    light1.shadow.mapSize.height = 1024; 
    light1.shadow.camera.near = .5;
    light1.shadow.camera.far = 100; 
    light1.shadow.focus = .2; 
    light1.position.set( 0, 2, 5 );
    scene.add( light1 );
    light2 = new THREE.AmbientLight(ambientColor, boxAttrs.light2_intensity);
    scene.add(light2);

}

$onColorChange = () => {
    // onColorChangeBg();
	// onColorChangeThree();
    onColorChangeGradient();
    onColorChangeBox();
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
    
    const getWindowSize = () => {

$device.window_width = window.innerWidth;
$device.window_height = window.innerHeight;
}

const updateCanvasSize = () => {

$device.window_width = window.innerWidth;
$device.window_height = window.innerHeight;
scene_animation.state.needs_window_size_update = true;


}

const logKey = (e) => {
    console.log('logging');
    if (e.key == 'f') {
        if (!$viz_state.freeze) {
            $viz_state.freeze = true;
            
        }
        else {
            $viz_state.freeze = false;
        }	
}
// 	resetActiveTimer();

// if (($user_config.command_palette) || ($main_config.mode == 'DEV') || ($main_config.mode == 'WIREFRAME') ) {
// 	// e.preventDefault();
// 	if ((e.keyCode==75) && (e.metaKey)) {
// 		console.log('commanding!');
// 		$viz_state.show_command_palette = true;
// 	}
// 	if ($viz_admin.keypress_disabled) {
// 	return;
// 	};
// 	if (e.key == 'f') {
// 	if ($viz_playback_time.freeze == 0) {
// 		$viz_playback_time.freeze = 1;
    
// 	}
// 	else if ($viz_playback_time.freeze == 1) {
// 		$viz_playback_time.freeze = 0;
// 	}
// 	}
// 	else if (e.key == 's') {
// 		console.log($viz_admin);
// 		console.log($viz_state);
// 		console.log($viz_logs);
// 	}
// 	// else if (e.key == 'v') {
// 	// 	$viz_admin.show_viz_state = !$viz_admin.show_viz_state;
// 	// }
// }
// if ($viz_admin.keypress_disabled) {
// 	return;
// };

// if ($main_config.mode == 'WIREFRAME') {
// 	if (e.key == 'n') {
// 		$sp_playback_watch.track_id = String(Math.random());

// 	}
// 	if (e.key == 'a') {
// 		$viz_state.last_time_check = $viz_playback_time.last_start_time;
// 		$viz_state.last_position_check = 0;
// 		$viz_current_track.got_audio = true;
// 		$viz_admin.current_audio_num +=1;
// 		$sp_user.audio_data_refreshes +=1;
// 	}
// 	if (e.key == 's') {
// 		console.log($viz_admin);
    
// 	}
// 	if (e.key == 'c') {
// 		$sp_user.connected = true;
// 		setTimeout(() => $viz_state.connected = true, $viz_config.confirm_connect_delay*1000);
// 		$viz_state.active_device = true;
    
// 	}
// }
}

function resetActiveTimer() {

// if (!$viz_state.overlays_visible ) {
// 	$viz_state.overlays_visible = true;
// }
// clearTimeout(idleTime);
// idleTime = setTimeout(() => windowIdle(), $viz_config.idle_timeout*1000);
}

function windowIdle() {

// if (!$viz_state.active) {
// 	return;
// }
// $viz_state.overlays_fading = true; 
// setTimeout(() => {$viz_state.overlays_visible = false;$viz_state.overlays_fading = false; }, 1000);

}

const addEventListeners = () => {
window.addEventListener('resize', updateCanvasSize);
document.addEventListener('keydown', logKey);	
document.onmousemove = resetActiveTimer;
// document.onmousemove = onMouseMove;
document.onmousedown = resetActiveTimer; // touchscreen presses
document.ontouchstart = resetActiveTimer;
document.onclick = resetActiveTimer;     // touchpad clicks
document.onkeydown = resetActiveTimer;   // onkeypress is deprectaed

}

const onMouseMove = (event) => {
    // resetActiveTimer();
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


</script>