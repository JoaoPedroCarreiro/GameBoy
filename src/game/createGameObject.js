import * as Three from "three"

import * as Converter from "src/converters.js"

import * as Constants from "constants"

export default function createGameObject(scene, x, y, width, height, src) {
    const state = {
        x: x,
        y: y,
        width: width,
        height: height,
        src: src,
        interval: undefined
    }

    const texture = new Three.TextureLoader().load(src)
    texture.colorSpace = Three.SRGBColorSpace
    texture.minFilter = Three.NearestFilter
    texture.magFilter = Three.NearestFilter
    texture.generateMipmaps = false

    const geometry = new Three.BoxGeometry(0.0005, Converter.convertHeight(height), Converter.convertWidth(width))
    const material = new Three.MeshBasicMaterial({ map: texture, transparent: true }) //CHANGE TO STANDARD
    const obj = new Three.Mesh(geometry, material)
    
    obj.position.set(
        (Constants.SCREEN_DEPTH / 2) + Constants.OFFSET_X,
        Converter.convertY(y) - (Converter.convertHeight(height) / 2) + Constants.OFFSET_Y,
        Converter.convertX(x) - (Converter.convertWidth(width) / 2) + Constants.OFFSET_Z
    )

    scene.add(obj)

    function getX() {
        return state.x
    }

    function getY() {
        return state.y
    }

    function getWidth() {
        return state.width
    }

    function getHeight() {
        return state.height
    }

    function setX(newX) {
        obj.position.z = Converter.convertX(newX) - (Converter.convertWidth(width) / 2) + Constants.OFFSET_Z
        state.x = newX
    }

    function setY(newY) {
        obj.position.y = Converter.convertY(newY) - (Converter.convertHeight(height) / 2) + Constants.OFFSET_Y
        state.y = newY
    }

    function setTexture(newTexture) {
        const newText = new Three.TextureLoader().load(newTexture)
        newText.colorSpace = Three.SRGBColorSpace
        newText.minFilter = Three.NearestFilter
        newText.magFilter = Three.NearestFilter
        newText.generateMipmaps = false

        material.map = newText
        state.src = newTexture
    }

    function getTexture() {
        return state.src
    }

    function intersects(rect) {
        if(state.y + state.height >= rect.getY() && state.y <= rect.getY() + rect.getHeight() &&
           state.x + state.width >= rect.getX() && state.x <= rect.getX() + rect.getWidth()) {
            return true
        }
    }

    function animate(frames, time) {
        let index = 0

        state.interval = setInterval(() => {
            index++

            if(index === frames.length - 1) index = 0

            setTexture(frames[index])
        }, time)
    }

    function remove() {
        scene.remove(obj)
        clearInterval(state.interval)
        state.interval = undefined
    }

    return {
        getX,
        getY,
        getWidth,
        getHeight,
        setX,
        setY,
        setTexture,
        intersects,
        remove,
        getTexture,
        animate
    }
}