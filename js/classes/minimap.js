export class Minimap {
    constructor(maze, tileSize, minimapScale) {
        this.maze = maze;
        this.tileSize = tileSize;
        this.miniMapScale = minimapScale;
    }

    render(ctx, player, enemy, map) {
        const miniPlayerSize = player.size * 3; // Set the size of the player on the minimap
        const halfMiniPlayerSize = miniPlayerSize / 2;

        ctx.save();
        ctx.scale(this.miniMapScale, this.miniMapScale);

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                const tile = map[y][x];

                if (tile === 1) {
                    ctx.fillStyle = 'black';
                } else {
                    ctx.fillStyle = 'white';
                }

                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }

        // Draw player as a circle
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(player.x, player.y, halfMiniPlayerSize, 0, 2 * Math.PI);
        ctx.fill();

        const directionLength = miniPlayerSize * 1.5;
        const dirX = player.x + directionLength * Math.cos(player.dir);
        const dirY = player.y + directionLength * Math.sin(player.dir);

        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(dirX, dirY);
        ctx.stroke();

        // Draw enemy as a circle
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, halfMiniPlayerSize, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }
}
