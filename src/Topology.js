class Topology {
    constructor(param) {
        this.offsetX = param.offsetX,
            this.offsetY = param.offsetY,
            this.secret = param.secret || false;

        this.ships = [],
        this.checks = [],
        this.injuries = [],
        this.kills = []
    }

    addShips(...ships) {
        for (const ship of ships) {
            if (!this.ships.includes(ship)) {
                this.ships.push(ship);
            }
        }

        return this;
    }

    getPointStatus(point, arr) {
        let check = false;
        // arr = arr.flat();
        console.log(arr);
        console.log(point);
        for (let i = 0; i < arr.length - 1; i++) {
            // console.log(JSON.stringify(point) === JSON.stringify(arr[i]));
            if (JSON.stringify(point) === JSON.stringify(arr[i])) check = true;
        }
        console.log(check);
        return check;
    }

    addChecks(...checks) {
        for (const check of checks) {
            if (!this.checks.includes(check)) {
                this.checks.push(check);
            }
        }
        return this;
    }

    draw(context) {
        this.drawFields(context);

        if (!this.secret) {
            for (const ship of this.ships) {
                this.drawShip(context, ship);
            }
        }

        for (const check of this.checks) {
            this.drawCheck(context, check);
        }

        for (const kill of this.kills) {
            this.drawKill(context, kill);
        }

        for (const injury of this.injuries) {
            this.drawInjury(context, injury);
        }

        return this;
    }

    drawFields(context) {
        context.strokeStyle = 'blue';
        context.lineWidth = 1.7;
        for (let i = 1; i <= 11; i++) {
            context.beginPath();
            context.moveTo(
                this.offsetX + i * fieldSize,
                this.offsetY
            )
            context.lineTo(
                this.offsetX + i * fieldSize,
                this.offsetY + 11 * fieldSize
            )
            context.stroke();
        }

        for (let i = 1; i <= 11; i++) {
            context.beginPath();
            context.moveTo(
                this.offsetX,
                this.offsetY + i * fieldSize
            )
            context.lineTo(
                this.offsetX + 11 * fieldSize,
                this.offsetY + i * fieldSize
            )
            context.stroke();
        }

        context.textAlign = "center";
        context.font = "20px Roboto";
        context.fillStyle = 'black';

        const alpabet = "АБВГДЕЖЗИК";

        for (let i = 0; i < alpabet.length; i++) {
            const letter = alpabet[i];

            context.fillText(
                letter,
                this.offsetX + i * fieldSize + fieldSize * 1.5,
                this.offsetY + fieldSize * 0.8
            );
        }

        for (let i = 1; i <= 10; i++) {
            context.fillText(
                i,
                this.offsetX + fieldSize * 0.5,
                this.offsetY + i * fieldSize + fieldSize * 0.8
            );
        }

        return this;
    }

    drawShip(context, ship) {
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.beginPath();
        context.rect(
            this.offsetX + ship.x * fieldSize + fieldSize + 2,
            this.offsetY + ship.y * fieldSize + fieldSize + 2,
            (ship.direct === 0 ? ship.size : 1) * fieldSize - 4,
            (ship.direct === 1 ? ship.size : 1) * fieldSize - 4

        );
        context.fill();

        return this;
    }

    drawCheck(context, check) {
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(
            this.offsetX + check.x * fieldSize + fieldSize * 1.5,
            this.offsetY + check.y * fieldSize + fieldSize * 1.5,
            3,
            0,
            Math.PI * 2
        );
        context.fill();

        return this;
    }

    drawInjury(context, injury) {
        context.strokeStyle = 'red';
        context.beginPath();
        context.moveTo(
            this.offsetX + injury.x * fieldSize + fieldSize,
            this.offsetY + injury.y * fieldSize + fieldSize
        );
        context.lineTo(
            this.offsetX + injury.x * fieldSize + fieldSize * 2,
            this.offsetY + injury.y * fieldSize + fieldSize * 2
        );
        context.stroke();

        context.beginPath();
        context.moveTo(
            this.offsetX + injury.x * fieldSize + fieldSize,
            this.offsetY + injury.y * fieldSize + fieldSize * 2
        );
        context.lineTo(
            this.offsetX + injury.x * fieldSize + fieldSize * 2,
            this.offsetY + injury.y * fieldSize + fieldSize
        );
        context.stroke();

        return this;
    }

    drawKill(context, kill) {
        this.drawShip(context, kill);
        context.strokeStyle = 'red';
        context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        context.beginPath();
        context.rect(
            this.offsetX + kill.x * fieldSize + fieldSize,
            this.offsetY + kill.y * fieldSize + fieldSize,
            (kill.direct === 0 ? kill.size : 1) * fieldSize,
            (kill.direct === 1 ? kill.size : 1) * fieldSize

        );
        context.fill();

        context.beginPath();
        context.lineWidth = 2;
        context.strokeRect(
            this.offsetX + kill.x * fieldSize + fieldSize,
            this.offsetY + kill.y * fieldSize + fieldSize,
            (kill.direct === 0 ? kill.size : 1) * fieldSize,
            (kill.direct === 1 ? kill.size : 1) * fieldSize
        );

        context.fill();

        return this;
    }

    // newDrawKill() {

    // }

    isOverMap(point) {
        if (point.x < this.offsetX + fieldSize ||
            point.x > this.offsetX + 11 * fieldSize ||
            point.y < this.offsetY + fieldSize ||
            point.y > this.offsetY + 11 * fieldSize
        ) {
            return false;
        }
        return true;
    }

    includingCheck(point, arr) {
        for (const item of arr) {
            if (JSON.stringify(item) === JSON.stringify(point)) {
                return true;
            }
        }
        return false;
    }

    killCheck() {
        for (const ship of this.ships) {
            if (ship.injuries === ship.size) {
                console.log('kill');
                this.kills.push(ship);
                ship.injuries = 'killed';
                this.addKilledChecks(ship);
                if (this.kills.length === this.ships.length) {
                    setTimeout(() => {
                        alert('ураааааа');
                    }, 100);
                }
            }
        }
        return true;
    }

    addKilledChecks(ship) {
        let arr = [];
        if (ship.direct === 0) {
            for (let x = -1; x < ship.size + 1; x++) {
                for (let y = -1; y < 2; y++) {   
                    arr.push({
                        x: ship.x + x,
                        y: ship.y + y
                    });
                }          
            }
        } else {
            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < ship.size + 1; y++) {
                    arr.push({
                        x: ship.x + x,
                        y: ship.y + y
                    });
                }          
            }
        }

        arr = arr.filter((elem) => {
            return elem.x >= 0 && elem.x <= 9 && elem.y >= 0 && elem.y <= 9;
        });

        for (let i = 0; i < arr.length; i++) {
            if((!this.includingCheck(arr[i], this.injuries)) &&
            !this.includingCheck(arr[i], this.checks)){
                this.checks.push(arr[i]); 
            }
        }
    }

    getCoordinates(point) {
        if (!this.isOverMap(point)) {
            return false;
        }

        const x = parseInt((point.x - this.offsetX - fieldSize) / fieldSize),
            y = parseInt((point.y - this.offsetY - fieldSize) / fieldSize);

        return {
            x: Math.max(0, Math.min(9, x)),
            y: Math.max(0, Math.min(9, y))
        }
    }

    canStay(ship) {

        if (ship.direct === 0 && ship.x + ship.size > 10) {
            return false;
        }

        if (ship.direct === 1 && ship.y + ship.size > 10) {
            return false;
        }

        const map = [
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true]
        ];

        for (const ship of this.ships) {
            if (ship.direct === 0) {
                for (let x = ship.x - 1; x < ship.x + ship.size + 1; x++) {
                    for (let y = ship.y - 1; y < ship.y + 2; y++) {
                        if (map[y] && map[y][x]) {
                            map[y][x] = false;
                        }
                    }
                }
            } else {
                for (let x = ship.x - 1; x < ship.x + 2; x++) {
                    for (let y = ship.y - 1; y < ship.y + ship.size + 1; y++) {
                        if (map[y] && map[y][x]) {
                            map[y][x] = false;
                        }
                    }
                }
            }
        }

        if (ship.direct === 0) {
            for (let i = 0; i < ship.size; i++) {
                if (!map[ship.y][ship.x + i]) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < ship.size; i++) {
                if (!map[ship.y + i][ship.x]) {
                    return false;
                }
            }
        }

        return true;

    }

    randomizer() {
        this.ships = [];
        for (let size = 4; size > 0; size--) {
            for (let n = 0; n < 5 - size; n++) {
                let flag = false;
                while (!flag) {
                    const ship = {
                        x: Math.floor(Math.random() * 10),
                        y: Math.floor(Math.random() * 10),
                        direct: Math.random() > Math.random() ? 0 : 1,
                        size,
                        shipBodyCoordinates: [],
                        injuries: 0,
                    }

                    for (let i = 0; i < ship.size; i++) {
                        if (ship.direct === 0) {
                            ship.shipBodyCoordinates.push({
                                x: ship.x + i,
                                y: ship.y
                            });
                        } else {
                            ship.shipBodyCoordinates.push({
                                x: ship.x,
                                y: ship.y + i
                            });
                        }
                    }

                    if (this.canStay(ship)) {
                        this.addShips(ship);
                        flag = true;
                    }
                }
            }
        }
    }

    update() {
        this.checks = this.checks
            .map(check => JSON.stringify(check))
            .filter((e, i, l) => l.lastIndexOf(e) === i)
            .map(check => JSON.parse(check));

        const map = [
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false]
        ];

        let hit = false;

        for (const ship of this.ships) {
            if (ship.direct === 0) {
                for (let x = ship.x; x < ship.x + ship.size; x++) {
                    if (map[ship.y] && !map[ship.y][x]) {
                        map[ship.y][x] = true;
                    }
                }
            } else {
                for (let y = ship.y; y < ship.y + ship.size; y++) {
                    if (map[y] && !map[y][ship.x]) {
                        map[y][ship.x] = true;
                    }
                }
            }
        }

        for (const check of this.checks) {
            if (map[check.y][check.x]) {
                if (!this.includingCheck(check, this.injuries)) {
                    this.injuries.push(check);
                    for (const ship of this.ships) {
                        for (const block of ship.shipBodyCoordinates) {
                            if (JSON.stringify(check) === JSON.stringify(block)) {
                                ship.injuries++;
                                hit = true;
                            }
                        }
                    }
                }

                const index = this.checks.indexOf(check);
                this.checks.splice(index, 1);           
            }
        }

        this.killCheck();

        return hit;
    }
};