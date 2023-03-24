export class Weapon {
    constructor(sprite, frameCount, frameWidth, frameHeight, animationSpeed = 50, bobbingSpeed = 0.01, bobbingAmount = 5) {
        this.sprite = sprite;

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
    }

    update(deltaTime) {
        if (this.currentFrame === 0) return;
        this.frameTime += deltaTime;
        if (this.frameTime > this.animationSpeed) {
            // console.warn(this);
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            // console.warn('this.currentFrame=', this.currentFrame);
            this.frameTime = 0;
        }
    }

    move(deltaTime, moving) {
        if (moving) {
            this.bobbingOffset += this.bobbingSpeed * deltaTime;
        } else {
            this.bobbingOffset = 0;
        }
        // this.elapsedTime += deltaTime;
        // this.bobbingOffset = Math.sin(this.elapsedTime * this.bobbingSpeed) * this.bobbingAmount;
    }

    shoot() {
        this.currentFrame = 1;
        this.frameTime = 0;
    }

    render(ctx, canvas) {
        const weaponX = (canvas.width - this.frameWidth) / 2;
        const weaponY = canvas.height - this.frameHeight;
        const offsetX = Math.sin(this.bobbingOffset) * this.bobbingAmount;
        const offsetY = Math.abs(Math.sin(this.bobbingOffset)) * this.bobbingAmount;

        /*
        const weaponX = (canvas.width - this.frameWidth) / 2 + this.bobbingOffset;
        const weaponY = canvas.height - this.frameHeight;
        console.warn('bobbingOffset=', this.bobbingOffset)
        */
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
