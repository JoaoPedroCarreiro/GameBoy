import createGameObject from "game/createGameObject.js"

export default function createTetris(scene) {
    const state = {
        objects: {}
    }

    state.objects.rect = createGameObject(scene, 0, 0, 32, 32, "./assets/texture1.jpg")
    state.objects.rect1 = createGameObject(scene, 0, 64, 32, 32, "./assets/texture1.jpg")

    state.objects.rect.collidesWith(state.objects.rect1)

    function update() {
        state.objects.rect.setY(state.objects.rect.getY() + 0.1)
    }

    function finish() {
        for(const obj in state.objects) {
            state.objects[obj].remove()
        }
        state.objects = {}
    }

    return {
        ...state,
        update,
        finish
    }
}