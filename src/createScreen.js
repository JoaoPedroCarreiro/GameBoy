import * as Three from "three"

import * as Constants from "constants"

export default function createScreen(scene) {
    const geometry = new Three.BoxGeometry(Constants.SCREEN_DEPTH, Constants.HEIGHT, Constants.WIDTH)
    const material = new Three.MeshBasicMaterial({ color: 0x8bac0f }) // CHANGE TO STANDARD
    const screen = new Three.Mesh(geometry, material)
    
    screen.position.set(
        0.29799121618270874,
        0.5541607737541199,
        0.0028392791282385588
    )

    scene.add(screen)

    return screen
}