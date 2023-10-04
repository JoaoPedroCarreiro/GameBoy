import createGameObject from "game/createGameObject.js"

const shootAnimations = [
    [["./assets/Shoot1Frame1.png", "./assets/Shoot1Frame2.png", "./assets/Shoot1Frame3.png", "./assets/Shoot1Frame4.png", "./assets/Shoot1Frame5.png", "./assets/Shoot1Frame6.png", "./assets/Shoot1Frame7.png", "./assets/Shoot1Frame8.png"], 175],
    [["./assets/Shoot2Frame1.png", "./assets/Shoot2Frame2.png", "./assets/Shoot2Frame3.png"], 250],
    [["./assets/Shoot3Frame1.png", "./assets/Shoot3Frame2.png", "./assets/Shoot3Frame3.png"], 250]
]

export default function createSpaceInvaders(scene) {
    const state = {
        objects: {},
        enemies: [],
        inputs: {}
    }

    const getEnemyRightLine = (n) => {
        let right = ""

        for(let i = 0; i < 8; i++) {
            if(state.enemies.includes(`${7 - i}${n}enemy`)) {
                right = `${7 - i}${n}enemy`
                break
            }
        }

        return right
    }

    const getEnemyRight = () => {
        const rights = []
        const indexes = [-1, -1, -1, -1]

        for(let i = 0; i < 5; i++) {
            if(!getEnemyRightLine(i)) continue

            rights[i] = getEnemyRightLine(i)
            indexes[i] = getEnemyRightLine(i)[0]
        }

        const max = Math.max(indexes[0], indexes[1], indexes[2], indexes[3])

        return rights[indexes.indexOf(String(max))]
    }

    const getEnemyLeftLine = (n) => {
        let left = ""

        for(let i = 0; i < 8; i++) {
            if(state.enemies.includes(`${i}${n}enemy`)) {
                left = `${i}${n}enemy`
                break
            }
        }

        return left
    }

    const getEnemyLeft = () => {
        const lefts = []
        const indexes = [5, 5, 5, 5]

        for(let i = 0; i < 5; i++) {
            if(!getEnemyLeftLine(i)) continue

            lefts[i] = getEnemyLeftLine(i)
            indexes[i] = getEnemyLeftLine(i)[0]
        }

        const min = Math.min(indexes[0], indexes[1], indexes[2], indexes[3])

        return lefts[indexes.indexOf(String(min))]
    }

    const PLAYER_SPD = 3.0
    const SHOOT_SPD = 2.7

    const WALLS_POSITIONS = [[14, 100], [64.5, 100], [114, 100]]

    let canShoot = true

    state.objects.player = createGameObject(scene, 76.5, 132, 9, 7, "./assets/Player.png")

    for(let x = 0; x < 8; x++) {
        state.objects[String(x) + "0enemy"] = createGameObject(scene, (x + 1.2) * 16, 16, 9, 8, "./assets/Enemy0Frame1.png")
        state.enemies.push(String(x) + "0enemy")
    }

    for(let x = 0; x < 8; x++) {
        for(let y = 1; y < 5; y++) {
            state.objects[String(x) + String(y) + "enemy"] = createGameObject(scene, (x + 1.2) * 16, (y + 1) * 13, 9, 8, `./assets/Enemy${Math.round(y / 2)}Frame1.png`)
            state.enemies.push(String(x) + String(y) + "enemy")
        }
    }

    for(let i = 0; i < WALLS_POSITIONS.length; i++) {
        state.objects[`wall${i}1`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 0, WALLS_POSITIONS[i][1] + 0, 13, 13, `./assets/wall1.png`)
        state.objects[`wall${i}2`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 0, WALLS_POSITIONS[i][1] + 9, 13, 13, `./assets/wall2.png`)
        state.objects[`wall${i}3`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 9, WALLS_POSITIONS[i][1] + 0, 15, 12, `./assets/wall3.png`)
        state.objects[`wall${i}4`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 8, WALLS_POSITIONS[i][1] + 9, 16, 13, `./assets/wall4.png`)
        state.objects[`wall${i}5`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 19, WALLS_POSITIONS[i][1] + 0, 13, 12, `./assets/wall5.png`)
        state.objects[`wall${i}6`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 19, WALLS_POSITIONS[i][1] + 9, 13, 13, `./assets/wall6.png`)
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
            state.objects.shoot = createGameObject(scene, state.objects.player.getX() + 3.5, state.objects.player.getY(), 2, 8, "./assets/Shoot.png")
            canShoot = false
        }
    }
    
    let timeSpeed = 75

    let timer = 0
    let enemyDir = 1

    let shootChance = 0.005
    let shootId = 0

    const moveEnemy = (n, i) => {
        if(state.objects[`${n}${i}enemy`]) {
            state.objects[`${n}${i}enemy`].setX(state.objects[`${n}${i}enemy`].getX() + (4 * enemyDir))
            if(state.objects[`${n}${i}enemy`].getTexture() === `./assets/Enemy${state.objects[`${n}${i}enemy`].getTexture().split("./assets/Enemy")[1][0]}Frame1.png`) { 
                state.objects[`${n}${i}enemy`].setTexture(`./assets/Enemy${state.objects[`${n}${i}enemy`].getTexture().split("./assets/Enemy")[1][0]}Frame2.png`)
            } else {
                state.objects[`${n}${i}enemy`].setTexture(`./assets/Enemy${state.objects[`${n}${i}enemy`].getTexture().split("./assets/Enemy")[1][0]}Frame1.png`)
            }

            if(Number(Math.random().toFixed(3)) <= shootChance) {
                const rand = Math.floor(Math.random() * 3)

                state.objects[`${shootId}enshoot`] = createGameObject(scene, state.objects[`${n}${i}enemy`].getX() + 5, state.objects[`${n}${i}enemy`].getY(), 3, 8, `./assets/Shoot${rand + 1}Frame1.png`)
                shootId++
                
                state.objects[`${shootId - 1}enshoot`].animate(shootAnimations[rand][0], shootAnimations[rand][1])
            }
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

            for(let n = 1; n <= 6; n++) {
                for(let i = 0; i < WALLS_POSITIONS.length; i++) {
                    if(state.objects[`wall${i}${n}`]) {
                        if(state.objects[`wall${i}${n}`].intersects(state.objects.shoot)) {
                            state.objects.shoot.remove()
                            state.objects.shoot = undefined
        
                            state.objects[`wall${i}${n}`].remove()
                            state.objects[`wall${i}${n}`] = undefined
        
                            canShoot = true
        
                            return
                        }
                    }
                }
            }

            for(const enemy of state.enemies) {
                if(state.objects.shoot.intersects(state.objects[enemy])) {
                    const x = state.objects[enemy].getX()
                    const y = state.objects[enemy].getY()

                    state.objects[enemy].remove()
                    state.objects[enemy] = undefined

                    state.enemies.splice(state.enemies.indexOf(enemy), 1)

                    state.objects.shoot.remove()
                    state.objects.shoot = undefined

                    canShoot = true

                    const explosion = createGameObject(scene, x, y, 9, 8, "./assets/EnemyExplosion.png")
                    setTimeout(() => {
                        explosion.remove()
                    }, 300)

                    return true
                }
            }
        }

        timer++

        if(timer >= timeSpeed) {
            for(let n = 0; n < 8; n++) {
                
                moveEnemy(n, 4)
                setTimeout(() => moveEnemy(n, 3), 100)
                setTimeout(() => moveEnemy(n, 2), 200)
                setTimeout(() => moveEnemy(n, 1), 300)
                setTimeout(() => {
                    moveEnemy(n, 0)

                    setTimeout(() => {
                        if(state.objects[getEnemyRight()].getX() >= 140 && enemyDir === 1) {
                            enemyDir = -1
                            timeSpeed -= 0.1 * timeSpeed
                            shootChance += 0.005
                            for(const enemy of state.enemies) {
                                state.objects[enemy].setY(state.objects[enemy].getY() + 4)
                            }
                        }
    
                        if(state.objects[getEnemyLeft()].getX() <= 10 && enemyDir === -1) {
                            enemyDir = 1
                            timeSpeed -= 0.1 * timeSpeed
                            shootChance += 0.005
                            for(const enemy of state.enemies) {
                                state.objects[enemy].setY(state.objects[enemy].getY() + 4)
                            }
                        }
                    }, 400)
                }, 400)
                

                timer = 0
            }
        }

        for(const object in state.objects) {
            if(object.includes("enshoot")) {
                if(!state.objects[object]) continue

                state.objects[object].setY(state.objects[object].getY() + 1.3)

                if(state.objects[object].getY() >= 144) {
                    state.objects[object].remove()
                    state.objects[object] = undefined

                    continue
                }

                if(state.objects.player.intersects(state.objects[object])) {
                    state.objects[object].remove()
                    state.objects[object] = undefined

                    state.objects.player.remove()
                    state.objects.player = undefined

                    continue
                }

                if(state.objects.shoot) {
                    if(state.objects.shoot.intersects(state.objects[object])) {
                        const x = state.objects[object].getX()
                        const y = state.objects[object].getY()

                        state.objects[object].remove()
                        state.objects[object] = undefined
    
                        state.objects.shoot.remove()
                        state.objects.shoot = undefined

                        canShoot = true

                        const explosion = createGameObject(scene, x, y, 9, 8, "./assets/ShootCollision.png")
                        setTimeout(() => {
                            explosion.remove()
                        }, 500)
                    }

                    continue
                }

                for(let n = 1; n <= 6; n++) {
                    for(let i = 0; i < WALLS_POSITIONS.length; i++) {
                        if(state.objects[`wall${i}${n}`]) {
                            if(state.objects[`wall${i}${n}`].intersects(state.objects[object])) {
                                state.objects[object].remove()
                                state.objects[object] = undefined
            
                                state.objects[`wall${i}${n}`].remove()
                                state.objects[`wall${i}${n}`] = undefined
            
                                canShoot = true
            
                                return
                            }
                        }
                    }
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