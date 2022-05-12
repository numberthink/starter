<script>

	import { onMount, onDestroy} from 'svelte';
	import {viz_state, gui} from '../stores/env.js';
	import {colors, device, color_palette} from '../stores/layout.js';
	import {onColorChange} from '../stores/functions.js';
    import {getColorFromPalette} from '../lib/utilities/Colors.js';
    import {MeshReflectorMaterial} from '../lib/three/materials.js';

    let scene, camera, canvas, THREE, renderer, delta_time,clock,window_size;
    let gradient_mesh, scene_attrs, gradient_camera, grad_attrs;
    let simpleBox1, simplePlane1, light1, light2, raycaster, pointer;
    let ground_attrs, fbo1, fbo2, simplePlane2;

    let scene_animation = {};

    let meta_scene = {
        scenes: [{'name': 'bg_gradient',
            'render_targets': {
                'write_buffer': null,
                'read_buffer': null
            }}]
    }

let copyShader = {

uniforms: {

    'tDiffuse': { value: null },
    'opacity': { value: 1.0 }

},

vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,

fragmentShader: /* glsl */`
    uniform float opacity;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
    vec4 texel = texture2D( tDiffuse, vUv );
    gl_FragColor = opacity * texel;
    }`

};
//gl_FragColor = opacity * texel;
//gl_FragColor = vec4(.2,.5,.8,1.0);


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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outPutEncoding = THREE.sRGBEncoding;

    camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, -100, 100 );

    scene = new THREE.Scene();

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    pointer.x = -100;
    pointer.y = -100;

    let resolution = 1024;
    const parameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        encoding: renderer.outputEncoding,
        type: THREE.HalfFloatType
      }
    fbo1 = new THREE.WebGLRenderTarget(resolution, resolution, parameters)
    fbo1.depthBuffer = true
    fbo1.depthTexture = new THREE.DepthTexture(resolution, resolution)
    fbo1.depthTexture.format = THREE.DepthFormat
    fbo1.depthTexture.type = THREE.UnsignedShortType
    fbo2 = new THREE.WebGLRenderTarget(resolution, resolution, parameters);
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

// const normalTexture = textureLoader.load('../../lib/three/textures/terrain-normal.jpeg');
// const roughnessTexture = textureLoader.load('../../lib/three/textures/terrain-roughness.jpeg');
    const normalTexture = textureLoader.load('../static/terrain-normal.jpeg');
    let copyMaterial = new THREE.ShaderMaterial( { 
                uniforms: copyShader.uniforms,
                vertexShader: copyShader.vertexShader,
                fragmentShader: copyShader.fragmentShader
        
            } );

    // let copyMaterial = new THREE.MeshStandardMaterial({color: 0xffffff})
    
    let simplePlaneGeometry = new THREE.PlaneGeometry( 7, 7 );
    simplePlane2 = new THREE.Mesh( simplePlaneGeometry, copyMaterial );
    simplePlane2.position.y = 4;
    simplePlane2.rotation.set(0, 0,0);
    simplePlane2.material.uniforms.tDiffuse.value = normalTexture;


// scene.add(simplePlane2);
    initThreeScene();
    runThreeGradient();
    runThreeBox();
    runThreeGround();
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
    // scene.background = meta_scene.scenes[0].render_targets.read_buffer.texture;
    // simplePlane2.material.uniforms.tDiffuse = meta_scene.scenes[0].render_targets.read_buffer.texture;
    simplePlane2.material.uniforms.tDiffuse.value = fbo1.texture;
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

