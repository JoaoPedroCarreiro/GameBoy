import * as Three from "three"

export default function createListener(camera) {
    const listener = new Three.AudioListener()
    camera.add(listener)

    return listener
}