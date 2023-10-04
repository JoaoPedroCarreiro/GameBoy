import createScene from "src/createScene.js"
import createCamera from "src/createCamera.js"
import createLight from "src/createLight.js"
import createComposer from "src/createComposer.js"
import createGameBoy from "src/createGameBoy.js"
import createScreen from "src/createScreen.js"
import createSpaceInvaders from "src/createSpaceInvaders.js"
import createTetris from "src/createTetris.js"

const INTENSITY = 7.0
const DISTANCE = 10.0
const ANGLE = 0.7
const PENUMBRA = 0.3
const DECAY = 0.1

const scene = createScene()
const camera = createCamera(scene.renderer)
const light = createLight(scene, INTENSITY, DISTANCE, ANGLE, PENUMBRA, DECAY)
const composer = createComposer(scene, camera.instance, scene.renderer)

const gameboy = createGameBoy(scene, "./assets/gameboy.glb", ["Arrows", "A", "B"])
const screen = createScreen(scene)

// let game = null
let game = createSpaceInvaders(scene)
// let game = createTetris(scene)

let gamemode = false
let canInput = true

function render() {	
    light.followCamera(camera.instance)

    if(!gamemode) camera.update()
    if(game) game.update()

	scene.render(camera.instance)
    requestAnimationFrame(render)
    composer.render()
}

render()

const inOut = (t, cur, target) => ((Math.sin((t) - Math.PI / 2) + 1) * (target - cur) / 2) + cur

const setSmoothPos = (x, y, z, after) => {
    const dt = 13
    const n = Math.max(
        String(x).split(".")[1] ? String(x).split(".")[1].length : 0,
        String(y).split(".")[1] ? String(y).split(".")[1].length : 0,
        String(z).split(".")[1] ? String(z).split(".")[1].length : 0
    )

    let time = 0

    let interval = setInterval(() => {
        if(Number(camera.instance.position.y.toFixed(n)) === y) {
            time = 0

            clearInterval(interval)
            interval = setInterval(() => {
                camera.instance.position.x = inOut(time, camera.instance.position.x, x)
                camera.instance.position.z = inOut(time, camera.instance.position.z, z)

                if(Number(camera.instance.position.x.toFixed(n)) === x && Number(camera.instance.position.z.toFixed(n)) === z) {
                    clearInterval(interval)
                    interval = null
                    
                    if(after) after()

                    return
                }

                time += 0.02
            }, dt)

            return
        }

        camera.instance.position.y = inOut(time, camera.instance.position.y, y)

        time += 0.02
    }, dt)
}

const keyDown = {
    "f": () => {
        if(game) {
            game.finish()
            game = null
        }

        game = createSpaceInvaders(scene)
    },
    "t": () => {
        if(game) {
            game.finish()
            game = null
        }

        game = createTetris(scene)
    },
    "w": () => { game.inputs["w"]() },
    "a": () => { game.inputs["a"]() },
    "s": () => { game.inputs["s"]() },
    "d": () => { game.inputs["d"]() },
    "o": () => { game.inputs["o"]() },
    "ArrowUp": () => { game.inputs["w"]() },
    "ArrowLeft": () => { game.inputs["a"]() },
    "ArrowDown": () => { game.inputs["s"]() },
    "ArrowRight": () => { game.inputs["d"]() },
    "v": () => {
        canInput = false

        camera.disable()

        setSmoothPos(3.5, 0, 0, () => {
            gamemode = false
            light.setAngle(ANGLE)
            setSmoothPos(3.5, 0, 0, () => {
                camera.enable()

                canInput = true
            })
        })
    },
    "g":  () => {
        canInput = false

        camera.disable()

        light.setAngle(1)

        setSmoothPos(3.5, 0, 0, () => {
            if(gamemode) {
                gamemode = false
                light.setAngle(ANGLE)
                camera.enable()

                canInput = true

                return
            }

            gamemode = true
            setSmoothPos(1.03, 0.565, 0, () => {
                canInput = true
            })

            let time = 0
            let interval = setInterval(() => {
                camera.instance.rotation.x = inOut(time, camera.instance.rotation.x, 0)
                camera.instance.rotation.y = inOut(time, camera.instance.rotation.y, Number((Math.PI / 2).toFixed(2)))
                camera.instance.rotation.z = inOut(time, camera.instance.rotation.z, 0)
    
                if(Number(camera.instance.rotation.x.toFixed(1)) === 0 &&
                   Number(camera.instance.rotation.y.toFixed(2)) === Number((Math.PI / 2).toFixed(2)) &&
                   Number(camera.instance.rotation.z.toFixed(1)) === 0) {
                    clearInterval(interval)
                    interval = null

                    return
                }

                time += 0.02
            }, 13)
        })
    }
}

window.addEventListener("keydown", (e) => {
    if(keyDown[e.key] && canInput) keyDown[e.key]()
})

window.addEventListener("resize", () => {
    camera.setAspect(window.innerWidth / window.innerHeight)
    camera.updateProjectionMatrix()
    scene.renderer.setSize(window.innerWidth, window.innerHeight)
})