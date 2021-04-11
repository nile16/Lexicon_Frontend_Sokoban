class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.classList = document.getElementById(
            this.x + "_" + this.y
        ).classList;
    }

    isWall() {
        return this.classList.contains("tile-Wall");
    }

    isBlock() {
        return (
            this.classList.contains("entity-block") ||
            this.classList.contains("entity-block-goal")
        );
    }

    isGoal() {
        return this.classList.contains("tile-Goal");
    }

    isFree() {
        return !this.isWall() && !this.isBlock();
    }

    makeFree() {
        this.classList.remove(
            "entity-block-goal",
            "entity-block",
            "entity-player",
            "entity-player-goal"
        );
    }

    makeBlock() {
        this.makeFree();
        if (this.isGoal()) {
            this.classList.add("entity-block-goal");
        } else {
            this.classList.add("entity-block");
        }
    }

    makePlayer() {
        this.makeFree();
        if (this.isGoal()) {
            this.classList.add("entity-player-goal");
        } else {
            this.classList.add("entity-player");
        }
    }

    neigbour(move) {
        return new Position(this.x + move.x, this.y + move.y);
    }

    move(move) {
        this.x += move.x;
        this.y += move.y;
        this.classList = document.getElementById(
            this.x + "_" + this.y
        ).classList;
    }
}

let playerPosition, steps;

document
    .getElementById("restartGameBtn")
    .addEventListener("click", initilizeGame);

function initilizeGame() {
    let board = document.getElementById("board");
    let px, py;

    document.addEventListener("keydown", keyPressed);

    document.getElementById("popup").style.display = "none";
    document.getElementById("stepCounterField").innerHTML = "0";

    steps = 0;
    board.innerHTML = "";
    board.style.height = tileMap01.height * 50 + "px";
    board.style.width = tileMap01.width * 50 + "px";

    for (let y = 0; y < tileMap01.height; y++) {
        for (let x = 0; x < tileMap01.width; x++) {
            let newDiv = document.createElement("div");

            newDiv.id = x + "_" + y;
            newDiv.classList.add("tile");

            switch (tileMap01.mapGrid[y][x][0]) {
                case " ": {
                    newDiv.classList.add("tile-Space");
                    break;
                }
                case "W": {
                    newDiv.classList.add("tile-Wall");
                    break;
                }
                case "B": {
                    newDiv.classList.add("tile-Space");
                    newDiv.classList.add("entity-block");
                    break;
                }
                case "G": {
                    newDiv.classList.add("tile-Goal");
                    break;
                }
                case "P": {
                    newDiv.classList.add("tile-Space");
                    newDiv.classList.add("entity-player");
                    px = x;
                    py = y;
                    break;
                }
            }

            board.appendChild(newDiv);
        }
    }
    playerPosition = new Position(px, py);
}

function keyPressed(event) {
    event.preventDefault();

    switch (event.key) {
        case "ArrowUp": {
            tryToMove({ x: 0, y: -1 });
            break;
        }
        case "ArrowDown": {
            tryToMove({ x: 0, y: 1 });
            break;
        }
        case "ArrowRight": {
            tryToMove({ x: 1, y: 0 });
            break;
        }
        case "ArrowLeft": {
            tryToMove({ x: -1, y: 0 });
            break;
        }
    }
}

function incSteps() {
    document.getElementById("stepCounterField").innerHTML = ++steps;
}

function isGameWon() {
    return document.getElementsByClassName("entity-block").length == 0;
}

function displayWin() {
    document.removeEventListener("keydown", keyPressed);
    document.getElementById("popup").style.display = "block";
}

function tryToMove(direction) {
    if (playerPosition.neigbour(direction).isFree()) {
        playerPosition.makeFree();
        playerPosition.neigbour(direction).makePlayer();

        playerPosition = playerPosition.neigbour(direction);

        incSteps();
    } else if (
        playerPosition.neigbour(direction).isBlock() &&
        playerPosition.neigbour(direction).neigbour(direction).isFree()
    ) {
        playerPosition.makeFree();
        playerPosition.neigbour(direction).makePlayer();
        playerPosition.neigbour(direction).neigbour(direction).makeBlock();

        playerPosition = playerPosition.neigbour(direction);

        incSteps();

        if (isGameWon()) {
            displayWin();
        }
    }
}

initilizeGame();
