import createScene from "src/createScene.js"
import createCamera from "src/createCamera.js"
import createLight from "src/createLight.js"
import createComposer from "src/createComposer.js"
import createGameBoy from "src/createGameBoy.js"

const inOut = (t, cur, target) => ((Math.sin((t) - Math.PI / 2) + 1) * (target - cur) / 2) + cur
const toRad = (deg) => deg * (Math.PI / 180)

const INTENSITY = 7.0
const DISTANCE = 10.0
const ANGLE = 0.7
const PENUMBRA = 0.3
const DECAY = 0.1

const scene = createScene()
const camera = createCamera(scene.renderer)
camera.disable()
const light = createLight(scene, INTENSITY, DISTANCE, ANGLE, PENUMBRA, DECAY)
const composer = createComposer(scene, camera.instance)

createGameBoy(scene, "./assets/gameboy.glb", ["Arrows", "A", "B"], camera)

let canInput = true

function render() {	
    light.followCamera(camera.instance)

    camera.update()

	scene.render(camera.instance)
    requestAnimationFrame(render)
    composer.render()
}

render()

const animationInterval = {
    "a": [null, false],
    "b": [null, false],
    "Enter": [null, false],
    "Shift": [null, false],
    "ArrowHor": [null, false],
    "ArrowVer": [null, false]
}

function setSmoothPos (x, y, z, after) {
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

function objectAnimation(obj, dt, key, offset, after=() => {}) {
    let time = 0

    animationInterval[key][0] = setInterval(() => {
        obj.position.setX(inOut(time, obj.position.x, obj.position.x + offset))
        
        time += 0.02

        if(time >= 1) {
            clearInterval(animationInterval[key][0])
            animationInterval[key][0] = null
            after()

            time = 0
        }
    }, dt)
}

function objectAnimationArrow(obj, dir, offset, after=() => {}) {
    let time = 0

    animationInterval[dir][0] = setInterval(() => {
        if(dir === "ArrowHor") {
            obj.rotation.y = inOut(time, obj.rotation.y, obj.rotation.y + toRad(offset))
        } else {
            obj.rotation.z = inOut(time, obj.rotation.z, obj.rotation.z + toRad(offset))
        }
        time += 0.05

        if(time >= 1) {
            clearInterval(animationInterval[dir][0])
            animationInterval[dir][0] = null
            after()

            time = 0
        }
    }, 10)
}

const animateObject = {
    down: (name, key, dt, offset) => {
        const obj = scene.instance.getObjectByName(name)

        if(!animationInterval[key][0] && !animationInterval[key][1]) {
            animationInterval[key][1] = true
            objectAnimation(obj, dt, key, -offset, () => {
                if(!animationInterval[key][1]) {
                    objectAnimation(obj, dt, key, offset)
                }
            })
        }
    },
    up: (name, key, dt, offset) => {
        const obj = scene.instance.getObjectByName(name)

        const old = animationInterval[key][1]

        animationInterval[key][1] = false

        if(!animationInterval[key][0] && old) {
            objectAnimation(obj, dt, key, offset)
        }
    },
    arrowDown: (dir, angleDir = 1) => {
        const obj = scene.instance.getObjectByName("Arrows")

        if(!animationInterval[dir][0] && !animationInterval[dir][1]) {
            animationInterval[dir][1] = true
            objectAnimationArrow(obj, dir, angleDir * 7, () => {
                if(!animationInterval[dir][1]) {
                    objectAnimationArrow(obj, dir, angleDir * (-7))
                }
            })
        }
    },
    arrowUp: (dir, angleDir = 1) => {
        const obj = scene.instance.getObjectByName("Arrows")

        const old = animationInterval[dir][1]

        animationInterval[dir][1] = false

        if(!animationInterval[dir][0] && old) {
            objectAnimationArrow(obj, dir, angleDir * (-7))
        }
    }
}

const keyDown = {
    "a": () => { animateObject.down("A", "a", 6, 0.01) },
    "b": () => { animateObject.down("B", "b", 6, 0.01) },
    "Enter": () => { animateObject.down("Start", "Enter", 6, 0.005) },
    "Shift": () => { animateObject.down("Select", "Shift", 6, 0.005) },
    "ArrowRight": () => { animateObject.arrowDown("ArrowHor") },
    "ArrowLeft": () => { animateObject.arrowDown("ArrowHor", -1) },
    "ArrowUp": () => { animateObject.arrowDown("ArrowVer") },
    "ArrowDown": () => { animateObject.arrowDown("ArrowVer", -1) },
    "v": () => {
        canInput = false

        camera.disable()

        setSmoothPos(3.5, 0, 0, () => {
            light.setAngle(ANGLE)
            setSmoothPos(3.5, 0, 0, () => {
                camera.enable()

                canInput = true
            })
        })
    }
}

const keyUp = {
    "a": () => { animateObject.up("A", "a", 6, 0.01) },
    "b": () => { animateObject.up("B", "b", 6, 0.01) },
    "Enter": () => { animateObject.up("Start", "Enter", 6, 0.005) },
    "Shift": () => { animateObject.up("Select", "Shift", 6, 0.005) },
    "ArrowRight": () => { animateObject.arrowUp("ArrowHor") },
    "ArrowLeft": () => { animateObject.arrowUp("ArrowHor", -1) },
    "ArrowUp": () => { animateObject.arrowUp("ArrowVer") },
    "ArrowDown": () => { animateObject.arrowUp("ArrowVer", -1) },
}

for(const key in keyUp) {
    document.getElementById(key)?.addEventListener("mousedown", () => { keyDown[key]() })
    document.getElementById(key)?.addEventListener("mouseup", () => { keyUp[key]() })
}

window.addEventListener("keydown", (e) => { if(keyDown[e.key] && canInput) keyDown[e.key]() })
window.addEventListener("keyup", (e) => { if(keyUp[e.key] && canInput) keyUp[e.key]() })
window.addEventListener("resize", () => {
    camera.setAspect(window.innerWidth / window.innerHeight)
    camera.updateProjectionMatrix()
    scene.renderer.setSize(window.innerWidth, window.innerHeight)
})