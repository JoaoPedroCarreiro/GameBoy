import * as Constants from "constants"

function convertX(x) {
    return (1 - (x / Constants.GAMEBOY_WIDTH * 2)) * Constants.WIDTH / 2
}

function convertY(y) {
    return (1 - (y / Constants.GAMEBOY_HEIGHT * 2)) * Constants.HEIGHT / 2
}

function convertWidth(width) {
    return width * Constants.WIDTH / Constants.GAMEBOY_WIDTH
}

function convertHeight(height) {
    return height * Constants.HEIGHT / Constants.GAMEBOY_HEIGHT
}

export {
    convertX,
    convertY,
    convertWidth,
    convertHeight
}