// input.js
const keyStates = {};

window.addEventListener('keydown', (event) => {
    keyStates[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keyStates[event.code] = false;
});

export { keyStates };
