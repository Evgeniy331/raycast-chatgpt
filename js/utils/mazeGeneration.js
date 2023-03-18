export const generateMaze = (width, height) => {
    const map = new Array(height).fill(null).map(() => new Array(width).fill(1));

    const inBounds = (x, y) => x > 0 && x < width - 1 && y > 0 && y < height - 1;

    const getNeighbors = (x, y) => {
        const neighbors = [];
        if (inBounds(x, y - 2)) neighbors.push([x, y - 2]);
        if (inBounds(x, y + 2)) neighbors.push([x, y + 2]);
        if (inBounds(x - 2, y)) neighbors.push([x - 2, y]);
        if (inBounds(x + 2, y)) neighbors.push([x + 2, y]);
        return neighbors;
    };

    const connect = (x1, y1, x2, y2) => (map[y1 + (y2 - y1) / 2][x1 + (x2 - x1) / 2] = 0);

    const startX = Math.floor(Math.random() * Math.floor(width / 2)) * 2 + 1;
    const startY = Math.floor(Math.random() * Math.floor(height / 2)) * 2 + 1;
    map[startY][startX] = 0;

    const frontier = getNeighbors(startX, startY);
    while (frontier.length) {
        const [x, y] = frontier.splice(Math.floor(Math.random() * frontier.length), 1)[0];
        const neighbors = getNeighbors(x, y).filter(([nx, ny]) => map[ny][nx] === 0);
        if (neighbors.length) {
            const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
            connect(x, y, nx, ny);
            map[y][x] = 0;
            frontier.push(...getNeighbors(x, y).filter(([nx, ny]) => map[ny][nx] === 1));
        }
    }

    return map;
};
