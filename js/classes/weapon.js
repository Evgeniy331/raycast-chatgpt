import shootSoundSrc from '../../assets/sounds/shotgun.mp3';

const shootSound = new Audio(shootSoundSrc);

export class Weapon {
    constructor(sprite, frameCount, frameWidth, frameHeight, animationSpeed = 100, bobbingSpeed = 0.01, bobbingAmount = 5) {
        this.sprite = sprite;

        this.disable = false;

        this.frameCount = frameCount;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.animationSpeed = animationSpeed;
        this.currentFrame = 0;
        this.frameTime = 0;
        this.bobbingSpeed = bobbingSpeed;
        this.bobbingAmount = bobbingAmount;
        this.bobbingOffset = 0;
        this.elapsedTime = 0;

        this.isShooting = false;
    }

    update(deltaTime) {
        if (this.currentFrame === 0) return;

        this.frameTime += deltaTime;
        if (this.frameTime > this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount
            this.frameTime = 0;
        }
    }

    move(deltaTime, moving) {
        if (moving) {
            this.bobbingOffset += this.bobbingSpeed * deltaTime;
        } else {
            this.bobbingOffset = 0;
        }
    }

    shoot() {
        if (this.isShooting) {
            return;
        }
        
        shootSound.pause();
        shootSound.currentTime = 0;

        this.isShooting = true;

        setTimeout(() => this.isShooting = false, 600);

        this.currentFrame = 1;
        this.frameTime = 0;
        shootSound.play();
    }

    render(ctx, canvas) {
        const weaponX = (canvas.width - this.frameWidth) / 2;
        const weaponY = canvas.height - this.frameHeight;
        const offsetX = Math.sin(this.bobbingOffset) * this.bobbingAmount;
        const offsetY = Math.abs(Math.sin(this.bobbingOffset)) * this.bobbingAmount + 5;

        ctx.drawImage(
            this.sprite,
            this.frameWidth * this.currentFrame,
            0,
            this.frameWidth,
            this.frameHeight,
            weaponX + offsetX,
            weaponY + offsetY,
            this.frameWidth,
            this.frameHeight
        );
    }
}
