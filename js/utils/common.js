import { tileSize } from '../settings';

export const normalizeAngle = (angle) => {
    while (angle < -Math.PI) {
        angle += 2 * Math.PI;
    }
    while (angle > Math.PI) {
        angle -= 2 * Math.PI;
    }
    return angle;
};

export const isWall = (x, y, map) => {
    const mapX = Math.floor(x / tileSize);
    const mapY = Math.floor(y / tileSize);

    return map[mapY][mapX] === 1;
};

export const createCheckerboardPattern = (size, color1, color2) => {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = size * 2;
    patternCanvas.height = size * 2;
    const patternCtx = patternCanvas.getContext('2d');

    patternCtx.fillStyle = color1;
    patternCtx.fillRect(0, 0, size, size);
    patternCtx.fillRect(size, size, size, size);

    patternCtx.fillStyle = color2;
    patternCtx.fillRect(size, 0, size, size);
    patternCtx.fillRect(0, size, size, size);

    return patternCanvas;
};

// Create a simple brick texture
export const createBrickTexture = () => {
    const textureSize = 32;
    const brickCanvas = document.createElement('canvas');
    brickCanvas.width = textureSize;
    brickCanvas.height = textureSize;
    const brickCtx = brickCanvas.getContext('2d');
    brickCtx.fillStyle = 'rgb(160, 80, 80)';
    brickCtx.fillRect(0, 0, textureSize, textureSize);
    brickCtx.fillStyle = 'rgb(130, 65, 65)';
    brickCtx.fillRect(0, textureSize / 2, textureSize, 1);
    brickCtx.fillRect(textureSize / 2, 0, 1, textureSize);
    return brickCanvas;
};
