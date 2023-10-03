import * as Three from "three"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export default function createGameBoy(scene, src, reflectives) {
    (new GLTFLoader()).load(src, obj => {
        for(const node of reflectives) {
            const mesh = obj.scene.getObjectByName(node)
            mesh.material.roughness = 0.5
            mesh.material.metalness = 0.6
        }

        obj.scene.traverse(node => {
            if(node.isMesh) {
                node.castShadow = true
                node.receiveShadow = true
            }
        })

        scene.add(obj.scene)
    })
}