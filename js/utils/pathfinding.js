import PF from 'pathfinding';

export const createGridForPathfinding = (map) => {
    const grid = new Array(map.length);

    for (let y = 0; y < map.length; y++) {
        grid[y] = new Array(map[y].length);
        for (let x = 0; x < map[y].length; x++) {
            grid[y][x] = map[y][x] === 1 ? 1 : 0;
        }
    }

    return grid;
};

export const findPath = (startX, startY, endX, endY, map) => {
    const gridData = createGridForPathfinding(map);
    const grid = new PF.Grid(gridData);
    const finder = new PF.AStarFinder();
    const path = finder.findPath(startX, startY, endX, endY, grid);

    return path;
};