async function runThreeGround() {
    ground_attrs = {};
ground_attrs.plane_color = 'surface1';
// load textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

// const normalTexture = textureLoader.load('../../lib/three/textures/terrain-normal.jpeg');
// const roughnessTexture = textureLoader.load('../../lib/three/textures/terrain-roughness.jpeg');
const normalTexture = await textureLoader.load('../static/terrain-normal.jpeg');
const roughnessTexture = await textureLoader.load('../static/terrain-roughness.jpeg');

let planeColor = (ground_attrs.plane_color.slice(0,1)!='#') ? new THREE.Color($color_palette[ground_attrs.plane_color].rgb[0]/255,$color_palette[ground_attrs.plane_color].rgb[1]/255,$color_palette[ground_attrs.plane_color].rgb[2]/255) : ground_attrs.plane_color;
// pain
let simplePlaneGeometry = new THREE.PlaneGeometry( 7, 7 );
let simplePlaneMaterial = new THREE.MeshStandardMaterial( {color: planeColor, side: THREE.DoubleSide} );


let matParams = 
{
        envMapIntensity: new THREE.Uniform( 0 ),
        normalMap: new THREE.Uniform( normalTexture), 
        normalScale:new THREE.Uniform( new THREE.Vector2(.15,.15) ),
        roughnessMap:new THREE.Uniform( roughnessTexture),
        dithering: new THREE.Uniform( true),
        color: new THREE.Uniform( new THREE.Vector3(0.015, 0.015, 0.015) ),
        roughness: new THREE.Uniform( 0.7),
        blur: new THREE.Uniform( new THREE.Vector2(1000, 400) ), // Blur ground reflections (width, heigt), 0 skips blur
        mixBlur:new THREE.Uniform( 30), // How much blur mixes with surface roughness (default = 1)
        mixStrength:new THREE.Uniform( 80), // Strength of the reflections
        mixContrast:new THREE.Uniform( 1), // Contrast of the reflections
        resolution:new THREE.Uniform(1024),// Off-buffer resolution, lower=faster, higher=better quality, slower
        mirror:new THREE.Uniform( 0 ), // Mirror environment, 0 = texture colors, 1 = pick up env colors
        depthScale:new THREE.Uniform( 0.01 ), // Scale the depth factor (0 = no depth, default = 0)
        minDepthThreshold:new THREE.Uniform( 0.9 ),// Lower edge for the depthTexture interpolation (default = 0)
        maxDepthThreshold:new THREE.Uniform( 1 ),// Upper edge for the depthTexture interpolation (default = 0)
        depthToBlurRatioBias:new THREE.Uniform( .25 ),// Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
        debug:new THREE.Uniform( 0 ),
        reflectorOffset:new THREE.Uniform( 0,2 ) // 
}
let orig_params = {    color: planeColor, 
    side: THREE.DoubleSide,
    envMapIntensity: 0,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(.5,.5),
    roughnessMap: roughnessTexture,
    dithering: true,
    roughness: .7,
    // blur: new THREE.Vector2(1000,400),
    // resolution: 1024,
    // debug: 0,
    // reflectorOffset: .2
}
let new_params = {
    // color: planeColor, 
    // side: THREE.DoubleSide,
    // added
    envMapIntensity: {value: 0},
    normalMap: {value: normalTexture},
    normalScale: {value: [.15,.15]},
    roughnessMap: {value: roughnessTexture},
    dithering: {value: true},
    roughness: {value: .7},
    blur: {value: [1000, 400]},
    resolution: {value: 1024},
    debug: {value: 0},
    reflectorOffset: {value: .2},
    // defaults
    blurStrength: {value: .5},
    distortion: {value:  1},
    hasBlur: {value:  false},
    textureMatrix: {value: null},
    tDiffuseBlur: {value: null},
    tDiffuse: {value: null},
    distortionMap: {value: null},
    tDepth: {value: null},
    // other

    mixBlur:{value: 30}, // How much blur mixes with surface roughness (default = 1)
    mixStrength:{value: 80}, // Strength of the reflections
    mixContrast:{value:  1}, // Contrast of the reflections
    //resolution:new THREE.Uniform(1024),// Off-buffer resolution, lower=faster, higher=better quality, slower
    mirror:{value:  0 }, // Mirror environment, 0 = texture colors, 1 = pick up env colors
    depthScale:{value:  0.01 }, // Scale the depth factor (0 = no depth, default = 0)
    minDepthThreshold:{value:  0.9 },// Lower edge for the depthTexture interpolation (default = 0)
    maxDepthThreshold:{value: 1 },// Upper edge for the depthTexture interpolation (default = 0)
    depthToBlurRatioBias:{value:  .25 },

    // underscore
    _blurStrength: {value: new THREE.Uniform( .5)},
    _distortion: {value: new THREE.Uniform( 1)},
    _hasBlur: {value: new THREE.Uniform( false)},
    _textureMatrix: {value: new THREE.Matrix4()},
    _tDiffuseBlur: {value: new THREE.Texture()},
    _tDiffuse: {value: new THREE.Texture()},
    _distortionMap: {value: new THREE.Texture()},
    _tDepth: {value: new THREE.Texture()},
    // other

    _mixBlur:{value: new THREE.Uniform( 30)}, // How much blur mixes with surface roughness (default = 1)
    _mixStrength:{value: new THREE.Uniform( 80)}, // Strength of the reflections
    _mixContrast:{value: new THREE.Uniform( 1)}, // Contrast of the reflections
    //resolution:new THREE.Uniform(1024),// Off-buffer resolution, lower=faster, higher=better quality, slower
    _mirror:{value: new THREE.Uniform( 0 )}, // Mirror environment, 0 = texture colors, 1 = pick up env colors
    _depthScale:{value: new THREE.Uniform( 0.01 )}, // Scale the depth factor (0 = no depth, default = 0)
    _minDepthThreshold:{value: new THREE.Uniform( 0.9 )},// Lower edge for the depthTexture interpolation (default = 0)
    _maxDepthThreshold:{value: new THREE.Uniform( 1 )},// Upper edge for the depthTexture interpolation (default = 0)
    _depthToBlurRatioBias:{value: new THREE.Uniform( .25 )},// Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
    // debug:new THREE.Uniform( 0 ),
    //reflectorOffset:new THREE.Uniform( 0.2 ) // 


}

// reflectorMaterial.onBeforeCompile = (shader) => {
//     if (!shader.defines?.USE_UV) {
//       shader.defines.USE_UV = ''
//     }
//     shader.uniforms.hasBlur = new_params._hasBlur
//     shader.uniforms.tDiffuse = new_params._tDiffuse
//     shader.uniforms.tDepth = new_params._tDepth
//     shader.uniforms.distortionMap = new_params._distortionMap
//     shader.uniforms.tDiffuseBlur = new_params._tDiffuseBlur
//     shader.uniforms.textureMatrix = new_params._textureMatrix
//     shader.uniforms.mirror = new_params._mirror
//     shader.uniforms.mixBlur = new_params._mixBlur
//     shader.uniforms.mixStrength = new_params._blurStrength
//     shader.uniforms.minDepthThreshold = new_params._minDepthThreshold
//     shader.uniforms.maxDepthThreshold = new_params._maxDepthThreshold
//     shader.uniforms.depthScale = new_params._depthScale
//     shader.uniforms.depthToBlurRatioBias = new_params._depthToBlurRatioBias
//     shader.uniforms.distortion = new_params._distortion
//     shader.uniforms.mixContrast = new_params._mixContrast
//     shader.vertexShader = `
//         uniform mat4 textureMatrix;
//         varying vec4 my_vUv;
//       ${shader.vertexShader}`
//     shader.vertexShader = shader.vertexShader.replace(
//       '#include <project_vertex>',
//       `#include <project_vertex>
//         my_vUv = textureMatrix * vec4( position, 1.0 );
//         gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`
//     )
//     shader.fragmentShader = `
//         uniform sampler2D tDiffuse;
//         uniform sampler2D tDiffuseBlur;
//         uniform sampler2D tDepth;
//         uniform sampler2D distortionMap;
//         uniform float distortion;
//         uniform float cameraNear;
// 			  uniform float cameraFar;
//         uniform bool hasBlur;
//         uniform float mixBlur;
//         uniform float mirror;
//         uniform float mixStrength;
//         uniform float minDepthThreshold;
//         uniform float maxDepthThreshold;
//         uniform float mixContrast;
//         uniform float depthScale;
//         uniform float depthToBlurRatioBias;
//         varying vec4 my_vUv;
//         ${shader.fragmentShader}`
//     shader.fragmentShader = shader.fragmentShader.replace(
//       '#include <emissivemap_fragment>',
//       `#include <emissivemap_fragment>
//       float distortionFactor = 0.0;
//       #ifdef USE_DISTORTION
//         distortionFactor = texture2D(distortionMap, vUv).r * distortion;
//       #endif
//       vec4 new_vUv = my_vUv;
//       new_vUv.x += distortionFactor;
//       new_vUv.y += distortionFactor;
//       vec4 base = texture2DProj(tDiffuse, new_vUv);
//       vec4 blur = texture2DProj(tDiffuseBlur, new_vUv);
//       vec4 merge = base;
//       #ifdef USE_NORMALMAP
//         vec2 normal_uv = vec2(0.0);
//         vec4 normalColor = texture2D(normalMap, vUv * normalScale);
//         vec3 my_normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );
//         vec3 coord = new_vUv.xyz / new_vUv.w;
//         normal_uv = coord.xy + coord.z * my_normal.xz * 0.05;
//         vec4 base_normal = texture2D(tDiffuse, normal_uv);
//         vec4 blur_normal = texture2D(tDiffuseBlur, normal_uv);
//         merge = base_normal;
//         blur = blur_normal;
//       #endif
//       float depthFactor = 0.0001;
//       float blurFactor = 0.0;
//       #ifdef USE_DEPTH
//         vec4 depth = texture2DProj(tDepth, new_vUv);
//         depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
//         depthFactor *= depthScale;
//         depthFactor = max(0.0001, min(1.0, depthFactor));
//         #ifdef USE_BLUR
//           blur = blur * min(1.0, depthFactor + depthToBlurRatioBias);
//           merge = merge * min(1.0, depthFactor + 0.5);
//         #else
//           merge = merge * depthFactor;
//         #endif
//       #endif
//       float reflectorRoughnessFactor = roughness;
//       #ifdef USE_ROUGHNESSMAP
//         vec4 reflectorTexelRoughness = texture2D( roughnessMap, vUv );
//         reflectorRoughnessFactor *= reflectorTexelRoughness.g;
//       #endif
//       #ifdef USE_BLUR
//         blurFactor = min(1.0, mixBlur * reflectorRoughnessFactor);
//         merge = mix(merge, blur, blurFactor);
//       #endif
//       vec4 newMerge = vec4(0.0, 0.0, 0.0, 1.0);
//       newMerge.r = (merge.r - 0.5) * mixContrast + 0.5;
//       newMerge.g = (merge.g - 0.5) * mixContrast + 0.5;
//       newMerge.b = (merge.b - 0.5) * mixContrast + 0.5;
//       diffuseColor.rgb = diffuseColor.rgb * ((1.0 - min(1.0, mirror)) + newMerge.rgb * mixStrength);
//       `
//     )
//   }

let reflectorMaterial = new THREE.MeshStandardMaterial(orig_params);

simplePlane1 = new THREE.Mesh( simplePlaneGeometry, reflectorMaterial );
simplePlane1.position.y = -2;
simplePlane1.rotation.set(-Math.PI*.5, 0,0);

let resolution = 1024;
let reflectorOffset = 0;

let reflectorPlane = new THREE.Plane();
let normal = new THREE.Vector3();
let reflectorWorldPosition = new THREE.Vector3();
let cameraWorldPosition = new THREE.Vector3();
let rotationMatrix = new THREE.Matrix4();
let lookAtPosition = new THREE.Vector3(0, 0, -1);
let clipPlane = new THREE.Vector4();
let view= new THREE.Vector3();
let target= new THREE.Vector3();
let q = new THREE.Vector4();
let textureMatrix = new THREE.Matrix4();
let virtualCamera = new THREE.PerspectiveCamera();

reflectorWorldPosition.setFromMatrixPosition(simplePlane1.matrixWorld);
cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
rotationMatrix.extractRotation(simplePlane1.matrixWorld);
normal.set(0, 0, 1);
normal.applyMatrix4(rotationMatrix);
reflectorWorldPosition.addScaledVector(normal, reflectorOffset);
view.subVectors(reflectorWorldPosition, cameraWorldPosition); // reflector position - camera position
// view.dot(normal) > 0 unless camera facing away
view.reflect(normal).negate();
view.add(reflectorWorldPosition);
rotationMatrix.extractRotation(camera.matrixWorld);
lookAtPosition.set(0, 0, -1)
lookAtPosition.applyMatrix4(rotationMatrix)
lookAtPosition.add(cameraWorldPosition)
target.subVectors(reflectorWorldPosition, lookAtPosition)
target.reflect(normal).negate()
target.add(reflectorWorldPosition);
virtualCamera.position.copy(view)
virtualCamera.up.set(0, 1, 0)
virtualCamera.up.applyMatrix4(rotationMatrix)
virtualCamera.up.reflect(normal)
virtualCamera.lookAt(target)
virtualCamera.far = camera.far // Used in WebGLBackground
virtualCamera.updateMatrixWorld()
virtualCamera.projectionMatrix.copy(camera.projectionMatrix)
// Update the texture matrix
textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0)
textureMatrix.multiply(virtualCamera.projectionMatrix)
textureMatrix.multiply(virtualCamera.matrixWorldInverse)
textureMatrix.multiply(simplePlane1.matrixWorld)
// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition)
reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse)
clipPlane.set(reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant)
const projectionMatrix = virtualCamera.projectionMatrix
q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0]
q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5]
q.z = -1.0
q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14]
// Calculate the scaled plane vector
clipPlane.multiplyScalar(2.0 / clipPlane.dot(q))
// Replacing the third row of the projection matrix
projectionMatrix.elements[2] = clipPlane.x
projectionMatrix.elements[6] = clipPlane.y
projectionMatrix.elements[10] = clipPlane.z + 1.0
projectionMatrix.elements[14] = clipPlane.w
// pain
renderer.state.buffers.depth.setMask(true)
renderer.xr.enabled = false
renderer.shadowMap.autoUpdate = false
// renderer.setClearColor(0xffffff);
renderer.setRenderTarget(fbo1);
renderer.render(scene, virtualCamera)



console.log(reflectorMaterial);


simplePlane1.receiveShadow = true;
simplePlane1.receiveLight = true;
scene.add(simplePlane1);


// let copyMaterial = new THREE.ShaderMaterial( { 
//                 uniforms: copyShader.uniforms,
//                 vertexShader: copyShader.vertexShader,
//                 fragmentShader: copyShader.fragmentShader
        
//             } );



// simplePlane2 = new THREE.Mesh( simplePlaneGeometry, copyMaterial );
// simplePlane2.position.y = 2;
// simplePlane2.rotation.set(0, 0,0);

scene.add(simplePlane2);


}



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