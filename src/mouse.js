const getMouse = (element) => {
    const mouse = {
        x: 0,
        y: 0,
        s: false,
        left: false,
        pleft: false
    };

    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    element.addEventListener('wheel', (e) => {
        mouse.s = !mouse.s;
    });

    element.addEventListener('mousedown', (e) => {
        if (e.buttons === 1) mouse.left = true;
    });

    element.addEventListener('mouseup', (e) => {
        if (e.buttons !== 1) mouse.left = false;
    });

    return mouse;
};