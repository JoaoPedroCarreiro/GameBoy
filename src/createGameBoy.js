import * as Three from "three"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export default function createGameBoy(scene, src, reflectives, camera) {
    (new GLTFLoader()).load(src, obj => {
        obj.scene.position.x = -20

        let interval

        interval = setInterval(() => {
            obj.scene.position.x += 0.2
            obj.scene.rotation.y += 0.02

            if(obj.scene.position.x >= 0) {
                clearInterval(interval)
                interval = setInterval(() => {
                    camera.enable()
                    obj.scene.rotation.y += 0.02
                }, 17)

                const clear = () => {
                    clearInterval(interval)
                    interval = null

                    camera.rotation.removeEventListener("change", clear)
                }

                camera.rotation.addEventListener("change", clear)

                obj.scene.position.x = 0
            }
        }, 17)

        for(const node of reflectives) {
            const mesh = obj.scene.getObjectByName(node)
            mesh.material.roughness = 0.5
            mesh.material.metalness = 0.6
        }

        obj.scene.traverse(node => {
            if(node.name === "Screen") {
                node.material = new Three.MeshStandardMaterial({ color: 0x8bac0f })
            }

            if(node.isMesh) {
                node.castShadow = true
                node.receiveShadow = true
            }
        })

        scene.add(obj.scene)
    })
}