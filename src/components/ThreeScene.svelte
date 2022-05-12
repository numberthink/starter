<script>

	import { onMount} from 'svelte';
	import {vizState} from '../stores/env.js';
    import {device} from '../stores/layout.js';

    let scene, camera, canvas, THREE, renderer, delta_time,clock,window_size;
    let gradient_mesh, scene_attrs, gradient_camera, grad_attrs;
    let simpleBox1, simplePlane1, light1, light2, raycaster, pointer;
    let ground_attrs, fbo1, fbo2, simplePlane2;

    let scene_animation = {};


    onMount(async () => {

        updateWindowSize();

        addEventListeners();

        initThreeScene();
        
        runThreeScene();

    });



const runThreeScene = async () => {

    tick();

}

const initThreeScene = async () => {

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
    
}

const updateAnimation = () => {
    
}

const tick = () => {
	
	if (!$vizState.freeze) {

		delta_time = clock.getElapsedTime();

        updateAnimation();

		renderScene();

	}



	window.requestAnimationFrame(tick);

}

const renderScene = () => {


    renderer.render(scene, camera);

    
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
    


const updateWindowSize = () => {

$device.window_width = window.innerWidth;
$device.window_height = window.innerHeight;


}

const logKey = (e) => {
    console.log('logging');
    if (e.key == 'f') {
        if (!$vizState.freeze) {
            $vizState.freeze = true;
            
        }
        else {
            $vizState.freeze = false;
        }	
}
}




const addEventListeners = () => {
window.addEventListener('resize', updateWindowSize);
document.addEventListener('keydown', logKey);	

}

const onMouseMove = (event) => {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


</script>