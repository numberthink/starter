<script>
    import { onMount} from 'svelte';
	import {vizState} from '../stores/env.js';
    import {device,colorPalette} from '../stores/layout.js';
    import * as THREE from 'three';

    let scene, camera, canvas, renderer, deltaTime,clock, light1, light2, boxMesh, animation, sceneObjects, sceneState,sceneUniforms;

    onMount(async () => {

        updateWindowSize();
        initThreeScene();
        addEventListeners();

    });

const initThreeScene = () => {

clock = new THREE.Clock();
clock.start();  

canvas = document.querySelector('canvas.webgl');
renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
    });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.outPutEncoding = THREE.sRGBEncoding;

//camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, -100, 100 );
camera = new THREE.PerspectiveCamera(90, $device.windowWidth / $device.windowHeight);
camera.position.set( 0 , 0 , 5 );

scene = new THREE.Scene();

sceneUniforms = {};
sceneUniforms.colors = [];
sceneUniforms.colors.push({
    name: 'bgColor',
    value: {
        h: $colorPalette.color1.surface1.hsl[0],
        s: $colorPalette.color1.surface1.hsl[1],
        l: $colorPalette.color1.surface1.hsl[2]
    },
    mapsTo: {mainColor: 'color1',derivedColor: 'surface1'},
    type: 'hsl',
    objectId: 'clearColor'
})

let bgColor = new THREE.Color('hsl('+ $colorPalette.color1.surface1.hsl[0] +', '+ $colorPalette.color1.surface1.hsl[1] +'%, '+ $colorPalette.color1.surface1.hsl[2] +'%)');
renderer.setClearColor(bgColor,1);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize($device.windowWidth, $device.windowHeight);


sceneUniforms.colors.push({
    name: 'boxColor',
    value: {
        h: $colorPalette.color1.hsl[0],
        s: $colorPalette.color1.hsl[1],
        l: $colorPalette.color1.hsl[2]
    },
    mapsTo: {mainColor: 'color1',type: 'main'},
    type: 'hsl',
    objectId: 'boxMesh'
    
})

let boxObject = {
    width: 1,
    height: 1,
    color: new THREE.Color('hsl('+ $colorPalette.color1.hsl[0] +', '+ $colorPalette.color1.hsl[1] +'%, '+ $colorPalette.color1.hsl[2] +'%)'),
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    x: 0,
    y: -1,
    z: 0
}

let boxGeo = new THREE.BoxGeometry(boxObject.width, boxObject.height);
let boxMat = new THREE.MeshPhongMaterial( {color: boxObject.color} );
boxMesh = new THREE.Mesh(boxGeo, boxMat);



boxMesh.rotation.set(boxObject.rotationX, boxObject.rotationY,boxObject.rotationZ);
boxMesh.position.set(boxObject.x, boxObject.y,boxObject.z);

scene.add(boxMesh);

sceneObjects = {};

sceneObjects['boxMesh'] = boxMesh;

// add animation

let boxAnimation1 = {
    onScrollY: 'animate',
    speed: .2*Math.PI*2,
    state: {lastValue: 0, newValue: 0, lastDeltaTime: 0, active: false, reverting: false, lastTransitionPct: 0},
    objectId: 'boxMesh',
    property: 'rotation',
    value: 'x',
    scrollYFactor: Math.PI*.005
}

let boxAnimation2 = JSON.parse(JSON.stringify(boxAnimation1));
boxAnimation2.value = 'y';
boxAnimation2.onScrollY = 'pause';

let boxAnimation3 = JSON.parse(JSON.stringify(boxAnimation1));
boxAnimation3.value = 'z';
boxAnimation3.onScrollY = 'pause';

animation = {};
animation.objects = [];
animation.state = {scrolling: false, lastScrollY: 0, currentScrollY: 0};
animation.scrollYActive = true;

animation.objects.push(boxAnimation1);
animation.objects.push(boxAnimation2);
animation.objects.push(boxAnimation3);




light1 = new THREE.SpotLight( 0xffffff, 1, 100 );
light1.position.set( 0, 2, 5 );
scene.add( light1 );



light2 = new THREE.AmbientLight(0xffffff, .2);
scene.add(light1);
scene.add(light2);

renderer.render(scene, camera);

sceneState = {};
sceneState.active = true;
sceneState.everActive = true;

tick();

}

const tick = () => {

    if (!$vizState.freeze) {

    deltaTime = clock.getElapsedTime();

    updateAnimation();
    doColorCheck();


    renderer.setSize($device.windowWidth, $device.windowHeight);

    renderer.render(scene, camera);

    }

    window.requestAnimationFrame(tick);
}

