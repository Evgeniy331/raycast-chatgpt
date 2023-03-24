import { tileSize, maxDepth, rayAngle, numRays } from '../settings';
import { findPath, isWall, isVisible } from '../utils';
import enemySpriteSrc from '../../assets/images/cacodemon.png';

const enemySprite = new Image();
enemySprite.src = enemySpriteSrc;

export class Enemy {
    constructor(x, y, lives = 4) {
        this.x = x * tileSize + tileSize / 2;
        this.y = y * tileSize + tileSize / 2;
        this.lives = lives;
        this.size = tileSize / 4;

        this.lastVisibleX = null;
        this.lastVisibleY = null;
        this.lastVisibleDir = null;
        this.isReachedVisiblePosition = false;

        this.dir = 0;

        this.state = 'IDLE';
        this.searchStartTime = null;
        this.searchDuration = 3000; // Enemy will search for 3 seconds
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
        // Check if the player is visible
        const isPlayerVisible = isVisible(player.x, player.y, this.x, this.y, tileSize, map) > 0;

        if (isPlayerVisible) {
            this.lastVisibleX = Math.floor(player.x / tileSize);
            this.lastVisibleY = Math.floor(player.y / tileSize);
            this.lastVisibleDir = player.dir;
        }

        if (isPlayerVisible) {
            this.state = 'CHASE';
            this.searchStartTime = null;
        } else if (this.state === "CHASE") {
            this.state = "SEARCH";
            this.searchDuration = this.searchTime;
            this.searchDirection = Math.random() < 0.5 ? -1 : 1;
          }

        if (this.state !== 'SEARCH') {
            this.isReachedVisiblePosition = false;
        }

        if (this.state === 'IDLE') {
            // Just wait for the player
        } else if (this.state === 'CHASE') {
            this.chasePlayer(dt, player, map);
        } else if (this.state === 'SEARCH') {
            // this.updateSearch(dt, player, map);
            this.searchPlayer(dt, player, map);
        }
    }

    searchPlayer(dt, player, map) { 
        if (this.searchStartTime === null) {
            this.searchStartTime = Date.now();
          }
      
          // If the search duration has passed, switch to IDLE state
          if (Date.now() - this.searchStartTime > this.searchDuration) {
            this.state = 'IDLE';
            this.searchStartTime = null;
            return;
          }

          if (this.isReachedVisiblePosition) {
            const startX = Math.floor(this.x / tileSize);
            const startY = Math.floor(this.y / tileSize);
            // Enemy has reached the player's last visible position, try to predict the player's direction
            const predictionAngle = this.lastVisibleDir;
            const predictionDistance = 50; // Set the prediction distance
            const predictedX = this.lastVisibleX * tileSize + tileSize / 2 + predictionDistance * Math.cos(predictionAngle);
            const predictedY = this.lastVisibleY * tileSize + tileSize / 2 + predictionDistance * Math.sin(predictionAngle);

            const newPath = findPath(startX, startY, Math.floor(predictedX / tileSize), Math.floor(predictedY / tileSize), map);

            if (newPath.length > 1) {
                const nextStep = newPath[1];
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
            return;
          }

          const startX = Math.floor(this.x / tileSize);
          const startY = Math.floor(this.y / tileSize);

          const path = findPath(startX, startY, this.lastVisibleX, this.lastVisibleY, map);

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
        } else {
            this.isReachedVisiblePosition = true;
        }
    }

    chasePlayer(dt, player, map) {
        // Update the enemy's position and behavior based on the player's position
        const startX = Math.floor(this.x / tileSize);
        const startY = Math.floor(this.y / tileSize);
        const endX = Math.floor(player.x / tileSize);
        const endY = Math.floor(player.y / tileSize);

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
