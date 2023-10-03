import createGameObject from "game/createGameObject.js"

export default function createSpaceInvaders(scene) {
    const state = {
        objects: {},
        enemies: [],
        inputs: {}
    }

    const PLAYER_SPD = 3.0
    const SHOOT_SPD = 3.3

    let canShoot = true

    state.objects.player = createGameObject(scene, 72, 124, 12, 10, "./assets/PlayerSP.png")

    for(let x = 0; x < 8; x++) {
        for(let y = 0; y < 4; y++) {
            state.objects[String(x) + String(y) + "enemy"] = createGameObject(scene, (x + 1.2) * 16, (y + 1) * 16, 9, 8, "./assets/EnemyFrame1.png")
            state.enemies.push(String(x) + String(y) + "enemy")
        }
    }

    state.inputs["a"] = () => {
        if(!(state.objects.player.getX() - 1 <= 0)) {
            state.objects.player.setX(state.objects.player.getX() - PLAYER_SPD)
        } else { state.objects.player.setX(0) }
    }

    state.inputs["d"] = () => {
        if(!(state.objects.player.getX() + state.objects.player.getWidth() + 1 >= 160)) {
            state.objects.player.setX(state.objects.player.getX() + PLAYER_SPD)
        } else { state.objects.player.setX(160 - state.objects.player.getWidth()) }
    }

    state.inputs["o"] = () => {
        if(canShoot) {
            state.objects.shoot = createGameObject(scene, state.objects.player.getX() + 5, state.objects.player.getY(), 2, 8, "./assets/Shoot.png")
            canShoot = false
        }
    }

    function update() {
        if(state.objects.shoot) {
            state.objects.shoot.setY(state.objects.shoot.getY() - SHOOT_SPD)

            if(state.objects.shoot.getY() <= -4) {
                state.objects.shoot.remove()
                state.objects.shoot = undefined
                canShoot = true

                return
            }

            for(const enemy of state.enemies) {
                if(state.objects.shoot.intersects(state.objects[enemy])) {
                    state.objects[enemy].remove()
                    state.objects[enemy] = undefined

                    state.enemies.splice(state.enemies.indexOf(enemy), 1)

                    state.objects.shoot.remove()
                    state.objects.shoot = undefined

                    canShoot = true

                    return true
                }
            }
        }
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