import { tileSize, maxDepth, rayAngle, numRays } from '../settings';
import { findPath, isWall } from '../utils';
import enemySpriteSrc from '../../assets/cacodemon.png';

const enemySprite = new Image();
enemySprite.src = enemySpriteSrc;

export class Enemy {
    constructor(x, y, lives = 4) {
        this.x = x * tileSize + tileSize / 2;
        this.y = y * tileSize + tileSize / 2;
        this.lives = lives;
        this.size = tileSize / 4;
    }

    isAlive() {
        return this.lives > 0;
    }

    hit(damage = 1, direction, map) {
        this.lives -= damage;

        // Knockback amount
        const knockbackDistance = 32;

        // Calculate new position after knockback
        const newX = this.x + Math.cos(direction) * knockbackDistance;
        const newY = this.y + Math.sin(direction) * knockbackDistance;

        // Check if the new position is not inside a wall
        if (!isWall(newX, newY, map)) {
            this.x = newX;
            this.y = newY;
        }
    }

    respawn(x, y, lives = 4) {
        this.x = x;
        this.y = y;
        this.lives = lives;
    }

    update(dt, player, map) {
        // Update the enemy's position and behavior based on the player's position
        const startX = Math.floor(this.x / tileSize);
        const startY = Math.floor(this.y / tileSize);
        const endX = Math.floor(player.x / tileSize);
        const endY = Math.floor(player.y / tileSize);

        if (!map) {
            console.warn('map doesnt exist');
        }
        const path = findPath(startX, startY, endX, endY, map);

        if (path.length > 1) {
            const nextStep = path[1];
            const dx = nextStep[0] * tileSize + tileSize / 2 - this.x;
            const dy = nextStep[1] * tileSize + tileSize / 2 - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 1) {
                const speed = 50; // Set the enemy speed
                const moveFraction = (speed * dt) / 1000;
                this.x += (dx / distance) * moveFraction;
                this.y += (dy / distance) * moveFraction;
            }
        }
    }

    render(ctx, canvas, player) {
        // Render the enemy on the screen
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        let angleToEnemy = Math.atan2(dy, dx) - player.dir;

        // Normalize angleToEnemy to be between -π and π
        while (angleToEnemy < -Math.PI) angleToEnemy += 2 * Math.PI;
        while (angleToEnemy > Math.PI) angleToEnemy -= 2 * Math.PI;

        if (distance < maxDepth) {
            const enemyHeight = (tileSize / distance) * (canvas.height / 2) * 0.5;
            const enemyWidth = enemyHeight;
            const enemyX = canvas.width / 2 + (angleToEnemy / rayAngle) * (canvas.width / numRays) - enemyWidth / 2;
            const enemyY = (canvas.height - enemyHeight) / 2;

            ctx.drawImage(enemySprite, enemyX, enemyY, enemyWidth, enemyHeight);
        }
    }
}
