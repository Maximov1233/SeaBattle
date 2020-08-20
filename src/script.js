const cellSize = 23,
    fieldSize = 30;

const canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 500;

const game = new Game;

// const drawRect = (param) => {
//     if (!param.fill && !param.stroke) return;

//     context.beginPath();
//     context.rect(param.x, param.y, param.width, param.height);

//     if (param.fill) {
//         context.fillStyle = param.fillStyle;
//         context.fill();
//     }

//     if (param.stroke) {
//         context.strokeStyle = param.strokeStyle;
//         context.lineWidth = param.lineWidth;
//         context.stroke();
//     }
// };

const drawGrid = () => {
    context.strokeStyle = 'blue';
    context.lineWidth = 0.5;
    for (let i = 0; i < canvas.width / cellSize; i++) {
        context.beginPath();
        context.moveTo(i * cellSize, 0);
        context.lineTo(i * cellSize, canvas.height);
        context.stroke();
    }

    for (let i = 0; i < canvas.height / cellSize; i++) {
        context.beginPath();
        context.moveTo(0, i * cellSize);
        context.lineTo(canvas.width, i * cellSize);
        context.stroke();
    }
    context.strokeStyle = 'red';
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(0, 75);
    context.lineTo(canvas.width, 75);
    context.stroke();
};

const clearCanvas = () => {
    canvas.width |= 0;
}

const mouse = getMouse(canvas);

const inj = [
    {
        x: 2,
        y: 2
    },
     {
        x: 3,
        y: 2
    },
    {
        x: 5,
        y: 6
    },
];

const shp = [
    {
        x: 2,
        y: 2
    },
     {
        x: 3,
        y: 2
    },
    
];

// let newArr = inj.concat(shp);
// console.log(newArr);