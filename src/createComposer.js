import * as Three from 'three'

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { ColorCorrectionShader } from "three/examples/jsm/shaders/ColorCorrectionShader.js"

const GLOW_STRENGTH = 0.05
const GLOW_RADIUS = 0.1
const GLOW_THRESHOLD = 0.1

export default function createComposer(scene, camera, renderer) {
    // const composer = new EffectComposer(scene.renderer)
    // composer.addPass(new RenderPass(scene.instance, camera))
    // composer.addPass(new ShaderPass(ColorCorrectionShader))
    // composer.addPass(new UnrealBloomPass(new Three.Vector2(window.innerWidth, window.innerHeight), GLOW_STRENGTH, GLOW_RADIUS, GLOW_THRESHOLD))
    // composer.addPass(new OutputPass())
    
    function render() {
        // composer.render()
    }

    return {
        render
    }
}

// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
// import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
// import { ColorCorrectionShader } from 'three/addons/shaders/ColorCorrectionShader.js'
// import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'

// let camera, scene, renderer, container;

// const fxaaPass = new ShaderPass( FXAAShader )

// const pixelRatio = renderer.getPixelRatio();

// fxaaPass.material.uniforms['resolution'].value.x = 1 / ( container.offsetWidth * pixelRatio );
// fxaaPass.material.uniforms['resolution'].value.y = 1 / ( container.offsetHeight * pixelRatio );

// const composer2 = new EffectComposer(renderer)
// composer2.addPass(renderPass)
// composer2.addPass(colorCorrectionPass)

// // FXAA is engineered to be applied towards the end of engine post processing after conversion to low dynamic range and conversion to the sRGB color space for display.´

// composer2.addPass( fxaaPass );

// function onWindowResize() {
//     renderer.setSize( container.offsetWidth, container.offsetHeight );
//     composer1.setSize( container.offsetWidth, container.offsetHeight );
//     composer2.setSize( container.offsetWidth, container.offsetHeight );

//     const pixelRatio = renderer.getPixelRatio();

//     fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
//     fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );

// }

// animate();

// function animate() {
//     requestAnimationFrame( animate );

//     const halfWidth = container.offsetWidth / 2;

//     renderer.setScissorTest( true );

//     renderer.setScissor( 0, 0, halfWidth - 1, container.offsetHeight );
//     composer1.render();

//     renderer.setScissor( halfWidth, 0, halfWidth, container.offsetHeight );
//     composer2.render();

//     renderer.setScissorTest( false );
// }
