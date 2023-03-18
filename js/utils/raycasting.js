export const castRay = (angle, player, map, tileSize, maxDepth) => {
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    let x = player.x;
    let y = player.y;
    let depth = 0;
    let hitX, hitY;

    while (depth < maxDepth) {
        depth += 1;
        x += dx;
        y += dy;

        const mapX = Math.floor(x / tileSize);
        const mapY = Math.floor(y / tileSize);

        // Check if the ray is within the map boundaries
        if (mapY < 0 || mapY >= map.length || mapX < 0 || mapX >= map[0].length) {
            return { distance: maxDepth };
        }

        if (map[mapY][mapX] === 1) {
            hitX = x % tileSize;
            hitY = y % tileSize;
            return { distance: depth, hitX, hitY };
        }
    }

    return { distance: maxDepth };
};
