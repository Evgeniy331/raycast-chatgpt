import wallTextureSrc from '../../assets/brickWall.jpg';
import floorTextureSrc from '../../assets/floor.png';

const loadImage = async (src) => {
    const image = new Image();
    image.src = src;

    const isLoaded = image.complete && image.naturalHeight;

    if (isLoaded) {
        return image;
    }

    return new Promise((resolve, reject) => {
        image.addEventListener('load', () => resolve(image), false);
        image.addEventListener('error', reject, false);
    });
};

export const loadTextures = async () => {
    const floorTexture = await loadImage(floorTextureSrc);
    const wallTexture = await loadImage(wallTextureSrc);

    return {
        floorTexture,
        wallTexture,
    };
};
