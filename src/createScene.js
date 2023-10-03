import * as Three from "three"

export default function createScene() {
    const instance = new Three.Scene()
    
    let renderer = null

    if(!document.createElement("canvas").getContext("webgl2")) {
        renderer = new Three.WebGL1Renderer({ antialias: true })
    } else {
        renderer = new Three.WebGLRenderer({ antialias: true })
    }

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = Three.PCFSoftShadowMap

    document.body.appendChild(renderer.domElement)

    function add(arg) {
        instance.add(arg)
    }

    function remove(arg) {
        instance.remove(arg)
    }

    function render(camera) {
        renderer.render(instance, camera)
    }

    return {
        instance,
        renderer,
        add,
        remove,
        render
    }
}