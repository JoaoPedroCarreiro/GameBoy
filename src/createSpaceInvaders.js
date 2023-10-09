import createGameObject from "game/createGameObject.js"
import createText from "game/createText.js"
import createAudio from "game/createAudio.js"

const shootAnimations = [
    [["./assets/Shoot1Frame1.png", "./assets/Shoot1Frame2.png", "./assets/Shoot1Frame3.png", "./assets/Shoot1Frame4.png", "./assets/Shoot1Frame5.png", "./assets/Shoot1Frame6.png", "./assets/Shoot1Frame7.png", "./assets/Shoot1Frame8.png"], 175],
    [["./assets/Shoot2Frame1.png", "./assets/Shoot2Frame2.png", "./assets/Shoot2Frame3.png"], 250],
    [["./assets/Shoot3Frame1.png", "./assets/Shoot3Frame2.png", "./assets/Shoot3Frame3.png"], 250]
]

function numberToScoreFormat(n) {
    if(n >= 99999) return "99999"

    const arr = Array.from(String(n))

    for(let i = arr.length; i < 5; i++) {
        arr.unshift("0")
    }

    return String(arr.join(" "))
}

export default function createSpaceInvaders(scene, listener) {
    // STATE, CONSTANTS AND VARIABLES
    const state = {
        objects: {},
        enemies: [],
        inputs: {},
        inputsUp: {},
        highScore: 1000,
        update: () => {},
        finish: () => {}
    }

    const PLAYER_SPD = 1.5
    const SHOOT_SPD = 2.7

    const WALLS_POSITIONS = [[14, 100], [64.5, 100], [114, 100]]

    let canShoot = true
    let playerMoveLeft = 0
    let playerMoveRight = 0
    
    let timeSpeed = 60

    let timer = 0
    let enemyDir = 1

    let shootChance = 0.005
    let shootId = 0

    let curTickSound = 1

    let tick = undefined

    let score = 0
    let round = 1

    function getEnemyRightLine(n) {
        let right = ""
    
        for(let i = 0; i < 8; i++) {
            if(state.enemies.includes(`${7 - i}${n}enemy`)) {
                right = `${7 - i}${n}enemy`
                break
            }
        }
    
        return right
    }
    
    function getEnemyRight() {
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
    
    function getEnemyLeftLine(n) {
        let left = ""
    
        for(let i = 0; i < 8; i++) {
            if(state.enemies.includes(`${i}${n}enemy`)) {
                left = `${i}${n}enemy`
                break
            }
        }
    
        return left
    }
    
    function getEnemyLeft() {
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

    const moveEnemy = (n, i) => {
        if(state.objects[`${n}${i}enemy`]) {
            // ANIMATE ENEMY
            state.objects[`${n}${i}enemy`].setX(state.objects[`${n}${i}enemy`].getX() + (2 * enemyDir))
            if(state.objects[`${n}${i}enemy`].getTexture() === `./assets/Enemy${state.objects[`${n}${i}enemy`].getTexture().split("./assets/Enemy")[1][0]}Frame1.png`) { 
                state.objects[`${n}${i}enemy`].setTexture(`./assets/Enemy${state.objects[`${n}${i}enemy`].getTexture().split("./assets/Enemy")[1][0]}Frame2.png`)
            } else {
                state.objects[`${n}${i}enemy`].setTexture(`./assets/Enemy${state.objects[`${n}${i}enemy`].getTexture().split("./assets/Enemy")[1][0]}Frame1.png`)
            }

            // DO ENEMY SHOOT
            if(Number(Math.random().toFixed(3)) <= shootChance) {
                const rand = Math.floor(Math.random() * 3)

                state.objects[`${shootId}enshoot`] = createGameObject(scene, state.objects[`${n}${i}enemy`].getX() + 5, state.objects[`${n}${i}enemy`].getY(), 3, 8, `./assets/Shoot${rand + 1}Frame1.png`)
                shootId++
                
                state.objects[`${shootId - 1}enshoot`].animate(shootAnimations[rand][0], shootAnimations[rand][1])
            }
        }
    }

    // MENU VARIABLES
    state.objects.logo = createGameObject(scene, 66, -40, 28, 34, `./assets/logo.png`)
    state.objects.name = createGameObject(scene, 8.5, 144, 143, 61, `./assets/name.png`)

    let initMenu = false
    let logoAudioPlayed = false

    let startInterval = null

    function menu() {
        
    }

    function init() {
        // INIT MENU
        if(initMenu) {
            if(state.objects.name.getY() >= 17) {
                state.objects.name.setY(state.objects.name.getY() - 1)
            } else {
                state.objects.highScoreValue = createText(scene, numberToScoreFormat(state.highScore), 5, 110, 3)
                state.objects.highScore = createText(scene, "H I - S C O R E", 5, 20, 3)
                state.objects.cr = createText(scene, "©   C H E R R Y   2 0 2 3", 5, 80, 126, "center")
                state.objects.licensed = createText(scene, "L I C E N S E D   T O   C H E R R Y", 5, 80, 138, "center")
                state.objects.start = createText(scene, "P U S H   S T A R T", 5, 80, 84, "center")

                // MAKE PUSH START TEXT BLINK
                setTimeout(() => {
                    state.objects.start.then(text => text.remove())
                    state.objects.start = undefined
                    startInterval = setInterval(() => {
                        state.objects.start.then(text => text.remove())
                        state.objects.start = undefined
                        setTimeout(() => {
                            if(startInterval) {
                                state.objects.start = createText(scene, "P U S H   S T A R T", 5, 80, 84, "center")
                            }
                        }, 550)
                    }, 1300)
                    setTimeout(() => {
                        if(startInterval) {
                            state.objects.start = createText(scene, "P U S H   S T A R T", 5, 80, 84, "center")
                        }
                    }, 550)
                }, 750)

                // CHANGE TO MENU TICK
                tick = menu
            }

            return 
        }

        // INIT CHERRY LOGO
        if(state.objects.logo.getY() <= 55) {
            state.objects.logo.setY(state.objects.logo.getY() + 0.5)
        } else {
            if(!logoAudioPlayed) {
                createAudio(listener, "assets/logoSound.mp3").then(sound => {
                    sound.play()
                    logoAudioPlayed = true
                })
                setTimeout(() => {
                    state.objects.logo.remove()
                    setTimeout(() => {
                        initMenu = true
                    }, 750)
                }, 750)
            }
        }
    }

    // GAME TICK
    function updateGame(initGame) {
        // PLAYER COLLISION WITH MAP BORDERS
        if(!(state.objects.player.getX() + playerMoveLeft <= 0)) {
            state.objects.player.setX(state.objects.player.getX() + playerMoveLeft)
        } else { state.objects.player.setX(0) }

        if(!(state.objects.player.getX() + state.objects.player.getWidth() + playerMoveRight >= 160)) {
            state.objects.player.setX(state.objects.player.getX() + playerMoveRight)
        } else { state.objects.player.setX(160 - state.objects.player.getWidth()) }

        if(state.objects.shoot) {
            // MOVE PLAYER SHOOT
            state.objects.shoot.setY(state.objects.shoot.getY() - SHOOT_SPD)

            // REMOVE SHOOT WHEN OUTSIDE MAP
            if(state.objects.shoot.getY() <= -4) {
                state.objects.shoot.remove()
                state.objects.shoot = undefined
                canShoot = true

                return
            }

            // SHOOT COLLISION WITH WALLS
            for(let n = 1; n <= 6; n++) {
                for(let i = 0; i < WALLS_POSITIONS.length; i++) {
                    if(state.objects[`wall${i}${n}`]) {
                        if(state.objects[`wall${i}${n}`].intersects(state.objects.shoot)) {
                            const x = state.objects[`wall${i}${n}`].getX()
                            const y = state.objects[`wall${i}${n}`].getY()

                            state.objects.shoot.remove()
                            state.objects.shoot = undefined
        
                            state.objects[`wall${i}${n}`].remove()
                            state.objects[`wall${i}${n}`] = undefined
        
                            canShoot = true

                            const explosion = createGameObject(scene, x, y, 9, 8, "./assets/ShootCollision.png")
                            setTimeout(() => {
                                explosion.remove()
                            }, 500)
        
                            return
                        }
                    }
                }
            }

            // SHOOT COLLISION WITH ENEMIES
            for(const enemy of state.enemies) {
                if(state.objects.shoot.intersects(state.objects[enemy])) {
                    score += 30 - (Math.round((Number(enemy[1])) / 2) * 10)

                    state.objects.score.then(text => text.remove())
                    state.objects.score = undefined

                    state.objects.score = createText(scene, `S C O R E    ${numberToScoreFormat(score)}`, 5, 20, 3)

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

        if(state.enemies.length === 0) {
            round++

            canShoot = true
            playerMoveLeft = 0
            playerMoveRight = 0
            
            timeSpeed = 60
        
            timer = 0
            enemyDir = 1
        
            shootChance = 0.005
            shootId = 0
        
            curTickSound = 1

            tick = menu

            initGame()
        }

        // TIMER TO MOVE ENEMIES
        timer++

        if(timer >= timeSpeed) {
            createAudio(listener, `assets/tick${curTickSound}.mp3`).then(sound => {
                setTimeout(() => sound.play(), 200)

                curTickSound++

                if(curTickSound === 5) {
                    curTickSound = 1
                }
            })

            for(let n = 0; n < 8; n++) {
                
                moveEnemy(n, 4)
                setTimeout(() => moveEnemy(n, 3), 100)
                setTimeout(() => moveEnemy(n, 2), 200)
                setTimeout(() => moveEnemy(n, 1), 300)
                setTimeout(() => {
                    moveEnemy(n, 0)

                    setTimeout(() => {
                        if(state.enemies.length === 0) return

                        // WHEN EXTREME RIGHT HITS BORDER INVERT DIRECTION, DOWN ENEMIES AND INCREASE SPEED AND SHOOT CHANCE
                        if(state.objects[getEnemyRight()].getX() >= 140 && enemyDir === 1) {
                            enemyDir = -1
                            timeSpeed -= 0.15 * timeSpeed
                            shootChance += 0.0025
                            for(const enemy of state.enemies) {
                                state.objects[enemy].setY(state.objects[enemy].getY() + 6)
                            }
                        }
                        
                        // WHEN EXTREME LEFT HITS BORDER INVERT DIRECTION, DOWN ENEMIES AND INCREASE SPEED AND SHOOT CHANCE
                        if(state.objects[getEnemyLeft()].getX() <= 10 && enemyDir === -1) {
                            enemyDir = 1
                            timeSpeed -= 0.15 * timeSpeed
                            shootChance += 0.0025
                            for(const enemy of state.enemies) {
                                state.objects[enemy].setY(state.objects[enemy].getY() + 6)
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

                // MOVE ENEMY SHOOTS
                state.objects[object].setY(state.objects[object].getY() + 1.3)

                // REMOVE ENEMY SHOOTS WHEN OUTSIDE MAP
                if(state.objects[object].getY() >= 144) {
                    state.objects[object].remove()
                    state.objects[object] = undefined

                    continue
                }

                // KILL PLAYER WHEN SHOOT HITS
                if(state.objects.player.intersects(state.objects[object])) {
                    state.objects[object].remove()
                    state.objects[object] = undefined

                    state.objects.player.remove()
                    state.objects.player = undefined

                    continue
                }

                // ENEMY SHOOTS AND PLAYER SHOOTS DESTROYING THEMSELVES WHEN COLLIDES
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

                // ENEMY SHOOTS DESTROYS WALLS
                for(let n = 1; n <= 6; n++) {
                    for(let i = 0; i < WALLS_POSITIONS.length; i++) {
                        if(state.objects[`wall${i}${n}`]) {
                            if(state.objects[`wall${i}${n}`].intersects(state.objects[object])) {
                                const x = state.objects[`wall${i}${n}`].getX()
                                const y = state.objects[`wall${i}${n}`].getY()

                                state.objects[object].remove()
                                state.objects[object] = undefined
            
                                state.objects[`wall${i}${n}`].remove()
                                state.objects[`wall${i}${n}`] = undefined
            
                                canShoot = true

                                const explosion = createGameObject(scene, x, y, 9, 8, "./assets/ShootCollision.png")
                                setTimeout(() => {
                                    explosion.remove()
                                }, 500)
            
                                return
                            }
                        }
                    }
                }
            }
        }
    }
    
    tick = init

    function initGame() {
        // FINISH ALL OBJECTS
        clearInterval(startInterval)
        startInterval = null

        for(const obj in state.objects) {
            if(state.objects[obj]) {
                try {
                    state.objects[obj].remove()
                } catch (error) {
                    state.objects[obj].then(object => {
                        object.remove()
                    })
                }
            }
        }
        state.objects = {}

        state.objects.round = createText(scene, "R O U N D", 5, 80, 54, "center")
        state.objects.score = createText(scene, `${round}`, 5, 80, 54 + 8, "center")
        state.objects.ready = createText(scene, "R E A D Y !", 5, 80, 54 + 20, "center")

        setTimeout(() => {
            state.objects.round.then(object => object.remove())
            state.objects.round = undefined
            state.objects.score.then(object => object.remove())
            state.objects.score = undefined
            state.objects.ready.then(object => object.remove())
            state.objects.ready = undefined

            //CREATE PLAYER ENEMIES AND WALLS
            state.objects.player = createGameObject(scene, 75.5, 132, 9, 7, "./assets/Player.png") //76.5,

            for(let x = 0; x < 1; x++) {
                state.objects[String(x) + "0enemy"] = createGameObject(scene, (x + 1.6) * 15, 21, 7, 6, "./assets/Enemy0Frame1.png")
                state.enemies.push(String(x) + "0enemy")
            }

            // for(let x = 0; x < 8; x++) {
            //     for(let y = 1; y < 5; y++) {
            //         state.objects[String(x) + String(y) + "enemy"] = createGameObject(scene, (x + 1.6) * 15, 21 + (y * 7.6), 7, 6, `./assets/Enemy${Math.round(y / 2)}Frame1.png`)
            //         state.enemies.push(String(x) + String(y) + "enemy")
            //     }
            // }

            for(let i = 0; i < WALLS_POSITIONS.length; i++) {
                state.objects[`wall${i}1`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 0, WALLS_POSITIONS[i][1] + 0, 13, 13, `./assets/wall1.png`)
                state.objects[`wall${i}2`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 0, WALLS_POSITIONS[i][1] + 9, 13, 13, `./assets/wall2.png`)
                state.objects[`wall${i}3`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 9, WALLS_POSITIONS[i][1] + 0, 15, 12, `./assets/wall3.png`)
                state.objects[`wall${i}4`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 8, WALLS_POSITIONS[i][1] + 9, 16, 13, `./assets/wall4.png`)
                state.objects[`wall${i}5`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 19, WALLS_POSITIONS[i][1] + 0, 13, 12, `./assets/wall5.png`)
                state.objects[`wall${i}6`] = createGameObject(scene, WALLS_POSITIONS[i][0] + 19, WALLS_POSITIONS[i][1] + 9, 13, 13, `./assets/wall6.png`)
            }

            state.objects.score = createText(scene, `S C O R E    ${numberToScoreFormat(score)}`, 5, 20, 3)

            // KEYBOARD INPUTS
            state.inputs["a"] = () => playerMoveLeft = -PLAYER_SPD
            state.inputs["d"] = () => playerMoveRight = PLAYER_SPD
            state.inputsUp["a"] = () => playerMoveLeft = 0
            state.inputsUp["d"] = () => playerMoveRight = 0
            state.inputs["o"] = () => {
                if(canShoot) {
                    state.objects.shoot = createGameObject(scene, state.objects.player.getX() + 4, state.objects.player.getY(), 1, 8, "./assets/Shoot.png")
                    canShoot = false
                }
            }

            // CHANGE TICK TO GAME TICK
            tick = updateGame
        }, 1500)
    }

    state.update = () => {
        tick(initGame)
    }

    // GAME INITIALIZATION
    state.inputs["b"] = () => {
        initGame()
    }

    state.finish = () => {
        // DESTROY ALL OBJECTS
        for(const obj in state.objects) {
            state.objects[obj].remove()
        }
        state.objects = {}
    }

    return {
        ...state
    }
}