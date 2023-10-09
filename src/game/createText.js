import * as Three from "three"

import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"

import * as Converter from "src/converters.js"

import * as Constants from "constants"

export default async function createText(scene, text, size, x, y, positioning = "top-left") {
    const fontLoader = new FontLoader()

    const loader = new TTFLoader()
    const json = await loader.loadAsync("assets/PixeloidSans.ttf", json => json)

    const font = fontLoader.parse(json)

    const geometry = new TextGeometry(text, {
        height: 0.0005,
        size: Converter.convertHeight(size),
        font: font,
    })

    const material = new Three.MeshBasicMaterial({ color: 0x0f380f })
    const obj = new Three.Mesh(geometry, material)

    obj.geometry.computeBoundingSphere()

    const point = {
        "top-left": [
            Constants.OFFSET_Y + Converter.convertY(y) - Converter.convertHeight(size) - (0.08 * Converter.convertHeight(size)),
            Constants.OFFSET_Z + Converter.convertX(x)
        ],
        "center": [
            Constants.OFFSET_Y + Converter.convertY(y) - Converter.convertHeight(size) - (0.08 * Converter.convertHeight(size)) + Converter.convertHeight(size) / 2,
            Constants.OFFSET_Z + Converter.convertX(x) + obj.geometry.boundingSphere.radius
        ]
    }

    obj.position.set((Constants.SCREEN_DEPTH / 2) + Constants.OFFSET_X, point[positioning][0], point[positioning][1])
    obj.rotation.y = Math.PI / 2

    scene.add(obj)

    function remove() {
        scene.remove(obj)
    }

    return {
        remove
    }
}