const updateAnimation = () => {

    updateAnimationScroll();
    if (animation.state?.scrolling) {
        animation.objects.forEach(thisAnimation => {

            if (thisAnimation.onScrollY == 'pause') {
            // do nothing
                thisAnimation.state.lastDeltaTime = deltaTime;
                if (thisAnimation.state.lastValue != thisAnimation.state.newValue) {
                    thisAnimation.state.lastValue = thisAnimation.state.newValue;
                }
            }
            else if (thisAnimation.onScrollY == 'animate') {
                doScrollAnimation(thisAnimation);
            }
        })
    }
    else {
        animation.objects.forEach(thisAnimation => {
            doSpeedAnimation(thisAnimation);
        });
    }
}

const doSpeedAnimation = (animationObject) => {

    let newValue = animationObject.state.lastValue + (deltaTime-animationObject.state.lastDeltaTime)*animationObject.speed;
    animationObject.state.newValue = newValue;
    sceneObjects[animationObject.objectId][animationObject.property][animationObject.value] = newValue;
}

const doScrollAnimation = (thisAnimation) => {

    let scrollDiff = animation.state.currentScrollY - animation.state.lastScrollY;

    thisAnimation.state.lastValue = thisAnimation.state.newValue;

    let newValue = thisAnimation.state.lastValue + scrollDiff*thisAnimation.scrollYFactor;

    sceneObjects[thisAnimation.objectId][thisAnimation.property][thisAnimation.value] = newValue;

    thisAnimation.state.newValue = newValue;
    thisAnimation.state.lastDeltaTime = deltaTime;
}
const updateAnimationScroll = () => {
    let scrollY = window.pageYOffset;
    if (animation.scrollYActive) {
        if (animation.state.currentScrollY!=scrollY) {
            // scroll position changed!
            if (!animation.state.scrolling) {
                // need to set state to scrolling
                animation.state.scrolling = true;
                animation.state.lastScrollY = animation.state.currentScrollY;
                animation.state.currentScrollY = scrollY;
 

            }
            else {
                // already was scrolling, but need to update scroll position
                animation.state.lastScrollY = animation.state.currentScrollY;
                animation.state.currentScrollY = scrollY;
            }

        }
        else {
            // scroll position unchanged!
            if (animation.state.scrolling) {
                // still thinks it's scrolling, so need to set to false
                animation.state.scrolling = false;
            }

        }
    }

}

const doColorCheck = () => {

    sceneUniforms.colors.forEach(thisColorUniform=> {
        let currentHSL = (thisColorUniform.mapsTo?.type=='main') ? $colorPalette[thisColorUniform.mapsTo.mainColor].hsl : $colorPalette[thisColorUniform.mapsTo.mainColor][thisColorUniform.mapsTo.derivedColor].hsl;
        if ((thisColorUniform.value.h!=currentHSL[0]) || (thisColorUniform.value.s!=currentHSL[1]) || (thisColorUniform.value.l!=currentHSL[2])) {
  
            thisColorUniform.value = {'h':currentHSL[0], 's': currentHSL[1], 'l': currentHSL[2] };
            if (thisColorUniform.objectId=='clearColor') {
                let bgColor = new THREE.Color('hsl('+ thisColorUniform.value.h +', '+ thisColorUniform.value.s +'%, '+ thisColorUniform.value.l +'%)');
                renderer.setClearColor(bgColor,1);

            }
            else {
                let thisObjectColor = new THREE.Color('hsl('+ thisColorUniform.value.h +', '+ thisColorUniform.value.s +'%, '+ thisColorUniform.value.l +'%)');
                sceneObjects[thisColorUniform.objectId].material.color = thisObjectColor;
            }
        }
    })

}

const watchVizActive = vizState.subscribe(value => {
		if ((!$vizState.active) && (sceneState?.active) ) {
            // hide scene set scene state active = false
            $vizState.freeze = true;
            renderer.setSize(0,0);
            renderer.setClearAlpha(0);
            renderer.render(scene, camera);
            sceneState.active = false;
            
        }
        else if ((sceneState?.everActive) && ($vizState.active) && (!sceneState.active)) {
            // show scene set scene state active = true
            renderer.setSize($device.windowWidth,$device.windowHeight);
            renderer.setClearAlpha(1);
            renderer.render(scene, camera);
            sceneState.active = true;
            $vizState.freeze = false;
        }
        
});

const updateWindowSize = () => {

$device.windowWidth = window.innerWidth;
$device.windowHeight = window.innerHeight;


}



const logKey = (e) => {

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

</script>