import * as Three from "three"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js"

const FOV = 75.0

export default function createCamera(renderer) {
    const instance = new Three.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000)
    instance.position.set(3.5, 0, 0)
    instance.rotation.set(0, Math.PI / 2, 0)

    const rotation = new OrbitControls(instance, renderer.domElement)
    rotation.enablePan = false
    rotation.enableZoom = false
    rotation.enableDamping = true

    const zoom = new TrackballControls(instance, renderer.domElement)
    zoom.noRotate = true
    zoom.noPan = true
    zoom.noZoom = false
    zoom.zoomSpeed = 1.5
    zoom.minDistance = 2.7
    zoom.maxDistance = 6

    rotation.dampingFactor = 0.1

    function update() {
        rotation.update()
        zoom.target.copy(rotation.target)
        zoom.update()
    }

    function enable() {
        rotation.enableRotate = true
        rotation.enableDamping = true
        zoom.enabled = true
    }

    function disable() {
        rotation.enableRotate = false
        zoom.enabled = false
    }

    function setAspect(newAspect) {
        instance.aspect = newAspect
    }

    function updateProjectionMatrix() {
        instance.updateProjectionMatrix()
    }

    return {
        instance,
        rotation,
        enable,
        disable,
        update,
        setAspect,
        updateProjectionMatrix
    }
}