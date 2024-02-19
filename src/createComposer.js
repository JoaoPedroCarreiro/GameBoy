import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"

export default function createComposer(scene, camera) {
    const composer = new EffectComposer(scene.renderer)
    composer.addPass(new SSAARenderPass(scene.instance, camera))
    composer.addPass(new OutputPass())
    
    function render() {
        composer.render()
    }

    return {
        render
    }
}