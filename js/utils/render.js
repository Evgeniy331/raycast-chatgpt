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
