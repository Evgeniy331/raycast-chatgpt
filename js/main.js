import { mapWidth, mapHeight, tileSize, numRays, fov, rayAngle, maxDepth } from './settings';
import { generateMaze, spawn, castRay, isVisible, getPixel, setPixel, loadTextures } from './utils';
import { Player, Enemy, Minimap } from './classes';

let floorTexture, wallTexture, map, canvas, ctx, player, playerPos, minimap, enemy, enemyPos, floorImageData, backBuffer;

canvas = document.getElementById('gameCanvas');
ctx = canvas.getContext('2d');

let levelsSelect = document.getElementById('levels');
let toggleFloorCheckbox = document.getElementById('toggleFloor');

const stripWidth = canvas.width / numRays;
const textureSize = 64;

const start = async () => {
    const textures = await loadTextures();

    floorTexture = textures.floorTexture;
    wallTexture = textures.wallTexture;

    let tmpCanvas = document.createElement('canvas');
    // Canvas needs to be big enough for the floor texture
    tmpCanvas.width = floorTexture.width;
    tmpCanvas.height = floorTexture.height;
    let tmpContext = tmpCanvas.getContext('2d');

    tmpContext.drawImage(floorTexture, 0, 0, floorTexture.width, floorTexture.height);
    floorImageData = tmpContext.getImageData(0, 0, tileSize, tileSize);

    tmpContext.drawImage(wallTexture, 0, 0, wallTexture.width, wallTexture.height);

    map = generateMaze(mapWidth, mapHeight);

    player = new Player(tileSize * 2, tileSize * 2);
    playerPos = spawn(player.x, player.y, tileSize / 2, tileSize, map);
    player.respawn(playerPos.x, playerPos.y);

    enemy = new Enemy(0, 0);
    enemyPos = spawn(player.x, player.y, tileSize / 2, tileSize, map);
    enemy.respawn(enemyPos.x, enemyPos.y);

    canvas.addEventListener('click', () => player.shoot(enemy, map));
    minimap = new Minimap(map, tileSize, 0.1);

    backBuffer = ctx.createImageData(canvas.width, canvas.height);

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
};


const drawFloor = ({ i, displayHeight, rayDir }) => {
      const strip = i;
      const centerY = displayHeight / 2;

      const screenX = strip * stripWidth;
      const cosRayAngle = Math.cos(rayDir);
      const sinRayAngle = Math.sin(rayDir);
      let screenY = centerY;

      // floor code
      for (; screenY < displayHeight; screenY++) {
        const dy = screenY - canvas.height / 2;
        const floorDistance = dy === 0 ? 0 : (player.z * displayHeight) / 2 / dy;

        let worldX = player.x + floorDistance * cosRayAngle;
        let worldY = player.y + floorDistance * sinRayAngle;

        if (worldX < 0 || worldY < 0 || worldX >= tileSize * map[0].length || worldY >= tileSize * map.length) {
            continue;
        }

        let textureX = Math.floor(worldX) % tileSize;
        let textureY = Math.floor(worldY) % tileSize;

        if (tileSize != textureSize) {
            textureX = Math.floor((textureX / tileSize) * textureSize);
            textureY = Math.floor((textureY / tileSize) * textureSize);
        }
        let srcPixel = getPixel(floorImageData, textureX, textureY);
        setPixel(backBuffer, screenX, screenY, srcPixel.r, srcPixel.g, srcPixel.b, 255);
    }
}

function render() {
    backBuffer = ctx.createImageData(canvas.width, canvas.height);

    const levels = parseInt(levelsSelect.value);

    const objectsToRender = [];
    const displayHeight = canvas.height;

    for (let i = 0; i < numRays; i++) {
      const rayDir = player.dir - fov / 2 + i * rayAngle;

      const rayResult = castRay(rayDir, player, map, tileSize, maxDepth);
      const depth = rayResult.distance;

      const wallHeight = (tileSize / depth) * (canvas.height / 2);

      const wallTextureX = rayResult.verticalHit
          ? Math.floor((rayResult.hitY % tileSize) * (wallTexture.width / tileSize))
          : Math.floor((rayResult.hitX % tileSize) * (wallTexture.width / tileSize));

        for (let level = 0; level < levels; level++) {
          objectsToRender.push({
              ...rayResult,
              type: 'wall',
              depth: depth,
              height: wallHeight,
              x: i * (canvas.width / numRays),
              y: (canvas.height - wallHeight) / 2 - wallHeight * level,
              width: canvas.width / numRays,
              textureX: wallTextureX,
          });
      }

        if (toggleFloorCheckbox.checked) {
            drawFloor({ i, displayHeight, rayDir });
        }
    }

    const enemyDistance = isVisible(player.x, player.y, enemy.x, enemy.y, tileSize, map);

    if (enemyDistance > 0) {
        objectsToRender.push({
            type: 'enemy',
            depth: enemyDistance,
        });
    }

    objectsToRender.sort((a, b) => b.depth - a.depth);

    if (toggleFloorCheckbox.checked) {
      // draw floor buffer
      ctx.putImageData(backBuffer, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#2d2a2a';
      ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    }

    // draw walls
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



start();
