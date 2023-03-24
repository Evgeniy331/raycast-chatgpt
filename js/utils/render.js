export const isVisible = (x1, y1, x2, y2, tileSize, map) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const steps = Math.ceil(distance / tileSize);
    let checkX = x1;
    let checkY = y1;

    for (let i = 1; i <= steps; i++) {
        checkX += dx / steps;
        checkY += dy / steps;

        const tileX = Math.floor(checkX / tileSize);
        const tileY = Math.floor(checkY / tileSize);

        if (map[tileY] && map[tileY][tileX] === 1) {
            return -1;
        }
    }

    return distance;
};

export const setPixel = (imageData, x, y, r, g, b, a) => {
    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
};

export const getPixel = (imageData, x, y) => {
    let index = (x + y * imageData.width) * 4;
    return {
        r: imageData.data[index + 0],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3],
    };
};
