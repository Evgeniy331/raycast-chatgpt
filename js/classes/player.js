import { tileSize, maxDepth, fov } from '../settings';
import { keyStates } from '../input';
import { Weapon } from './weapon';
import { isWall, castRay, normalizeAngle, spawn } from '../utils';
import weaponSpriteSrc from '../../assets/shotgun.png';

const weaponSprite = new Image();
weaponSprite.src = weaponSpriteSrc;

const weaponFrames = 4;
const weaponWidth = 405 / weaponFrames - 3;
const weaponHeight = 149;

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = tileSize / 2;
        this.dir = 0;
        this.speed = 4;
        this.turnSpeed = (Math.PI / 180) * 2;
        this.size = tileSize / 4;
        this.weapon = new Weapon(weaponSprite, weaponFrames, weaponWidth, weaponHeight, 50);
        this.weaponBob = 0;

        this.health = 80;
        this.maxHealth = 100;
    }

    move(dx, dy, dt, map) {
        const newX = this.x + dx;
        const newY = this.y + dy;

        if (!isWall(newX, newY, map)) {
            this.x = newX;
            this.y = newY;

            if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
                this.weaponBob += dt * 10;
            } else {
                this.weaponBob = 0;
            }
        }
    }

    update(deltaTime, map) {
        let dx = 0;
        let dy = 0;
        let moving = false;

        if (keyStates['ArrowUp']) {
            dx += Math.cos(this.dir) * this.speed;
            dy += Math.sin(this.dir) * this.speed;
            moving = true;
        }

        if (keyStates['ArrowDown']) {
            dx -= Math.cos(this.dir) * this.speed;
            dy -= Math.sin(this.dir) * this.speed;
            moving = true;
        }

        if (keyStates['ArrowLeft']) {
            this.dir -= this.turnSpeed;
        }

        if (keyStates['ArrowRight']) {
            this.dir += this.turnSpeed;
        }

        this.move(dx, dy, deltaTime, map);

        // Update the weapon
        this.weapon.move(deltaTime, moving);
        this.weapon.update(deltaTime);
    }

    renderWeapon(ctx, canvas) {
        // Draw the weapon
        this.weapon.render(ctx, canvas, this.weaponBob);
    }

    renderHealthBar(ctx, canvas) {
        const barWidth = 200;
        const barHeight = 20;
        const x = 10;
        const y = canvas.height - barHeight - 10;

        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw health
        const healthWidth = (this.health / this.maxHealth) * barWidth;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(x, y, healthWidth, barHeight);

        // Draw border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);
    }

    respawn(x, y) {
        this.x = x;
        this.y = y;
    }

    shoot(enemy, map) {
        const dx = enemy.x - this.x;
        const dy = enemy.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angleToEnemy = Math.atan2(dy, dx);
        const angleDifference = normalizeAngle(angleToEnemy - this.dir);

        // Set the hit range angle
        const hitRangeAngle = fov / 6;

        if (distance < maxDepth && Math.abs(angleDifference) < hitRangeAngle) {
            const rayResult = castRay(this.dir + angleDifference, this, map, tileSize, maxDepth);

            // Check if the ray hits a wall before reaching the enemy
            if (rayResult.distance > distance) {
                enemy.hit(1, this.dir, map);

                if (!enemy.isAlive()) {
                    // Remove enemy or spawn a new one
                    const enemyPos = spawn(this.x, this.y, tileSize / 2, tileSize, map);
                    enemy.respawn(enemyPos.x, enemyPos.y);
                }
            }
        }

        this.weapon.shoot();
    }
}
