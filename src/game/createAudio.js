import * as Three from "three"

export default async function createAudio(listener, src, loop = false, volume = 0.5) {
    const sound = new Three.Audio(listener)

    const audioLoader = new Three.AudioLoader()
    const buffer = await audioLoader.loadAsync(src, buffer => buffer)

    sound.setBuffer(buffer)
    sound.setLoop(loop)
    sound.setVolume(volume)

    function play() {
        sound.play()
    }

    function stop() {
        sound.stop()
    }

    function remove() {
        sound.remove()
    }

    return {
        play,
        stop,
        remove,
        src
    }
}