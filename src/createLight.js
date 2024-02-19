import * as Three from "three"

export default function createLight(scene, intesity, distance, angle, penumbra, decay) {
    const light = new Three.SpotLight(0xffffff, intesity, distance, angle, penumbra, decay)
    light.castShadow = true
    light.shadow.mapSize = new Three.Vector2(4096, 4096)
    light.shadow.bias = -0.0003

    scene.add(new Three.HemisphereLight(0x3d4070, 0x080820, 4))
    scene.add(light)

    function followCamera(camera) {
        light.position.set(camera.position.x, camera.position.y * 3, camera.position.z)
    }

    function setAngle(angle) {
        light.angle = angle
    }

    return {
        followCamera,
        setAngle
    }
}