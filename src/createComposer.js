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