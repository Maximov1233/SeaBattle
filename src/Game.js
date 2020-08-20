class Game {
    constructor() {
        this.stage = 'preparation';
        this.move = true;

        this.player = new Topology({
            offsetX: 60,
            offsetY: 90
        });

        this.computer = new Topology({
            offsetX: 600,
            offsetY: 100,
            secret: true
        });

        this.computer.randomizer();
        // this.player.randomizer();
        // this.stage = 'play';

        requestAnimationFrame(x => this.tick(x));
    }
    tick(timestamp) {
        requestAnimationFrame(x => this.tick(x));

        clearCanvas();
        drawGrid();

        this.player.draw(context);
        this.computer.draw(context);

        if (this.stage === 'preparation') {
            this.tickPreparation(timestamp);
        } else if (this.stage === 'play') {
            this.tickPlay(timestamp);
        }

        mouse.pleft = mouse.left;
    }

    tickPreparation(timestamp) {
        if (!this.player.isOverMap(mouse)) {
            return;
        }

        const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1],
            shipSize = shipSizes[this.player.ships.length];

        const coordinates = this.player.getCoordinates(mouse);

        const ship = {
            x: coordinates.x,
            y: coordinates.y,
            direct: mouse.s ? 0 : 1,
            size: shipSize,
            shipBodyCoordinates: [],
            injuries: 0
        };

        for (let i = 0; i < ship.size; i++) {
            if (ship.direct === 0) {
                ship.shipBodyCoordinates.push({
                    x: ship.x + i,
                    y: ship.y
                })
            } else {
                ship.shipBodyCoordinates.push({
                    x: ship.x,
                    y: ship.y + i
                })
            }
        }

        if (!this.player.canStay(ship)) return;

        this.player.drawShip(context, ship);

        if (mouse.left && !mouse.pleft) {
            this.player.addShips(ship);

            if (this.player.ships.length === 10) {
                this.stage = 'play';
            }
        }
    }

    tickPlay(timestamp) {
        if (this.move) {
            if (!this.computer.isOverMap(mouse)) return;

            const point = this.computer.getCoordinates(mouse);

            if (mouse.left && !mouse.pleft) {
                if (!this.computer
                    .includingCheck(point, [this.computer.checks, this.computer.injuries])) 
                    {
                    this.computer.addChecks(point);
                    if (
                        !this.computer.getPointStatus(point, [this.computer.checks, this.computer.injuries]) &&
                        (!this.computer.update(point))) {
                        this.move = false;
                    }
                }
            }
        } else {
            const point = {
                x: Math.floor(Math.random() * 10),
                y: Math.floor(Math.random() * 10)
            };

            if (!this.player
                .includingCheck(point, [this.player.checks,this.player.injuries]))
                {   
                this.player.addChecks(point);
                if (
                    !this.player.getPointStatus(point, [this.player.checks, this.player.injuries]) &&
                    !this.player.update(point)) {
                    this.move = true;
                }
            }
        }
    }
};