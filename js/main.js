import { mapWidth, mapHeight, tileSize, numRays, fov, rayAngle, maxDepth } from './settings';
import { generateMaze, spawn, castRay, isVisible } from './utils';
import { Player, Enemy, Minimap } from './classes';
import wallTextureSrc from '../assets/brickWall.jpg';

const wallTexture = new Image();
wallTexture.src = wallTextureSrc

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const map = generateMaze(mapWidth, mapHeight);

const player = new Player(tileSize * 2, tileSize * 2);
const playerPos = spawn(player.x, player.y, tileSize / 2, tileSize, map);
player.respawn(playerPos.x, playerPos.y);

const enemy = new Enemy(0, 0);
const enemyPos = spawn(player.x, player.y, tileSize / 2, tileSize, map);
enemy.respawn(enemyPos.x, enemyPos.y);

canvas.addEventListener('click', () => player.shoot(enemy, map));

const minimap = new Minimap(map, tileSize, 0.1);

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const objectsToRender = [];

    for (let i = 0; i < numRays; i++) {
        const rayDir = player.dir - fov / 2 + i * rayAngle;
        const rayResult = castRay(rayDir, player, map, tileSize, maxDepth);
        const depth = rayResult.distance;
        const columnHeight = (tileSize / depth) * (canvas.height / 2);

        const textureX = rayResult.verticalHit
            ? Math.floor(rayResult.hitY % tileSize * (wallTexture.width / tileSize))
            : Math.floor(rayResult.hitX % tileSize * (wallTexture.width / tileSize));

        objectsToRender.push({
            type: 'wall',
            depth: depth,
            height: columnHeight,
            x: i * (canvas.width / numRays),
            y: (canvas.height - columnHeight) / 2,
            width: canvas.width / numRays,
            textureX: textureX,
        });
    }

    const enemyDistance = isVisible(player.x, player.y, enemy.x, enemy.y, tileSize, map);

    if (enemyDistance > 0) {
        objectsToRender.push({
            type: 'enemy',
            depth: enemyDistance,
        });
    }

    objectsToRender.sort((a, b) => b.depth - a.depth);

    for (const object of objectsToRender) {
        if (object.type === 'wall') {
            ctx.drawImage(
                wallTexture,
                object.textureX,
                0,
                1,
                wallTexture.height,
                object.x,
                object.y,
                object.width,
                object.height
            );
        } else if (object.type === 'enemy') {
            enemy.render(ctx, canvas, player);
        }
    }

    player.renderWeapon(ctx, canvas);
    player.renderHealthBar(ctx, canvas);
}

let lastTimestamp = 0;

function gameLoop(timestamp) {
    const dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    player.update(dt, map);
    enemy.update(dt, player, map);
    render();
    minimap.render(ctx, player, enemy, map);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
