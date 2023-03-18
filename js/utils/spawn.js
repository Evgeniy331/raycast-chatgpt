export const spawn = (entityX, entityY, entitySize, tileSize, map) => {
    const validSpawnPositions = [];

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] === 0) {
                const centerX = x * tileSize + tileSize / 2;
                const centerY = y * tileSize + tileSize / 2;

                const distX = centerX - entityX;
                const distY = centerY - entityY;
                const dist = Math.sqrt(distX * distX + distY * distY);

                if (dist > entitySize * 2) {
                    validSpawnPositions.push({ x: centerX, y: centerY });
                }
            }
        }
    }

    if (validSpawnPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * validSpawnPositions.length);
        const spawnPos = validSpawnPositions[randomIndex];
        return spawnPos;
    }

    console.error('No valid spawn positions found for the enemy.');

    return {
        x: -1,
        y: -1,
    };
};
